// sketch on a layer and then press space key to see how shapes evolve
// it uses two Data3DTexure as a ping-pong buffer to record to shape evolving history

import './style.css'
import * as THREE from 'three'
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js'

// init setup
const screen = { w: window.innerWidth, h: window.innerHeight }
const shape = { w: 100, h: Math.round(100 * screen.h / screen.w), d: 50 }
const state = { frame: 0, dot: 1, layer: 0 }
const maxLayer = shape.d * 2 - 1

const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.autoClear = false // GLSL discard need this

// create a data texture
const dataA = new Uint8Array(shape.w * shape.h * shape.d * 4) // frame: 0, 2, ..., maxLayer - 1 
const dataB = new Uint8Array(shape.w * shape.h * shape.d * 4) // frame: 1, 3, ..., maxLayer

for (let i = 0; i < shape.w * shape.h * shape.d; i++) { dataA[i * 4 + 3] = 255 }
for (let i = 0; i < shape.w * shape.h * shape.d; i++) { dataB[i * 4 + 3] = 255 }

for (let i = 0; i < shape.w * shape.h; i++) {
    const value = Math.random() < 0.5 ? 0 : 255
    dataA[i * 4 + 0] = value
    dataA[i * 4 + 1] = value
    dataA[i * 4 + 2] = value
    dataA[i * 4 + 3] = 255
}

// create a render target with a given data texture
const renderTargetA = createRenderTarget(dataA, shape.w, shape.h, shape.d)
const renderTargetB = createRenderTarget(dataB, shape.w, shape.h, shape.d)

function createRenderTarget(data, w, h, d) {
    const texture = new THREE.Data3DTexture(data, w, h, d)
    texture.format = THREE.RGBAFormat
    texture.type = THREE.UnsignedByteType
    texture.minFilter = THREE.NearestFilter
    texture.magFilter = THREE.NearestFilter
    texture.needsUpdate = true

    const renderTarget = new THREE.WebGL3DRenderTarget(w, h, d)
    renderTarget.texture = texture
    return renderTarget
}

// create a shader for cellular automata
const cellularShader = new THREE.ShaderMaterial({
    uniforms: {
        resolution: { value: new THREE.Vector2() },
        tDiffuse: { value: null },
        layer: { value: 0 }
    },
    vertexShader: `void main() { gl_Position = vec4(position, 1.0); }`,
    fragmentShader: `
        precision highp sampler3D;
        uniform sampler3D tDiffuse;
        uniform vec2 resolution;
        uniform float layer;

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

            vec4 vk = texture(tDiffuse, vec3(k / resolution.xy, layer));
            vec4 vl = texture(tDiffuse, vec3(l / resolution.xy, layer));
            vec4 vm = texture(tDiffuse, vec3(m / resolution.xy, layer));
            vec4 vn = texture(tDiffuse, vec3(n / resolution.xy, layer));
            vec4 vo = texture(tDiffuse, vec3(o / resolution.xy, layer));
            vec4 vp = texture(tDiffuse, vec3(p / resolution.xy, layer));
            vec4 vq = texture(tDiffuse, vec3(q / resolution.xy, layer));
            vec4 vr = texture(tDiffuse, vec3(r / resolution.xy, layer));
            vec4 vs = texture(tDiffuse, vec3(s / resolution.xy, layer));

            float neighbors = (vk + vl + vm + vn + vp + vq + vr + vs).x;
            bool alive = vo.x > 0.5;
            bool survive = false;

            if (alive) {
                if (neighbors > 1.5 && neighbors < 3.5) { survive = true; }
            } else {
                if (neighbors > 2.5 && neighbors < 3.5) { survive = true; }
            }

            gl_FragColor = survive ? vec4(1.0) : vec4(0.0, 0.0, 0.0, 1.0);
        }`,
})
const cellularRenderer = new FullScreenQuad(cellularShader)

// create a shader for sketching
const sketchShader = new THREE.ShaderMaterial({
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
const sketchRenderer = new FullScreenQuad(sketchShader)

// fullScreenPass to render the result on screen
const shaderPass = new THREE.ShaderMaterial({
    uniforms: {
        tDiffuse: { value: null },
        layer: { value: 0 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
    `,
    fragmentShader: `
        precision highp sampler3D;
        uniform sampler3D tDiffuse;
        uniform float layer;
        varying vec2 vUv;
        void main() { gl_FragColor = texture(tDiffuse, vec3(vUv, layer)); }
    `,
})
const fullScreenPass = new FullScreenQuad(shaderPass)

// render the compute result on screen (1st frame)
renderOnScreen()

function renderOnScreen() {
    const isEven = state.layer % 2 === 0
    const renderTarget = isEven ? renderTargetA : renderTargetB
    const layer = (Math.floor(state.layer / 2) + 0.5) / shape.d

    shaderPass.uniforms.tDiffuse.value = renderTarget.texture
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
    cellularShader.uniforms.tDiffuse.value = inputTarget.texture
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
    const layerData = new Uint8Array(shape.w * shape.h * 4)

    // from DataA
    for (let layer = 0; layer < shape.d; layer++) {
        const offset = (layer * 2) * shape.w * shape.h
        renderer.setRenderTarget(renderTargetA, layer)
        renderer.readRenderTargetPixels(renderTargetA, 0, 0, shape.w, shape.h, layerData)
        // write it down
        for (let i = 0; i < shape.w * shape.h; i++) { data[offset + i] = layerData[i * 4] }
    }
    // from DataB
    for (let layer = 0; layer < shape.d; layer++) {
        const offset = (layer * 2 + 1) * shape.w * shape.h
        renderer.setRenderTarget(renderTargetB, layer)
        renderer.readRenderTargetPixels(renderTargetB, 0, 0, shape.w, shape.h, layerData)
        // write it down
        for (let i = 0; i < shape.w * shape.h; i++) { data[offset + i] = layerData[i * 4] }
    }

    console.log(data)
    console.timeEnd('Execution Time')
}

// the same as above but save 4 dim instead of 1
function readBuffer_() {
    console.time('Execution Time')
    const data = new Uint8Array(shape.w * shape.h * (shape.d * 2) * 4)
    const layerData = new Uint8Array(shape.w * shape.h * 4)

    // from DataA
    for (let layer = 0; layer < shape.d; layer++) {
        const offset = (layer * 2) * shape.w * shape.h * 4
        renderer.setRenderTarget(renderTargetA, layer)
        renderer.readRenderTargetPixels(renderTargetA, 0, 0, shape.w, shape.h, layerData)
        data.set(layerData, offset)
    }
    // from DataB
    for (let layer = 0; layer < shape.d; layer++) {
        const offset = (layer * 2 + 1) * shape.w * shape.h * 4
        renderer.setRenderTarget(renderTargetB, layer)
        renderer.readRenderTargetPixels(renderTargetB, 0, 0, shape.w, shape.h, layerData)
        data.set(layerData, offset)
    }

    console.log(data)
    console.timeEnd('Execution Time')
}

