// sketch on a layer and then press space key to see how shapes evolve
// it uses two Data3DTexure as a ping-pong buffer to record to shape evolving history

import './style.css'
import * as THREE from 'three'
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js'

// init setup
const screen = { w: window.innerWidth, h: window.innerHeight }
const shape = { w: 128, h: Math.round(128 * screen.h / screen.w), d: 50 }
const state = { frame: 0, dot: 1, layer: 0 }
const maxLayer = shape.d * 2 - 1

const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.autoClear = false // GLSL discard need this

// create a data texture
const dataA = new Uint8Array(shape.w * shape.h * shape.d) // frame: 0, 2, ..., maxLayer - 1 
const dataB = new Uint8Array(shape.w * shape.h * shape.d) // frame: 1, 3, ..., maxLayer

for (let i = 0; i < shape.w * shape.h; i++) { dataA[i] = Math.random() < 0.5 ? 0 : 255 }

// create a render target with a given data texture
const renderTargetA = createRenderTarget(dataA, shape.w, shape.h, shape.d)
const renderTargetB = createRenderTarget(dataB, shape.w, shape.h, shape.d)

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

// create a shader for cellular automata
const cellularShader = new THREE.RawShaderMaterial({
    glslVersion: THREE.GLSL3,
    uniforms: {
        resolution: { value: new THREE.Vector2() },
        map: { value: null },
        layer: { value: 0 },
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
        uniform vec2 resolution;
        out uvec4 fragColor;

        void main() {
            vec2 k = gl_FragCoord.xy + vec2(-1.0, -1.0);
            vec2 l = gl_FragCoord.xy + vec2( 0.0, -1.0);
            vec2 m = gl_FragCoord.xy + vec2(+1.0, -1.0);
            vec2 n = gl_FragCoord.xy + vec2(-1.0,  0.0);
            vec2 o = gl_FragCoord.xy + vec2( 0.0,  0.0);
            vec2 p = gl_FragCoord.xy + vec2(+1.0,  0.0);
            vec2 q = gl_FragCoord.xy + vec2(-1.0, +1.0);
            vec2 r = gl_FragCoord.xy + vec2( 0.0, +1.0);
            vec2 s = gl_FragCoord.xy + vec2(+1.0, +1.0);

            uint vk = texture(map, vec3(k / resolution.xy, layer)).r;
            uint vl = texture(map, vec3(l / resolution.xy, layer)).r;
            uint vm = texture(map, vec3(m / resolution.xy, layer)).r;
            uint vn = texture(map, vec3(n / resolution.xy, layer)).r;
            uint vo = texture(map, vec3(o / resolution.xy, layer)).r;
            uint vp = texture(map, vec3(p / resolution.xy, layer)).r;
            uint vq = texture(map, vec3(q / resolution.xy, layer)).r;
            uint vr = texture(map, vec3(r / resolution.xy, layer)).r;
            uint vs = texture(map, vec3(s / resolution.xy, layer)).r;

            float neighbors = float(vk + vl + vm + vn + vp + vq + vr + vs) / 255.0;
            bool alive = vo > 128u;
            bool survive = false;

            if (alive) {
                if (neighbors > 1.5 && neighbors < 3.5) { survive = true; }
            } else {
                if (neighbors > 2.5 && neighbors < 3.5) { survive = true; }
            }

            fragColor = survive ? uvec4(255u, 0, 0, 0) : uvec4(0);
        }`,
})
const cellularRenderer = new FullScreenQuad(cellularShader)

// create a shader for sketching
const sketchShader = new THREE.RawShaderMaterial({
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
const sketchRenderer = new FullScreenQuad(sketchShader)

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
    const isEven = state.layer % 2 === 0
    const renderTarget = isEven ? renderTargetA : renderTargetB
    const layer = (Math.floor(state.layer / 2) + 0.5) / shape.d

    shaderPass.uniforms.map.value = renderTarget.texture
    shaderPass.uniforms.layer.value = layer
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setRenderTarget(null)
    fullScreenPass.render(renderer)
}

// create gui panel
const gui = new GUI()
gui.add(state, 'layer', 0, maxLayer, 1).listen().onChange(renderOnScreen)
gui.add(state, 'dot', 0, 20, 0.01).onChange(() => { sketchShader.uniforms.dot.value = state.dot })
gui.add({ read: readBuffer }, 'read').name('read buffer')

// event handling (sketch & cellular)
document.addEventListener('keypress', (e) => {
    if (e.code === 'Space') { updateCellular(e) }
})
document.addEventListener('mousedown', (e) => {
    if (e.target.tagName.toLowerCase() !== 'canvas') return
    document.addEventListener('mousemove', updateSketch)
    updateSketch(e)
})
document.addEventListener('mouseup', (e) => {
    if (e.target.tagName.toLowerCase() !== 'canvas') return
    document.removeEventListener('mousemove', updateSketch)
})

// update the sketch
function updateSketch(e) {
    // bottom-left (0,0) top-right (1,1)
    const mouseX = e.clientX / screen.w
    const mouseY = - (e.clientY / screen.h) + 1

    const isEven = state.layer % 2 === 0
    const renderTarget = isEven ? renderTargetA : renderTargetB
    const outputLayer = Math.floor(state.layer / 2)

    // compute the next frame
    sketchShader.uniforms.mouse.value.set(mouseX, mouseY)
    sketchShader.uniforms.resolution.value.set(shape.w, shape.h)
    renderer.setSize(shape.w, shape.h)
    renderer.setRenderTarget(renderTarget, outputLayer)
    sketchRenderer.render(renderer)

    // render the compute result on screen
    renderOnScreen()
}

// update the cellular automata
function updateCellular(e) {
    if (state.layer >= maxLayer) return
    state.layer += 1

    // switch render target
    const isEven = state.layer % 2 === 0
    const inputTarget = isEven ? renderTargetB : renderTargetA
    const outputTarget = isEven ? renderTargetA : renderTargetB

    const iLayer = (Math.floor((state.layer - 1) / 2) + 0.5) / shape.d
    const oLayer = Math.floor(state.layer / 2)

    // compute the next frame
    cellularShader.uniforms.map.value = inputTarget.texture
    cellularShader.uniforms.resolution.value.set(shape.w, shape.h)
    cellularShader.uniforms.layer.value = iLayer
    renderer.setSize(shape.w, shape.h)
    renderer.setRenderTarget(outputTarget, oLayer)
    cellularRenderer.render(renderer)

    // render the compute result on screen
    renderOnScreen()
}

// extract the result from each layer
function readBuffer() {
    console.time('Execution Time')
    const data = new Uint8Array(shape.w * shape.h * (shape.d * 2))
    const layerData = new Uint8Array(shape.w * shape.h)

    // from DataA
    for (let layer = 0; layer < shape.d; layer++) {
        const offset = (layer * 2) * shape.w * shape.h
        renderer.setRenderTarget(renderTargetA, layer)
        renderer.readRenderTargetPixels(renderTargetA, 0, 0, shape.w, shape.h, layerData)
        // write it down
        data.set(layerData, offset)
    }
    // from DataB
    for (let layer = 0; layer < shape.d; layer++) {
        const offset = (layer * 2 + 1) * shape.w * shape.h
        renderer.setRenderTarget(renderTargetB, layer)
        renderer.readRenderTargetPixels(renderTargetB, 0, 0, shape.w, shape.h, layerData)
        // write it down
        data.set(layerData, offset)
    }

    console.log(data)
    console.timeEnd('Execution Time')
}

// known issue: https://github.com/mrdoob/three.js/issues/28501
