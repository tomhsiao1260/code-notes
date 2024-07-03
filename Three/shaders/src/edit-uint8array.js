import './style.css'
import * as THREE from 'three'
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js'

// setup canvas, renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(window.innerWidth, window.innerHeight)

// create a data texture
const data = new Uint8Array(5 * 3 * 4)
const texture = new THREE.DataTexture(data, 5, 3)

// create a render target with that texture
const renderTarget = new THREE.WebGLRenderTarget(5, 3)
renderTarget.texture = texture
// renderTarget.texture.format = THREE.RedFormat
renderTarget.texture.type = THREE.UnsignedByteType
renderTarget.texture.minFilter = THREE.NearestFilter
renderTarget.texture.magFilter = THREE.NearestFilter
renderTarget.texture.needsUpdate = true

// create a full screen pass (write uv.x into r channel)
const shaderPass = new THREE.ShaderMaterial({
    vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }`,
    fragmentShader: `varying vec2 vUv; void main() { gl_FragColor = vec4(1.0, 0.0, 0.0, 0.0); }`,
})
const fullScreenPass = new FullScreenQuad(shaderPass)

// render fullScreenPass result on that render target
renderer.setRenderTarget(renderTarget)
fullScreenPass.render(renderer)

// read the data
renderer.setRenderTarget(renderTarget)
renderer.readRenderTargetPixels(renderTarget, 0, 0, 5, 3, data)
console.log(data)

// optional: render the texture result to screen 
renderTextureToScreen(texture)

function renderTextureToScreen(texture) {
    const shaderPass = new THREE.ShaderMaterial({
        uniforms: { uTexture: { value: texture } },
        vertexShader: `
            varying vec2 vUv;
            void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
        `,
        fragmentShader: `
            precision highp sampler2D;
            uniform sampler2D uTexture;
            varying vec2 vUv;

            void main() {
                float v = texture(uTexture, vUv).r;
                gl_FragColor = vec4(vec3(v), 1.0);
            }
        `,
    })
    const fullScreenPass = new FullScreenQuad(shaderPass)

    renderer.setRenderTarget(null)
    fullScreenPass.render(renderer)
}











