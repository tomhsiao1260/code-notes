import './style.css'
import * as THREE from 'three'
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js'

// init setup
const screen = { w: window.innerWidth, h: window.innerHeight }
const shape = { w: 1280, h: Math.round(1280 * screen.h / screen.w) }
const state = { frame: 0, dot: 5 }

const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.autoClear = false // GLSL discard need this

// create a data texture
const data = new Uint8Array(shape.w * shape.h)

// create a render target with a given data texture
const renderTarget = createRenderTarget(data, shape.w, shape.h)

function createRenderTarget(data, w, h) {
    const texture = new THREE.DataTexture(data, w, h)
    texture.internalFormat = 'R8UI'
    texture.format = THREE.RedIntegerFormat
    texture.type = THREE.UnsignedByteType
    texture.minFilter = THREE.NearestFilter
    texture.magFilter = THREE.NearestFilter
    texture.needsUpdate = true

    const renderTarget = new THREE.WebGLRenderTarget(w, h)
    renderTarget.texture = texture
    return renderTarget
}

// create a compute shader to write data
const computeShader = new THREE.RawShaderMaterial({
    glslVersion: THREE.GLSL3,
    uniforms: {
        resolution: { value: new THREE.Vector2() },
        mouse: { value: new THREE.Vector2() },
        dot: { value: state.dot },
    },
    vertexShader: `
        precision highp float;
        precision highp int;

        in vec3 position;
        out vec2 uv;

        void main() {
            gl_Position = vec4(position, 1.0);
            uv = position.xy * 0.5 + 0.5;
        }
    `,
    fragmentShader: `
        precision highp float; 
        precision highp int;

        uniform vec2 resolution;
        uniform vec2 mouse;
        uniform float dot;
        out uvec4 fragColor;

        void main() {
            vec2 r = resolution.xy;
            vec2 c = gl_FragCoord.xy;
            vec2 m = mouse * r;
            vec2 o = c / r;

            vec2 grid = c - mod(c, 1.0);
            vec2 target = m - mod(m, 1.0);
            float distance = length(target - grid);

            if (distance > dot) discard;
            fragColor = uvec4(255.0, 0, 0, 0);
        }`,
})
const computeRenderer = new FullScreenQuad(computeShader)

// fullScreenPass to render the result on screen
const shaderPass = new THREE.RawShaderMaterial({
    glslVersion: THREE.GLSL3,
    uniforms: { map: { value: null } },
    vertexShader: `
        precision highp float;
        precision highp int;

        in vec3 position;
        out vec2 uv;

        void main() {
            gl_Position = vec4(position, 1.0);
            uv = position.xy * 0.5 + 0.5;
        }
    `,
    fragmentShader: `
        precision highp usampler2D;
        precision highp float; 
        precision highp int;

        uniform usampler2D map;
        out vec4 fragColor;
        in vec2 uv;

        void main() {
            uint texel = texture(map, uv).r;
            float v = float(texel) / 255.0;
            fragColor = vec4(v, v, v, 1.0);
        }
    `,
})
const fullScreenPass = new FullScreenQuad(shaderPass)

// render the compute result on screen (1st frame)
renderOnScreen()

function renderOnScreen() {
    shaderPass.uniforms.map.value = renderTarget.texture
    // renderer.setSize(window.innerWidth, window.innerHeight)
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
    // renderer.setSize(shape.w, shape.h) // bottle neck, perhaps dont need this
    renderer.setRenderTarget(renderTarget)
    computeRenderer.render(renderer)

    // render the compute result on screen
    renderOnScreen()

    // // debug
    // const readBuffer = renderTarget.texture.image.data
    // renderer.readRenderTargetPixels(renderTarget, 0, 0, shape.w, shape.h, readBuffer)
    // console.log(readBuffer)
}
