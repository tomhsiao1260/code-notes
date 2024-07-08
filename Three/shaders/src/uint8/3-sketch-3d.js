import './style.css'
import * as THREE from 'three'
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js'

// init setup
const screen = { w: window.innerWidth, h: window.innerHeight }
const shape = { w: 8, h: 3, d: 5 }
const state = { frame: 0, dot: 0.1, layer: 0 }

const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.autoClear = false // GLSL discard need this

// create a data texture
const data = new Uint8Array(shape.w * shape.h * shape.d)

// create a render target with a given data texture
const renderTarget = createRenderTarget(data, shape.w, shape.h, shape.d)

function createRenderTarget(data, w, h, d) {
    const texture = new THREE.Data3DTexture(data, w, h, d)
    texture.internalFormat = 'R8UI'
    texture.format = THREE.RedIntegerFormat
    texture.type = THREE.UnsignedByteType
    texture.minFilter = THREE.NearestFilter
    texture.magFilter = THREE.NearestFilter
    texture.needsUpdate = true

    const renderTarget = new THREE.WebGL3DRenderTarget(w, h, d)
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
    uniforms: {
        map: { value: null },
        layer: { value: 0 }
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
        precision highp usampler3D;
        precision highp float; 
        precision highp int;

        uniform usampler3D map;
        uniform float layer;
        out vec4 fragColor;
        in vec2 uv;

        void main() {
            uint texel = texture(map, vec3(uv, layer)).r;
            float v = float(texel) / 255.0;
            fragColor = vec4(v, v, v, 1.0);
        }
    `,
})
const fullScreenPass = new FullScreenQuad(shaderPass)

// render the compute result on screen (1st frame)
renderOnScreen()

function renderOnScreen() {
    const layer = (state.layer + 0.5) / shape.d

    shaderPass.uniforms.map.value = renderTarget.texture
    shaderPass.uniforms.layer.value = layer
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setRenderTarget(null)
    fullScreenPass.render(renderer)
}

// create gui panel
const gui = new GUI()
gui.add(state, 'layer', 0, shape.d-1, 1).onChange(renderOnScreen)
gui.add({ read: readBuffer }, 'read').name('read buffer')

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
    renderer.setRenderTarget(renderTarget, state.layer)
    computeRenderer.render(renderer)

    // render the compute result on screen
    renderOnScreen()
}

// extract the result from each layer
function readBuffer() {
    const layerData = new Uint8Array(shape.w * shape.h)

    for (let layer = 0; layer < shape.d; layer++) {
        const offset = layer * shape.w * shape.h
        renderer.setRenderTarget(renderTarget, layer)
        renderer.readRenderTargetPixels(renderTarget, 0, 0, shape.w, shape.h, layerData)
        data.set(layerData, offset)
    }
    console.log(data)
}
