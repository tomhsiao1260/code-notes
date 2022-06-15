import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

const gui = new dat.GUI()
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const textureLoader = new THREE.TextureLoader()

// ############################################################### //
// ########################   Particles   ######################## //
// ############################################################### //

// 粒子系統能在合理的效能下渲染多個粒子，每個粒子為面向相機的一個小 plane (2個三角形) 組成
// 可以用來製作星星、煙霧、火焰、雨有趣的效果

// 實作上，Geometry 上的每個 vertex 為一個粒子點，透過 PointsMaterial 描述組成整個 Points
// THREE.Points 會以 vertex 點上的小面去著色，不像 THREE.Mesh 在 vertex 之間著滿顏色
const ex1 = () => {
    const particlesGeometry = new THREE.SphereGeometry(1, 32, 32)
    const particlesMaterial = new THREE.PointsMaterial()
    const particles = new THREE.Points(particlesGeometry, particlesMaterial)

    particlesMaterial.size = 0.02                // 粒子大小
    particlesMaterial.sizeAttenuation = true     // 大小是否與遠近有關

    scene.add(particles)
}
// ex1()

// ############################################################### //
// #####################   Custom Geometry   ##################### //
// ############################################################### //

const ex2 = () => {
    // #################### Geometry ##################### //
    
    // 建立 Buffer Geometry
    const particlesGeometry = new THREE.BufferGeometry()
    // 根據粒子數量建立 position, color 矩陣
    const count = 500
    const positions = new Float32Array(count * 3) // [x0, y0, z0, x1, y1, z1, ...]
    const colors = new Float32Array(count * 3)    // [r0, g0, b0, r1, g1, b1, ...]
    // 寫入隨機 position, color
    for(let i = 0; i < count * 3; i++) { 
        positions[i] = (Math.random() - 0.5) * 5 
        colors[i] = Math.random()
    }
    // 將矩陣放進 Buffer Geometry 的 position attribute 內
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    // #################### Material ##################### //

    // 建立 material
    const particlesMaterial = new THREE.PointsMaterial({size:0.1 , sizeAttenuation:true })
    // 載入 texture
    const particleTexture = textureLoader.load('/textures/particles/2.png')
    particlesMaterial.transparent = true
    particlesMaterial.alphaMap = particleTexture
    // 加上底色
    particlesMaterial.color = new THREE.Color('#e8e8e8')
    // 使用 color attribute 才要開
    particlesMaterial.vertexColors = true

    // 因為沒指定粒子渲染的先後順序，這會造成後方有些粒子因為晚畫而被擋住，有下面幾種解法：
    // 可以穿插使用得到最好的效果，但注意 blending 會影響效能

    // particlesMaterial.alphaTest = 0.001
    // particlesMaterial.depthTest = false
    particlesMaterial.depthWrite = false
    particlesMaterial.blending = THREE.AdditiveBlending

    // alphaTest：介於 0~1，數值越高表渲染門檻越高，告知 WebGL 不要渲染 alpha 值低的像素
    // depthTest：可關掉，讓 WebGL 不管前後順序全都渲染，缺點是有物體擋住也會渲染背後影像
    // depthWrite：可關掉，即不讓引擎寫入 depth buffer
    // blending：都渲染，但多個重疊處顏色會相加，造成亮色過飽和的效果

    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)

    // #################### Animate ###################### //

    const clock = new THREE.Clock()
    const tick = () => {
        const elapsedTime = clock.getElapsedTime()
        // 直接更改 attribute 裡 position array 裡的數值
        for(let i = 0; i < count; i++){
            let i3 = i * 3
            const x = particlesGeometry.attributes.position.array[i3]
            particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
        }
        // 告訴 WebGL 要更新渲染 attribute 裡的 postion 數值
        particlesGeometry.attributes.position.needsUpdate = true 

        window.requestAnimationFrame(tick)
    }
    tick()

    // 上面直接更改 attribute 的方法效能會變得很差，不建議使用，只適合較少粒子的系統
    // 較好的 animation 要利用 custom shaders 做成的 material 才能達到
}
// ex2()

// ############################################################### //
// ####################   Galaxy Generator   ##################### //
// ############################################################### //

const parameters = { 
    count: 100000,           // 顆粒數量
    size: 0.01,              // 顆粒大小
    radius: 5,               // 螺旋半徑
    branches: 3,             // 幾條螺旋
    randomness: 0.2,         // 多分散
    randomnessPower: 3,      // 多集中 (指數)
    insideColor: '#ff6030',  // 中心色
    outsideColor: '#1b3984', // 外圍色
}

let geometry = null
let material = null
let points = null

const ex3 = () => {
    // 在每次 GUI 更新後會執行 callback 刪除舊的 object
    if(points !== null) {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }

    // 建立 geometry
    geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)
    const scales = new Float32Array(parameters.count * 1)
    const randomness = new Float32Array(parameters.count * 3)
    
    // 先儲存顏色資料
    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutside = new THREE.Color(parameters.outsideColor)

    // 計算每個點的 position, color
    for(let i = 0; i < parameters.count; i++) {
        const i3 = i * 3
        // 產生 0 ~ radius 的隨機半徑
        const radius = Math.random() * parameters.radius
        // 在哪一個分支上 (3 個分支則有 0,-120,+120 三種角度)
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2
        // 增加亂讓粒子能分散在主曲線周圍，使用指數讓大多還是集中在曲線上
        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
        // 產生最終的位置
        positions[i3    ] = Math.cos(branchAngle) * radius 
        positions[i3 + 1] = 0
        positions[i3 + 2] = Math.sin(branchAngle) * radius 
        // 設定顏色
        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, radius / parameters.radius)
        colors[i3    ] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
        // 隨機縮放粒子
        scales[i] = Math.random()
        // 亂數 (給 shader 使用)
        randomness[i3    ] = randomX
        randomness[i3 + 1] = randomY
        randomness[i3 + 2] = randomZ
    }

    // 將 position, color (內建) 的結果寫入 attribute 內
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
    geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3))


    // 建立 material
    material = new THREE.ShaderMaterial({
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        // 沒有 size, sizeAttenuation 屬性，要在 shader 內的 gl_PointSize 設定
        uniforms:
        {
            // 時間
            uTime: { value: 0 },
            // 粒子大小 (與 fragment 有關，不是螢幕上的 pixel)
            // 所以高 pixelratio 呈現在螢幕上反而較小，乘上 pixelratio 保持裝置的一制呈現
            uSize: { value: 30 * renderer.getPixelRatio() }
        },
    })

    // 建立 points
    points = new THREE.Points(geometry, material)
    scene.add(points)
}

// 加入 GUI，會在改變數值完執行函數
gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange( ex3 )
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange( ex3 )
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange( ex3 )
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange( ex3 )
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange( ex3 )
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange( ex3 )
gui.addColor(parameters, 'insideColor').onFinishChange( ex3 )
gui.addColor(parameters, 'outsideColor').onFinishChange( ex3 )

// viewport size
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// viewport resize
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 2, 3)
scene.add(camera)
// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// 此為 Galaxy 範例，必須放在 renderer 後，因為要讀取 rederer 獲得的 pixelratio
ex3()

// animate
const clock = new THREE.Clock()
const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    material.uniforms.uTime.value = elapsedTime  // only for ex3()
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()