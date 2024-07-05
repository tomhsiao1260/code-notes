import './style.css'
import * as THREE from 'three'
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js'

// init setup
const screen = { w: window.innerWidth, h: window.innerHeight }
const data = { w: 1000, h: 1000 * screen.h / screen.w }
const state = { frame: 0, dot: 5 }

const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.autoClear = false // GLSL discard need this

// randomly create a data texture
const dataArray = new Uint8Array(data.w * data.h * 4)

for (let i = 0; i < data.w * data.h ; i++) {
    const value = Math.random() < 0.5 ? 0 : 255
    dataArray[i * 4 + 3] = 255
}

// create a render target with a given data texture
const renderTarget = createRenderTarget(dataArray, data.w, data.h)

function createRenderTarget(data, width, height) {
    const texture = new THREE.DataTexture(data, width, height)
    texture.format = THREE.RGBAFormat
    texture.type = THREE.UnsignedByteType
    texture.minFilter = THREE.NearestFilter
    texture.magFilter = THREE.NearestFilter
    texture.needsUpdate = true

    const renderTarget = new THREE.WebGLRenderTarget(width, height)
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
shaderPass.uniforms.tDiffuse.value = renderTarget.texture
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setRenderTarget(null)
fullScreenPass.render(renderer)

// update the sketch
window.addEventListener('mousedown', (e) => {
    update(e)
    window.addEventListener('mousemove', update)
})
window.addEventListener('mouseup', (e) => {
    window.removeEventListener('mousemove', update)
})

function update(e) {
    // bottom-left (0,0) top-right (1,1)
    const mouseX = e.clientX / screen.w
    const mouseY = - (e.clientY / screen.h) + 1

    // compute the next frame
    computeShader.uniforms.mouse.value.set(mouseX, mouseY)
    computeShader.uniforms.resolution.value.set(data.w, data.h)
    renderer.setSize(data.w, data.h)
    renderer.setRenderTarget(renderTarget)
    computeRenderer.render(renderer)

    // render the compute result on screen
    shaderPass.uniforms.tDiffuse.value = renderTarget.texture
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setRenderTarget(null)
    fullScreenPass.render(renderer)

    // // debugging
    // renderer.readRenderTargetPixels(renderTarget, 0, 0, data.w, data.h, renderTarget.texture.image.data)
    // console.log(renderTarget.texture.image.data)
}




