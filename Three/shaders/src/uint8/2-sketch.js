import './style.css'
import * as THREE from 'three'
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js'

// init setup
const screen = { w: window.innerWidth, h: window.innerHeight }
const shape = { w: 1000, h: Math.round(1000 * screen.h / screen.w) }
const state = { frame: 0, dot: 5 }

const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.autoClear = false // GLSL discard need this

// create a data texture
const data = new Uint8Array(shape.w * shape.h * 4)

for (let i = 0; i < shape.w * shape.h; i++) { data[i * 4 + 3] = 255 }

// create a render target with a given data texture
const renderTarget = createRenderTarget(data, shape.w, shape.h)

function createRenderTarget(data, w, h) {
    const texture = new THREE.DataTexture(data, w, h)
    texture.format = THREE.RGBAFormat
    texture.type = THREE.UnsignedByteType
    texture.minFilter = THREE.NearestFilter
    texture.magFilter = THREE.NearestFilter
    texture.needsUpdate = true

    const renderTarget = new THREE.WebGLRenderTarget(w, h)
    renderTarget.texture = texture
    return renderTarget
}

// create a compute shader to write data
const computeShader = new THREE.ShaderMaterial({
    uniforms: {
        resolution: { value: new THREE.Vector2() },
        mouse: { value: new THREE.Vector2() },
        dot: { value: state.dot },
    },
    vertexShader: `void main() { gl_Position = vec4(position, 1.0); }`,
    fragmentShader: `
        uniform vec2 resolution;
        uniform vec2 mouse;
        uniform float dot;

        void main() {
            vec2 r = resolution.xy;
            vec2 c = gl_FragCoord.xy;
            vec2 m = mouse * r;
            vec2 o = c / r;

            vec2 grid = c - mod(c, 1.0);
            vec2 target = m - mod(m, 1.0);
            float distance = length(target - grid);

            if (distance > dot) discard;
            gl_FragColor = vec4(1.0);
        }`,
})
const computeRenderer = new FullScreenQuad(computeShader)

// fullScreenPass to render the result on screen
const shaderPass = new THREE.ShaderMaterial({
    uniforms: { tDiffuse: { value: null } },
    vertexShader: `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
    `,
    fragmentShader: `
        precision highp sampler2D;
        uniform sampler2D tDiffuse;
        varying vec2 vUv;
        void main() { gl_FragColor = texture2D(tDiffuse, vUv); }
    `,
})
const fullScreenPass = new FullScreenQuad(shaderPass)

// render the compute result on screen (1st frame)
renderOnScreen()

function renderOnScreen() {
    shaderPass.uniforms.tDiffuse.value = renderTarget.texture
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setRenderTarget(null)
    fullScreenPass.render(renderer)
}

// create gui panel
const gui = new GUI()
gui.add(state, 'dot', 0, 20, 0.01).onChange(() => { computeShader.uniforms.dot.value = state.dot })

// mouse event handling
window.addEventListener('mousedown', (e) => {
    if (e.target.tagName.toLowerCase() !== 'canvas') return
    window.addEventListener('mousemove', update)
    update(e)
})
window.addEventListener('mouseup', (e) => {
    if (e.target.tagName.toLowerCase() !== 'canvas') return
    window.removeEventListener('mousemove', update)
})

// update the sketch
function update(e) {
    // bottom-left (0,0) top-right (1,1)
    const mouseX = e.clientX / screen.w
    const mouseY = - (e.clientY / screen.h) + 1

    // compute the next frame
    computeShader.uniforms.mouse.value.set(mouseX, mouseY)
    computeShader.uniforms.resolution.value.set(shape.w, shape.h)
    renderer.setSize(shape.w, shape.h)
    renderer.setRenderTarget(renderTarget)
    computeRenderer.render(renderer)

    // render the compute result on screen
    renderOnScreen()

    // // debug
    // const readBuffer = renderTarget.texture.image.data
    // renderer.readRenderTargetPixels(renderTarget, 0, 0, shape.w, shape.h, readBuffer)
    // console.log(readBuffer)
}
