import './style.css'

import * as THREE from 'three'
import * as dat from 'dat.gui'
import Stats from 'stats.js'
import gsap from 'gsap'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

// three.js 透過 WebGL 在 canvas 元件上製作 3D 效果
// WebGL 是一個低階的系統，只能繪製 點、線、三角形
// three.js 則可透過下面的方式，讓繪製的過程更加的方便：

// Renderer: 主要項，接收 Scene 和 Camera，並把最終的結果渲染到 canvas 上
// scenegraph: 樹狀結構，涵蓋了各式 object，例如： Scene, Mesh, Light, Group, Object3D, Camera
// Scene: 為 scenegraph 的根源，定義了物件之間的繼承關係(一起移動)、背景 ... 等
// Camera: 鏡頭，不見得要在 scenegraph 的分支下
// Mesh: 決定 Geometry 和 Material，可供多個物體共用
// Geometry: 有提供內建的 geometry primitives 形狀 
// Material: 決定如何處理 Geometry 上的表面特性，可以使用多個 Texture
// Texture: 各種來源的圖像
// Light: 光源

// 關係圖： https://threejsfundamentals.org/threejs/lessons/threejs-fundamentals.html

// 此外，three.js 不像 babylon.js 有實作物體間碰撞的物理
// 它只是個 3D 渲染引擎，所以物體之間的互動關係要自己實作
// 因為與 WebGL 僅隔著一層，更容易實作一些細節 (比 babylon.js 更底層)

// ############################################################### //
// ##########################   Scene   ########################## //
// ############################################################### //

const parameter = { color: '#f7d09c' }

// 先找到渲染的 canvas 元件
const canvas = document.querySelector('canvas.webgl')
// 建立 Scene
const scene = new THREE.Scene()
// 建立方形 Geometry
const geometry = new THREE.BoxGeometry(1, 1, 1) // 寬, 高, 深
// 建立 Material
const material = new THREE.MeshBasicMaterial( parameter )
// 建立 Mesh
const mesh = new THREE.Mesh( geometry, material )
// 把 mesh 加進 scene
scene.add(mesh)
// 先建立 Renderer
const renderer = new THREE.WebGLRenderer({canvas: canvas})

// 切記 Material 和 Geometry 盡量給多個 Meshes 共用，這會在很多 instance 時改善不少效能

// ############################################################### //
// ########################   Geometries   ####################### //
// ############################################################### //

// Geometries 由 vertices 和 faces 組成
// vertices 為在三維空間得座標點，faces 為這些座標點所組成的面
// 可以用 Geometries 製作 Mesh，但也可利用裡頭的 vertices 去產生 particles 系統
// 每個 vertices 也可放入更多 data，例如：UV 座標, normals
// 可以看 Document 找到自己要的 built-in geometries
// r125 後不再支援 Geometry，只能用效能有優化的 Buffer Geometry (但名稱上需把 Buffer 去掉)

// 自己做一個 geometry
const geometry_1 = () => {
    // 建立空的 buffer geometry
    const geometry = new THREE.BufferGeometry()
    // 因為使用矩陣長度一開始就確定的 Float32Array，可降低不少運算上的負擔
    const positionsArray = new Float32Array([
        0, 0, 0, // First vertex
        0, 1, 0, // Second vertex
        1, 0, 0,  // Third vertex
    ])
    // 轉換成 BufferAttribute 形式以便給 buffer geometry 使用
    // 數字 3 表示每個 vertex 點以 3 個數值表示
    const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
    // 將 verties 資料送給 geometry 內部的 shader 裡的 position 欄位
    // Float32Array 中每多 9 個點就會新增一個面
    geometry.setAttribute('position', positionsAttribute)

    const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
    // 適合用 Buffer Geometry 新增幾千個面的複雜幾何圖案
    // 可用 BufferGeometry.index 去處理重複使用的 vertex (減短 Array 長度)，進一步提升效能
}

// 可以計算出 Geometry 的 Bounding 座標，主要是用來方便引擎判斷是否渲染物件，稱為 frustum culling
geometry.computeBoundingBox()
geometry.computeBoundingSphere()
// 獲得 box 的 .min, .max 屬性，即最小、最大的 Vector3 座標
geometry.boundingBox
// 獲得 sphere 的 .center, .raduis 屬性，即 球心、半徑，分別為 Vector3、flaot
geometry.boundingSphere
// 根據 bounding box 將物件至於原點
geometry.center()

// mesh.visible = false
// geometry_1()

// ############################################################### //
// ########################   Textures   ######################### //
// ############################################################### //

// 可用 Load Manager 了解 texture 載入情形
const loadingManager = new THREE.LoadingManager()

loadingManager.onStart = () => console.log('loading started')
loadingManager.onLoaded = () => console.log('loading finished')
loadingManager.onProgress = () => console.log('loading progressing')
loadingManager.onError = () => console.log('loading error')

// Texture 會包裹在 Geometry 上給予外觀，有下面幾種：
const textureLoader = new THREE.TextureLoader(loadingManager)

// Color：又稱 albedo，會將圖片的 pixel 直接覆蓋在上方
const colorTexture = textureLoader.load('/textures/door/color.jpg')
// Alpha：灰階圖樣，白色部分顯示，黑色不顯示
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
// Height：灰階圖樣，調整 vertex 給予適當的起伏紋理
const heightTexture = textureLoader.load('/textures/door/height.jpg')
// Normal：讓表面針對光線移動做出變化，特別的是不會動到 vertex，所以幾何不需切分太細
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
// Ambient occlusion：灰階圖樣，會產生出假的陰影和調整對比
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
// Metalness：灰階影像，越亮色表示越接近金屬的屬性，即容易反射
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
// Roughness：灰階影像，越亮則表面越粗糙
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

// 這些材質都遵守 PBR 原則 (Physically Based Rendering)，會以仿真實環境下去設計
// https://marmoset.co/posts/basic-theory-of-physically-based-rendering/
// https://marmoset.co/posts/physically-based-rendering-and-you-can-too/

const texture_1 = () => {
    // 在 material 上加入想要得 texture
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ map: colorTexture })
    scene.add(new THREE.Mesh( geometry, material ))

    // 讓 texture 沿著 x 重複
    colorTexture.repeat.x = 2; colorTexture.wrapS = THREE.RepeatWrapping;
    // 讓 texture 沿著 y 重複
    colorTexture.repeat.y = 3; colorTexture.wrapT = THREE.RepeatWrapping;
    // 水平重複：THREE.RepeatWrapping 鏡向重複：THREE.MirroredRepeatWrapping
    // 可用重複讓 texture 有縮小的效果

    // 平移
    colorTexture.offset = new THREE.Vector2(0.5, 0.5)
    // 旋轉
    colorTexture.rotation = Math.PI * 0.25
    // 預設的旋轉軸在左下角 (UV座標原點)，可更改到中央
    colorTexture.center = new THREE.Vector2(0.5, 0.5)
}

// texture 主要是透過 UV unwrapping 的規則覆蓋在 geometry 表面
// 透過每個 vertex 點的二維 UV 座標，使得 vertex 能在 texture 平面上一一被對應
// 若使用內建的 geometry 或建模軟件，UV 座標會自動產生，但自己寫 geometry 則要另外定義

// 引擎會儲存一系列邊長減半直到單位邊長的 texture，在遠距離、斜面時用較小的 texture
// 這種優化效能的技術稱為 Mipmapping，不過會增加 1/3 的 texture 儲存量
// 因為 Mipmapping，texture 的邊長盡量為 2 的指數倍 (ex: 1024 * 512)
// 選圖上，jpg 有壓縮較輕量，png 無壓縮較詳細，也可用 TinyPNG 讓圖檔更小
// Mipmapping 還會搭配 minification filter, magnification filter 去做畫面處理 

const texture_2 = () => {
    const colorTexture_1 = textureLoader.load('/textures/checkerboard-1024x1024.png')
    const colorTexture_2 = textureLoader.load('/textures/checkerboard-8x8.png')

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial()
    scene.add(new THREE.Mesh( geometry, material ))

    // 可到 texture 看 minFilter 和 magFilter 可以使用的 filter
    // NearestFilter 不會做模糊化處理 (運算量也較小)
    // 適合做 Minecraft，但這個處理下 moiré patterns 會比較明顯

    material.map = colorTexture_1
    // Minification filter  (太遠時 texture pixel > render pixel)
    colorTexture_1.minFilter = THREE.LinearMipmapLinearFilter // default
    colorTexture_1.minFilter = THREE.NearestFilter // 有 moiré patterns

    material.map = colorTexture_2
    // Magnification filter (太近時 texture pixel < render pixel)
    colorTexture_2.magFilter = THREE.LinearFilter  // default
    colorTexture_2.magFilter = THREE.NearestFilter // 適合 Minecraft

    // 只有 minFilter 會用到 mipmaps，若也使用 NearestFilter 就可以關掉 mipmaps
    // colorTexture.generateMipmaps = false
}

// texture 資源 (注意使用權限)
// https://www.poliigon.com/
// https://3dtextures.me/
// https://www.arroway-textures.ch/
// 也可使用 Substance Designer 或 Photoshop 設計自己的 texture

// mesh.visible = false
// texture_1()
// texture_2()

// ############################################################### //
// ########################   Material   ######################### //
// ############################################################### //

// 各種 material
const functionMaterial = (type) => {
    let material
    const gui = new dat.GUI()

    switch (type) {
        case 'Basic':
            // Basic 有的屬性其他 material 都有
            material = new THREE.MeshBasicMaterial()
            material.map = colorTexture
            // 顏色要用 color class 設定
            material.color = new THREE.Color('#ff0000')
            material.wireframe = false
            // 使用 opacity, alphaMap 都要先設定 transparent
            material.transparent = true
            material.opacity = 0.5
            // alphaMap 會把 texture 黑色的部分去除不顯示
            material.alphaMap = alphaTexture
            // 預設為 THREE.FrontSide，下面表示兩面都顯示，BackSide 表示顯示後面或是內部
            material.side = THREE.DoubleSide
            break
        case 'Normal':
            // 在每個 vertex 上 normal 記錄表面的法向量資訊，可用來計算反射、照明
            // 此 material 會針對 normal 向量與 camera 的夾角顯示表面的顏色，可用在光線 debug
            material = new THREE.MeshNormalMaterial()
            // flatShading 可以獲得扁平面，vertex 間的 normal 不會用外插另外計算
            material.flatShading = true
            break
        case 'Matcap':
            // 會針對 texture 上的資訊，在表面上給予相對應的光線照明
            // 所以照明不會因為 light 而改變，而是根據 texture 本身
            material = new THREE.MeshMatcapMaterial()
            material.matcap = textureLoader.load('/textures/matcaps/8.png')
            // matcap texture 圖資：https://github.com/nidorx/matcaps
            break
        case 'Depth':
            // 太遠會慢慢淡出不顯示，可用來測某個位置離 camera 多遠
            material = new THREE.MeshDepthMaterial()
            break
        case 'Lambert':
            // 需要 light 才能顯示，使用到光線，這個是效能最好的，但參數並不好控制
            material = new THREE.MeshLambertMaterial()
            break
        case 'Phong':
            // 需要 light 才能顯示，與 Lambert 相似，參數較好控制
            material = new THREE.MeshPhongMaterial()
            // 可調整發光強度、反射光顏色
            material.shininess = 100
            material.specular = new THREE.Color(0x1188ff)
            break
        case 'Toon':
            // 需要 light 才能顯示，與 Lambert 相似，但是為卡通風格
            material = new THREE.MeshToonMaterial()
            // 默認只有明暗兩種色階，但可以使用 gradientMap 提供更多色階
            const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')
            material.gradientMap = gradientTexture
            // 可使用 NearestFilter 避免 texture 的顏色混合，以避免失去卡通的效果
            gradientTexture.minFilter = THREE.NearestFilter
            gradientTexture.magFilter = THREE.NearestFilter
            gradientTexture.generateMipmaps = false
            break
        case 'Standard':
            // 需要 light 才能顯示，standard 指的是遵守 PBR 標準，符合現實物理環境
            material = new THREE.MeshStandardMaterial()
            // 金屬性、粗糙度
            material.metalness = 0
            material.roughness = 1
            material.map = colorTexture
            // aoMap 會加入遮蔽，會使用到 uv2 的資訊
            material.aoMap = ambientOcclusionTexture
            material.aoMapIntensity = 1
            // 調整 vertex 給予適當的起伏紋理，geometry 的切分要多點才能顯示細節
            material.displacementMap = heightTexture
            material.displacementScale = 0.05
            // 表面的的金屬、粗糙分佈
            material.metalnessMap = metalnessTexture
            material.roughnessMap = roughnessTexture
            // 讓表面針對光線移動做出變化，特別的是不會動到 vertex，所以幾何不需切分太細
            // normalScale 表示 texture 影響的程度，最大為 1
            material.normalMap = normalTexture
            material.normalScale.set(0.5, 0.5)
            // 使用 alphaMap 把不是門的部分去除
            material.transparent = true
            material.alphaMap = alphaTexture

            gui.add(material, 'metalness').min(0).max(1).step(0.01)
            gui.add(material, 'roughness').min(0).max(1).step(0.01)
            gui.add(material, 'aoMapIntensity').min(0).max(1).step(0.01)
            gui.add(material, 'displacementScale').min(0).max(1).step(0.01)
            break
        case 'EnvMap':
            // envMap 屬性可以反射出周圍環境的景象
            material = new THREE.MeshStandardMaterial()
            material.metalness = 1
            material.roughness = 0

            // 必須使用 cube texture loader 載入上下左右前後六面的圖片資訊
            const cubeTextureLoader = new THREE.CubeTextureLoader()
            const environmentMapTexture = cubeTextureLoader.load([
                '/textures/environmentMaps/0/px.jpg',
                '/textures/environmentMaps/0/nx.jpg',
                '/textures/environmentMaps/0/py.jpg',
                '/textures/environmentMaps/0/ny.jpg',
                '/textures/environmentMaps/0/pz.jpg',
                '/textures/environmentMaps/0/nz.jpg'
            ])
            // 將 texture 給 envMap
            material.envMap = environmentMapTexture

            // 可用 HDRIHaven 的 HDRIs 圖資 (基於可任意使用的 CC0 license)
            // 再用下面連結將 HDRIs 轉為 three.js 可使用的 cube map
            // https://matheowis.github.io/HDRI-to-CubeMap/

            gui.add(material, 'metalness').min(0).max(1).step(0.0001)
            gui.add(material, 'roughness').min(0).max(1).step(0.0001)
            break
        // MeshPhysicalMaterial：與 standard 相似，但提供更細緻的渲染
        // PointsMaterial：製作 particles 系統
        // ShaderMaterial 和 RawShaderMaterial：可製作自己的 material
    }
    return material
}

const spherePlaneTorus = (material) => {
    // 產生測試用的三種 Geometry
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material)
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material)
    const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 64, 128), material)
    sphere.position.x = -1.5
    torus.position.x = 1.5
    // 加入光線
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    const pointLight = new THREE.PointLight(0xffffff, 0.5)
    pointLight.position.set(2,3,4)
    // 設定第二個 UV 參數 (aoMap 會用到)，這裡直接複製原始的第一個 UV 參數
    sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))
    plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))
    torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))
    scene.add(sphere, plane, torus, ambientLight, pointLight)
}

const materialType = ['Basic','Normal','Matcap','Depth','Lambert','Phong','Toon','Standard','EnvMap']
// mesh.visible = false
// spherePlaneTorus( functionMaterial(materialType[8]) )

// ############################################################### //
// ##########################   Light   ########################## //
// ############################################################### //

// Lambert, Phong, Toon, Standard 的 material 對光線有反應

// 1. AmbientLight：會讓每個面均勻受光，欄位分別為 color, intensity 屬性
// 因為效能問題，引擎不支援反射光的運算，可以用 Ambient 補強一些暗處的光線
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)

// 2. DirectionalLight：為平行光
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3)
directionalLight.position.set(1, 0.25, 0)

// 3. HemisphereLight：類似 AmbientLight，但可指定上(第一)、下(第二)光線的色調
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3)

// 4. PointLight：點光源，後兩項可略分別為 distance (影響距離)、decay
const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 5)
pointLight.position.set(1, 1.5, 1)

// 5. RectAreaLight：長方形光線，後兩項為光源的寬、高，只能作用在 Standard、Physical material
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 0.5, 0.5)
rectAreaLight.position.set(-1.5, 0, 1.5)
rectAreaLight.lookAt(new THREE.Vector3(0, -1, 0))

// 6. SpotLight：環狀聚光燈，後四項為，distance(影響距離)、angle(發散角)、penumbra(模糊度)、decay
const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.3, 3)
spotLight.position.set(-2, 1, -1.5)
// spotLight 會鎖定 target 的位置，但必須把 target 加進 scene 才能更新聚焦位置
// 也可以加進某個 mesh 裡，讓 spotlight 跟著 mesh 移動
spotLight.target.position.x = -1
scene.add(spotLight.target)

// 效能比較如下，盡量用越少 Light 越好，也可用 Baking 技巧，將光線、陰影直接移植到 texture 上降低光線運算量
// Ambient, Hemisphere > Directional, Point > Spot, ReactArea

// 幫助除錯的 Helpers
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
const spotLightHelper = new THREE.SpotLightHelper(spotLight)
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)

// spotLight 比較麻煩要手動 update
window.requestAnimationFrame(() => spotLightHelper.update())

// 加入場景
const sphereCubeTorus = () => {
    const material = new THREE.MeshStandardMaterial()
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material)
    const cube = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), material)
    const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 64, 128), material)
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), material)
    sphere.position.x = -1.5
    torus.position.x = 1.5
    plane.rotation.x = -(Math.PI / 2)
    plane.position.y = -0.5
    // Geometry 加入場景
    scene.add(sphere, cube, torus, plane)
    // Light 加入場景
    scene.add(ambientLight, directionalLight, hemisphereLight, 
        pointLight, rectAreaLight, spotLight)
    // Helper 加入場景
    scene.add( hemisphereLightHelper, directionalLightHelper,
        pointLightHelper, spotLightHelper, rectAreaLightHelper)
}
// mesh.visible = false
// sphereCubeTorus()

// ############################################################### //
// #########################   Shadow   ########################## //
// ############################################################### //

// 物體本身受光產生的明暗為 core shadow，投影在其他物體的陰影為 drop shadow
// drop shadow 因為很吃效能，常常需要些技巧在 frame rate 間取得平衡，下面是運作原理：

// 在每次畫面 render 前，引擎會在每個需要 cast shadow 的光源上放置 camera
// 並將物體都先改為 MeshDepthMaterial，以模擬光源會看到什麼
// 並以 texture 形式存成 shadow map，作為最終 render 計算的依據
// 注意只有 Point, Direction, Spot 光源能產生 drop shadow
// https://threejs.org/examples/webgl_shadowmap_viewer.html

const shadowCube = () => {
    // 建立場景
    const material = new THREE.MeshStandardMaterial()
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material)
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), material)
    plane.rotation.x = -(Math.PI / 2)
    plane.position.y = -0.5

    // 在 renderer 的設定
    renderer.shadowMap.enabled = true                // 讓 renderer 使用 shadow map
    renderer.shadowMap.type = THREE.PCFSoftShadowMap // 變更 shadow map 演算法 (可略)
    // 在 mesh 的設定 (盡量減少 activate 數量)
    sphere.castShadow = true                         // sphere 產生 drop shadow
    plane.receiveShadow = true                       // plane 接受 drop shadow
    // 在 light 的設定
    directionalLight.castShadow = true
    spotLight.castShadow = true
    pointLight.castShadow = true

    // 也可用下面指令關掉 shadowMap 更新以改進效能，適合用在靜止不動的陰影
    // renderer.shadowMap.autoUpdate = false
    // 若需要更新的地方執行一次下面指令，shadowMap 就會更新 '一次'
    // renderer.shadowMap.needsUpdate = true
    
    // Directional Light 優化 (採用一個 OrthographicCamera)
    directionalLight.shadow.mapSize.width = 1024  // 提高 shadow map 解析度
    directionalLight.shadow.mapSize.height = 1024
    directionalLight.shadow.camera.near = 0.5     // 調整最近、最遠
    directionalLight.shadow.camera.far = 3.5
    directionalLight.shadow.camera.top = 0.7      // 調整面的大小
    directionalLight.shadow.camera.right = 0.7
    directionalLight.shadow.camera.bottom = - 0.7
    directionalLight.shadow.camera.left = - 0.7
    directionalLight.shadow.radius = 10           // 模糊化 (在 PCFSoftShadowMap 無效)

    // Spot Light 優化 (採用一個 PerspectiveCamera)
    spotLight.shadow.mapSize.width = 1024  // 提高 shadow map 解析度
    spotLight.shadow.mapSize.height = 1024
    spotLight.shadow.camera.fov = 30       // 調整視角
    spotLight.shadow.camera.near = 1.5     // 調整最近、最遠
    spotLight.shadow.camera.far = 4

    // Point Light 優化 (採用六個 PerspectiveCamera 緊密貼合)
    pointLight.shadow.mapSize.width = 1024   // 提高 shadow map 解析度
    pointLight.shadow.mapSize.height = 1024
    pointLight.shadow.camera.near = 0.5      // 注意在調整時要同時考慮的是六個面的情況
    pointLight.shadow.camera.far = 3         // 且不要更動 fov 值

    // 利用 camera helper 協助取出 camera 顯示的最佳範圍
    const directionalCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
    const spotCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
    const pointCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
    // 取好範圍後可關掉 helper
    directionalCameraHelper.visible = false
    spotCameraHelper.visible = false
    pointCameraHelper.visible = false
    // 越小的範圍 shadow 越清晰效能也越好，但要小心範圍太小陰影會被截掉

    scene.add(sphere, plane, ambientLight, directionalLight, spotLight, pointLight)
    scene.add(directionalCameraHelper, spotCameraHelper, pointCameraHelper)

    // 除了 shadow map 還有一種替代方案稱為 baking shadow
    // 也就是在物體和光線不會改變下，可改用 texture 來產生 shadow 的圖樣
    // 雖然佔用圖片空間，但能提高運行時的效能，平面也可使用與光線無關的 MeshBasicMaterial

    // 物體會動時，baking shadow 小技巧
    // shadowTrick(plane, sphere)
}

// 若物體會動，可以使用一個 baking shadow 的小平面跟在球體下方，球體遠離平面則用 alphaMap 讓陰影淡出
const shadowTrick = (plane, sphere) => {
    // 關掉 shadow map
    renderer.shadowMap.enabled = false
    // 載入陰影作為 texture
    const textureLoader = new THREE.TextureLoader()
    const simpleShadow = textureLoader.load('/textures/shadows/simpleShadow.jpg')
    // 用一個小平面乘載陰影的 texture
    const sphereShadow = new THREE.Mesh(
        new THREE.PlaneGeometry(1.5, 1.5),
        // 使用 Basic 不受光線影響，使用 alphaMap 以便調整 shadow 亮暗度
        new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, alphaMap: simpleShadow })
    )
    // 擺放在地板的上方一點點處
    sphereShadow.rotation.x = - Math.PI * 0.5
    sphereShadow.position.y = plane.position.y + 0.01
    scene.add( sphereShadow )

    const clock = new THREE.Clock()
    // 球體、shadow 動畫
    const shadowAnimation = () => {
        const elapsedTime = clock.getElapsedTime()
        // Update the sphere
        sphere.position.x = Math.cos(elapsedTime) * 1
        sphere.position.z = Math.sin(elapsedTime) * 1
        sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))
        // Update the shadow
        sphereShadow.position.x = sphere.position.x  // 跟球一起移動 
        sphereShadow.position.z = sphere.position.z
        sphereShadow.material.opacity = (1 - sphere.position.y) * 0.35 // 越高越淡

        window.requestAnimationFrame( shadowAnimation )
    }
    shadowAnimation()
}

// mesh.visible = false
// shadowCube()

// ############################################################### //
// ###################   Fullscreen & Resize   ################### //
// ############################################################### //

// viewport (不含工具列) < window (整個 Browser) < screen (整個螢幕)
const sizes = { 
    // 下面寫法可撐滿整個 viewport
    width: window.innerWidth, 
    height: window.innerHeight 
}

// 畫面大小改變的 listener
window.addEventListener('resize', () => {
    // sizes 更新
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    // camera 長寬比更新
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    // renderer 顯示的解析度更新
    renderer.setSize(sizes.width, sizes.height)
    // 處理 pixel ratio 讓 edge 更 sharp (但不超過 2)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// 雙擊進入全螢幕
window.addEventListener('dblclick', () => {
    // 進入全螢幕
    if(!document.fullscreenElement){ canvas.requestFullscreen() }
    // 退出全螢幕
    else { document.exitFullscreen() }
    // 注意此寫法在 Safari 無效，需要另外寫一些 if 條件
})

// ############################################################### //
// ##########################   Camera   ######################### //
// ############################################################### //

// Camera：為 abstract class，供繼承使用，通常不會直接呼叫
// ArrayCamera：能產生不同視角，適合用在多人遊戲的小視窗
// StereoCamera：能產生兩個模仿眼睛的視角，產生深度，可用在 VR 裝置
// CubeCamera：產生六個面的影像(上下左右前後)
// OrthographicCamera：平行投射，物件的大小不會隨著距離而改變，與 perspective 相對
// PerspectiveCamera：模擬現實中的 camera，具有 perspective

// 下面四個參數決定了一個 frustum 幾何形狀，也就是要被選染的範圍
const fov = 75;                            // fov (field of view): 垂直視角，單位 deg
const aspect = sizes.width / sizes.height; // aspect: 畫面長寬比，默認值為 2
const near = 0.1;                          // near: 最近要被渲染的距離
const far = 10;                             // far: 最遠要被渲染的距離
// 建立 Camera
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
// Camera 預設在原點，x 指向右，y 指向上，z 指出畫面 (即往 -Z 方向看)
// 調整相機位置以便看到原點的物體
camera.position.z = 3
// 可用 up 屬性指定相機正上方的方向，不常被使用 (默認為 y 軸即 0,1,0)
camera.up.set(0,1,0)
// 把 camera 加進 scene
scene.add(camera)

// fov 小的話會有放大的效果，大的話會有魚眼的效果，所以建議數值在 45-75 之間
// near, far 避免太小或太大，會出現 z-fighting，引擎會難以判斷很近的物件之間的前後關係

// 自己寫 camera control
const cursor = { x: 0, y: 0 }
// 先在畫面上定義滑鼠座標 (卡式)，左下為 (-0.5,-0.5)，右上為 (0.5,0.5)
window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = - (event.clientY / sizes.height - 0.5)
})
// 此函式用 animate() 更新
const customControls = () => {
    // 滑鼠左右移動，camera 沿 y 平面繞圓
    camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2
    camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2
    // 滑鼠上下移動可看到 y 平面的上下方
    camera.position.y = cursor.y * 3
    camera.lookAt(mesh.position)
}

// 內建的 camera controls

// DeviceOrientationControls：會隨裝置的方位改變 camera，但 IOS 不支援
// FlyControls：可以移動到任一位置，長按可進行縮放
// FirstPersonControls：與 FlyControls 類似，但指進螢幕的軸無法旋轉
// PointerLockControls：適合第一人稱的遊戲視角
// OrbitControls：沿著某個軌道移動 (針對某個 target)
// TrackballControls：類似 OrbitControls，但可滑倒地平線以下不受限制
// TransformControls：與 camera 無關，用來以滑鼠平移某個物件
// DragControls：與 camera 無關，用來以滑鼠拖曳某個物件

const controls = new OrbitControls(camera, canvas)
// target 的座標
controls.target = new THREE.Vector3(0,0,0)
// 加入 damping
controls.enableDamping = true

// ############################################################### //
// #########################   Transform  ######################## //
// ############################################################### //

// 所有繼承 Object3D 的類別，例如 camera, mesh，都有下面四個 properties
// 這些 properties 會被 compile 成 Matrics 給 three.js 和 WebGL 內部使用

// position：  移動，為 Vector3 類別
// scale：     縮放，為 Vector3 類別
// rotation：  旋轉，為 Euler 類別
// quaternion：旋轉，為 Euler 類別

// 移動 position
mesh.position.x = 0.5                     // 往 +x 平移 0.5
mesh.position.normalize()                 // Vector 長度設為 1
mesh.position.set(2, 0, 0)                // 同時設定 x,y,z 值
mesh.position.length()                    // Vector 長度
mesh.position.distanceTo(camera.position) // 兩個 Vector 之間的距離

// 縮放 scale
mesh.scale.x = 0.5                        // x 大小縮放，語法和 position 類似
mesh.scale.set(0.5, 1, 1)                 // 同時設定 x,y,z 值

// 旋轉 rotation
mesh.rotation.reorder('YXZ')              // 指定旋轉順序為 Y -> X -> Z
mesh.rotation.x = Math.PI * 0.25          // 先沿著 x 軸轉 (右手定則)
mesh.rotation.y = Math.PI * 0.25          // 再沿著 y 軸轉 (右手定則)
// 注意旋轉順序有差 (因為軸的指向會隨旋轉改變)
// 可用 reorder 指定順序，以避免某個軸不如預期的被鎖死 (gimbal lock)

// 旋轉 quaternion
camera.lookAt(new THREE.Vector3(0, 0, 0)) // 會自動將 -z 軸指向某個 vector3
camera.lookAt(mesh.position)              // 指向目前 mesh 的位置
// 更直觀的旋轉方式，當 rotation 更新時，quaternion 也會更新

// 平移 translate
// 會從原本位置去做平移，但只建議用在初始設定，移動動畫需使用 position
// mesh.translate(x,y,z)

// 加入 GridHelper
// 在 xz 平面呈現 5*5 的座標網格
const grid = new THREE.GridHelper(5, 5)
// false 表示不會因為座標在物件內部就不顯示
grid.material.depthTest = false
// 渲染順序，預設為 0，數值 1 表示會在畫面都畫完後才覆蓋在上方
grid.renderOrder = 1
// 加在某個 object 上
// mesh.add(grid)

// 加入 AxesHelper
// 可看清楚座標軸，RGB 分別表示 XYZ 軸顏色，() 可輸入坐標長度
const axes = new THREE.AxesHelper()
axes.material.depthTest = false
// 在 grid 後渲染
axes.renderOrder = 2
// mesh.add(axes)

// 組成 Group
const group = new THREE.Group()
// scene.add( group )
// group.add( Object )

// group 的 transform 會讓子物件整個一起平移、縮放、旋轉
// 盡量以 group 去串接各個 mesh，以避免 mesh 各自座標放大會互相影響

// traverse 可遍歷某個 Object 下的所有子 Object (包含自身)
scene.traverse( (object) => {
    if (object instanceof THREE.Mesh){ console.log('a mesh') }
})
// 可用遍歷的方式控制多個物體的運動，也可改為將 mesh 存進自己的矩陣來遍歷

// ############################################################### //
// ##########################   3D Text  ######################### //
// ############################################################### //

const fontLoader = new THREE.FontLoader()

// 可以用 TextGeometry 顯示文字，但字體需要以 .json 為形式的 typeface font
// 可在 three.js 內建的字體裡尋找 'three/examples/fonts/'，記得複製 license
// 也可將其他字體轉為 typeface： http://gero3.github.io/facetype.js/

const text_1 = () => {
    fontLoader.load(
        // 載入字體
        '/fonts/helvetiker_regular.typeface.json',
        (font) => {
            // 產生 TextGeometry
            const textGeometry = new THREE.TextGeometry(
                // 輸入文字
                'Hello Three.js',
                {
                    // 可打開 wireframe 調低 curveSegments 和 bevelSegments 改善效能
                    font: font,            // typeface
                    size: 0.5,             // 字體大小 
                    height: 0.2,           // 字體厚度 
                    curveSegments: 9,      // 曲面需幾個點
                    bevelEnabled: true,    // 要不要有斜角
                    bevelThickness: 0.03,  // 斜角水平厚度
                    bevelSize: 0.02,       // 斜角垂直厚度
                    bevelOffset: 0.01,     // 斜角平移量
                    bevelSegments: 5       // 斜角處需幾個點
                }
            )
            const matcapTexture = textureLoader.load('/textures/matcaps/8.png')
            const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
            const text = new THREE.Mesh(textGeometry, textMaterial)
            textGeometry.center() // 置中
            scene.add(text)
        }
    )
}

// mesh.visible = false
// text_1()

// ############################################################### //
// ########################   Load Model  ######################## //
// ############################################################### //

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const dracoLoader = new DRACOLoader()
const gltfLoader = new GLTFLoader()

// model 的 format 眾多，各有優缺點 (容量、兼容性、版權...)
// 若是指使用 geometry 作為 model，可以改採用 OBJ, FBX, STL, PLY 等較輕量的格式
// 眾多格式裡 GLTF 最被普遍使用，也成為各大引擎採用的標準，下方連結有公開的 model

// https://github.com/KhronosGroup/glTF-Sample-Models

// glTF         : 包含 gltf (JSON 格式), bin (存有所有 vertex 有關資料), png (texture)
// glTF-Binary  : 只有一個 glb (儲存所有資訊的 binary file)，容量會比 glTF 小點，但不容易更動
// glTF-Embedded: 只有一個 gltf ，唯一的好處只是可編輯檔且只有一個檔案 (容量較大)
// glTF-Draco   : 使用了 Draco algorithm 大大壓縮了 bin 檔容量

// 若想易編輯可用 glTF，想單一檔案則用 glTF-Binary (兩種都可搭配使用 Draco)
// 若使用 Draco，執行前需引入某個 class，這會讓畫面短暫靜止
// 所以 geometry 只有 100kB 不太需要使用，但有好幾 MB 的多個 model 則建議使用

// 可使用下面連結測試 model，缺點是只能引入一個檔案，所以不能使用 glTF
// https://threejs.org/editor/

let mixer = null

const model_1 = () => {
    // 先加入光源才看得到 model
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
    directionalLight.position.set(5, 5, 5)
    scene.add(ambientLight, directionalLight)

    // 使用 draco
    dracoLoader.setDecoderPath('/draco/')
    gltfLoader.setDRACOLoader(dracoLoader)
    // 會用到 decoder，這會改善效能，因為除了在 JS，也可在 Web Assembly、Worker 下執行
    // 但使用 decoder 須將 /node_modules/three/examples/js/libs/draco/ 放進 static 內
    // 若沒有使用到 draco 則會自動不載入 decoder

    // load model
    gltfLoader.load(
        // 可載入 gltf, glb 檔
        '/models/Fox/glTF/Fox.gltf',
        (gltf) => {
            // 記得先確認大小，太大太小都會看不見
            gltf.scene.scale.set(0.02, 0.02, 0.02)
            // 加到 scene 裡
            scene.add(gltf.scene)
            // 也可改用下面寫法：先把項目逐個加進 array，再逐個加到 scene 裡
            // const children = [...gltf.scene.children]
            // for(const child of children) { scene.add(child) }

            // 使用動畫
            mixer = new THREE.AnimationMixer(gltf.scene)
            // clipAction 輸入為 AnimationClip 物件
            const action = mixer.clipAction(gltf.animations[2])
            action.play()
            // 最後，記得在 tick() 內用下面語法更新動畫
            // 也是因為會在 .load 外使用 mixer，所以 mixer 需在外面宣告
            // if(mixer) { mixer.update( deltaTime ) }
        }
    )
}

// mesh.visible = false
// model_1()

// ############################################################### //
// ####################   Renderer & Animate  #################### //
// ############################################################### //
// 變更 canvas 的寬高，有考慮進 pixel ratio
renderer.setSize(sizes.width, sizes.height)

// 每台裝置的 FPS (frame per second) 不同，所以須用 clock 讓動畫速度保持一致
const clock = new THREE.Clock()

let previousTime = 0

// 加入 Animation
const animate = () => {
    // 為從開始執行到目前的秒數 s
    const elapsedTime = clock.getElapsedTime()

    // 更新 orbit controls
    controls.update()
    // 也可使用自己寫的 controls
    // customControls()

    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime
    // 此為 model 的動畫使用得參數 (略)
    if(mixer) { mixer.update( deltaTime ) }

    // 渲染出畫面
    renderer.render(scene, camera)
    // 會在下個 frame 執行 animate 這個函數
    window.requestAnimationFrame(animate)
}
animate()

// 也可用 Gsap 製作動畫，因為有內建 requestAnimationFrame 更新，不用放進 tick 內
gsap.to(mesh.position, { duration: 1, delay: 1, x: 0 })

// ############################################################### //
// #########################   Debug UI ########################## //
// ############################################################### //

// const gui = new dat.GUI()
const gui = new dat.GUI({ width: 300, closed: true })

// dat.GUI 可以用 panel 的方式對 three.js 的 Object 裡的屬性進行控制
// 注意 gui.add 第一項必須是 object，第二項為屬性值
// 會自動判斷是數值、布林值給予對應的控制，可按 H 鍵隱藏 panel

// 位置 y
gui.add(mesh.position, 'y').min(- 3).max(3).step(0.01).name('elevation')
// 是否顯示
gui.add(mesh, 'visible').name('show')
// 顯示骨架
gui.add(material, 'wireframe')
// 顏色
gui.addColor(parameter, 'color').onChange( () => material.color.set( parameter.color ))
// 旋轉
const spinControl = {
    spin: () => gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 })
}
gui.add(spinControl, 'spin')

// 如果不是 object 的參數想更動 (ex: color)，可以自己另外建一個 object 並更動自己的參數
// 然後再用 onChange 或 onFinishChange 的 callback 去呼叫一個函數更新真正的參數
// onFinishChange 不像 onChange 會連續呼叫，而是等一個連續的動作完成後被呼叫一次
// 此外， color 屬性為 THREE.Color 所以不能給一個字串作為顏色，而是使用 set 語法更新顏色

// 產生一個 class 給 dat.gui 使用
// 可以將每個物件的 AxesHelper 和 GridHelper 的顯示同時開關
class AxisGridHelper {
    constructor(node, units = 10) {
        const axes = new THREE.AxesHelper();
        axes.material.depthTest = false;
        axes.renderOrder = 2;
        node.add(axes);

        const grid = new THREE.GridHelper(units, units);
        grid.material.depthTest = false;
        grid.renderOrder = 1;
        node.add(grid);

        this.grid = grid;
        this.axes = axes;
        this.visible = true;
    }
    get visible() {
        return this._visible;
    }
    set visible(v) {
        this._visible = v;
        this.grid.visible = v;
        this.axes.visible = v;
    }
}
// 產生 class 實例 (給入指定的 mesh 和 單邊網格個數)
const helper = new AxisGridHelper(mesh, 3);
// 傳遞 visible 屬性控制開關
gui.add(helper, 'visible').name('Axis Grid');

// 可以處理 數值範圍、顏色、文字、Checkbox、選單、按鈕、組織化的Folder，可參考下方範例：
// https://jsfiddle.net/ikatyang/182ztwao/

// ############################################################### //
// #########################   Raycaster ######################### //
// ############################################################### //

// 給定一個點和一個方向，即可利用 Raycaster 判定在這個方向上有哪些物體
// 即可做一些偵測，也可以搭配滑鼠達到跟物體互動的效果

const mouse = new THREE.Vector2()
// 建立 Raycaster 接受的滑鼠座標系統，讓右上為 (1,1) 左下為 (-1,-1)，NDC 座標
window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1
})

const raycaster_1 = () => {
    // 先建立場景
    const sphereMaterial = new THREE.MeshBasicMaterial( {color: 'red'} )
    const cubeMaterial = new THREE.MeshBasicMaterial( {color: 'red'} )
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), sphereMaterial)
    const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), cubeMaterial)
    const meshes = [sphere, cube]
    // sphere 位於 y=-1， cube 位於 y=1
    sphere.position.set(0, -1, 0)
    cube.position.set(0, 1, 0)
    scene.add(sphere, cube)

    const clock = new THREE.Clock()

    // 建立 raycaster (下面 1, 2 方法擇一使用)
    const raycaster = new THREE.Raycaster()

    // 加入 frame 動態偵測
    const animate = () => {
        const elapsedTime = clock.getElapsedTime()

        // 1. 自定義向量
        const rayOrigin = new THREE.Vector3(-3, 1, 0)    // 指定起始點
        const rayDirection = new THREE.Vector3(10, 0, 0) // 指定方向 (必須 normalize)
        rayDirection.normalize()                      
        raycaster.set(rayOrigin, rayDirection)           // 開始偵測 (於 -3,1,0 指向 +x 方向)

        // 2. 滑鼠+相機 產生向量
        raycaster.setFromCamera(mouse, camera)

        // 判斷 sphere, cube 是否有被 ray 打到
        const intersects = raycaster.intersectObjects( meshes )
        // 將被指到的物件變藍色，其餘維持紅色
        meshes.forEach( obj => obj.material.color.set('red'))
        intersects.forEach( e => e.object.material.color.set('blue') )

        // 會回傳一個 array of object，將每個碰撞事件以物件方式紀錄，物件有下面屬性：
        // 注意一個 mesh 可以被打到多次，若都沒打到會回傳空矩陣

        // distance：與原點之間的距離
        // face：物體的那個面被打到
        // faceIndex：那個面的 Index
        // object：被打到的 object
        // point：被打到的點座標
        // uv：被打到的點在 geometry 上的 uv 座標

        window.requestAnimationFrame(animate)
    }
    animate()
}

// mesh.visible = false
// raycaster_1()

// ############################################################### //
// ########################   Performance  ####################### //
// ############################################################### //

// 最理想的情況是將 fps 控制在最大值 (60fps)，而且需要在各種裝置上測試，還需注意檔案大小等等
// 效能視情況主要會受到 CPU, GPU 限制
// 也可參考這篇：https://discoverthreejs.com/tips-and-tricks/

// ----------------------------------------------------------------//
// Monitor FPS
const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)
// import Stats from 'stats.js'
// 有四種選擇： 0:fps, 1:ms, 2:mb, 3+:custom
// 記得在 tick() 的開頭結尾分別加入 stats.begin(), stats.end()
// 盡量在全螢幕測試，因為較小的螢幕效能通常較好

// ----------------------------------------------------------------//
// Disable FPS limit
// 可以解除 60fps 上限的限制，一般在 150~200fps 以上才算安全
// 若 80fps 左右代表可能會在其他較差的裝置上影響效能，需要改進
// 測試前需將所有網頁關閉 (Chrome 下的小黑點也要結束掉)，有時候可能要試兩次才 work
// 注意不要使用太久，應用可能會 crash，使用結束要把 Chrome 下的小黑點也結束掉

// https://gist.github.com/brunosimon/c15e7451a802fa8e34c0678620022f7d
// open -a "Google Chrome" --args --disable-gpu-vsync --disable-frame-rate-limit
// ----------------------------------------------------------------//
// Monitoring draw calls
// draw calls 是 WebGL 渲染三角形時用到的 actions，越少 draw calls 效能越好
// 可用 Chrome 套件 Spector.js 觀察螢幕的渲染情形和 draw calls 次數
// 也可使用 renderer.info 查看渲染情形
// 時時優化 tick() 內的 JS 效能
// ----------------------------------------------------------------//
// 不再使用的物件記得 dispose 掉
// https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects

// scene.remove(cube)
// cube.geometry.dispose()
// cube.material.dispose()
// ----------------------------------------------------------------//
// 可使用 scene.overrideMaterial 將所有材料都改為 basic material
// 若效能有改進代表 GPU 影響效能較大，相反則 CPU 影響效能較大
// ----------------------------------------------------------------//
// 避免使用 light，需要使用則以  AmbientLight, DirectionalLight 優先
// 執行時避免加入或移除光線，這會使相關的材料都重新編譯
// ----------------------------------------------------------------//
// 避免使用 shadow，以 baked texture 代替，若需使用記得優化 mapSize
// 妥善使用 castShadow, receiveShadow，適時關掉 renderer 對陰影的自動更新
// ----------------------------------------------------------------//
// 關於 texture，因為 mipmap 的原因，圖檔長寬盡量是 2 的指數，以免圖檔變形
// 圖檔解析度才會影響效能，容量大小影響的是載入的時間 (用 TinyPNG 降低大小)
// 或進一步使用 .basis，讓 GPU 易讀取，檔案也大大縮小，但不易產生，可參考：
// https://github.com/BinomialLLC/basis_universal
// ----------------------------------------------------------------//
// model 盡量使用 low poly，細節可用 normal maps 增添，用 Draco 可加快載入
// 優化 camera 的 FOV, near, far
// 不要使用 pixel ratio 大於 2 的渲染 (那只是商業上的操作但會嚴重影響效能)
// ----------------------------------------------------------------//
// 可在 renderer 的建構式內加入 powerPreference: 'high-performance'
// 這會讓一些 multi-GPU 的裝置知道能切換 GPU 使用
// 如果有開 Antialias 記得查看效能
// 盡量把 postprocessing 的 passses 合成一個 (每多一個就多渲染一次)
// ----------------------------------------------------------------//
// 盡量使用同個 geometry, material 的 instance，可大大改善效能
// 使用效能佳的 material 例如 Basic, Lambert, Phong
// 少使用耗效能 material 例如 Standard, Physical
// ----------------------------------------------------------------//
// 在 shaderMaterial 那加入 precision: 'lowp' 可改善效能
// shader 內避免使用 if，且程式越簡潔越好，盡量把程式放在 vertex shader (較少運算)
// 少用需大量運算的函式 (cnoise)，建議使用 texture 傳入亂數
// 不會變的常數以 #define 定義
// ----------------------------------------------------------------//
// 對於幾乎不移動的 mesh 使用 object.matrixAutoUpdate = false
// 需移動時在執行 object.updateMatrix()
// ----------------------------------------------------------------//

const performance_1 = () => {
    // 如果 geometry 不移動，可以將它們用 BufferGeometryUtils 來 merge 在一起
    // 好處是只要需一次 draw call，數量多時可在進一步改善效能
    const geometry_1 = new THREE.BoxGeometry(0.5, 0.5, 0.5)
    const geometry_2 = new THREE.BoxGeometry(0.5, 0.5, 0.5)

    geometry_1.rotateY(Math.PI / 4)
    geometry_2.translate(0, 1, 0)

    const geometries = []
    geometries.push(geometry_1, geometry_2)

    const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries)
    const mesh = new THREE.Mesh(mergedGeometry, new THREE.MeshNormalMaterial())

    scene.add(mesh)
}

const performance_2 = () => {
    // 如果 geometry 因為需要方便往後獨立控制不適合 merge，但使用相同 geometry, material
    // 則可用 InstancedMesh，好處一樣是只需一次 draw call，但不易撰寫 (用 matrix 轉換)
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
    const material = new THREE.MeshNormalMaterial()
    const mesh = new THREE.InstancedMesh(geometry, material, 2)
    scene.add(mesh)

    for(let i=0; i<mesh.count; i++) {
        const position = new THREE.Vector3(0, i, 0)
        const quaternion = new THREE.Quaternion()
        quaternion.setFromEuler(new THREE.Euler(0, i * Math.PI / 4, 0))

        // 注意要先 rotate 再設定 position，可能是因為 Quaternion 也有位置資訊
        const matrix = new THREE.Matrix4()
        matrix.makeRotationFromQuaternion(quaternion)
        matrix.setPosition(position)
        // 用 matrix 設定每個 index 對應的轉換
        mesh.setMatrixAt(i, matrix)
    }
    // 若要在 tick() 內更新 matrix 需在 tick 內手動 update
    // mesh.instanceMatrix.needsUpdate = true
    // 同時使用下面的 mesh 設定可以改進一點 GPU 效能
    // mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
}

// mesh.visible = false
// performance_1()
// performance_2()

// ############################################################### //
// #####################   Realistic Render  ##################### //
// ############################################################### //

// 載入的 model 效果會因為各種光源的設定有所影響，下面是一些設定讓效果更加真實

const model_2 = () => {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
    directionalLight.position.set(5, 2, 1)
    scene.add(directionalLight)

    // 加入四周環境
    const cubeTextureLoader = new THREE.CubeTextureLoader()
    const environmentMap = cubeTextureLoader.load([
        '/textures/environmentMaps/0/px.jpg',
        '/textures/environmentMaps/0/nx.jpg',
        '/textures/environmentMaps/0/py.jpg',
        '/textures/environmentMaps/0/ny.jpg',
        '/textures/environmentMaps/0/pz.jpg',
        '/textures/environmentMaps/0/nz.jpg',
    ])
    scene.background = environmentMap

    dracoLoader.setDecoderPath('/draco/')
    gltfLoader.setDRACOLoader(dracoLoader)

    // load model
    gltfLoader.load(
        '/models/Hamberger/humberger.glb',
        (gltf) => {
            gltf.scene.scale.set(0.1, 0.1, 0.1)
            scene.add(gltf.scene)

            updateAllMaterials()
        }
    )

    // 尋訪 scene 內的每個 mesh
    const updateAllMaterials = () => {
        scene.traverse((child) => {
            if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
            {
                // 加入 envMap (使得物體受環境光源影響，並調整強度)
                child.material.envMap = environmentMap
                child.material.envMapIntensity = debugObject.envMapIntensity
                // 也可不尋訪，在函數外用下面語法達到相同效果 (但就無法調整光源強度)
                // scene.environment = environmentMap

                // 處理 shadow (此種寫法較吃效能)
                child.castShadow = true
                child.receiveShadow = true
            }
        })
    }

    // 1. 使用物理通用的燈光單位 (強度數值標準變更)
    renderer.physicallyCorrectLights = true
    
    // 2. 更改 toneMap，和強度 (與色彩對應有關)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 3

    // 3. 編碼方式 (與色彩有關)： LinearEncoding (預設), sRGBEncoding, GammaEncoding
    renderer.outputEncoding = THREE.sRGBEncoding
    // 注意所有可直接看到的 texture 其 encoding 屬性也要改為 THREE.sRGBEncoding
    // 例如 map 相關的就需更改，但 normalMap 則保持 LinearEncoding
    // 所以 environmentMap 需更改，從 GLTF 載入的材質會自動設定所以不用另外變更
    environmentMap.encoding = THREE.sRGBEncoding

    // 4. 加入 antialias: true (會影響效能)
    // 在 model 邊緣處提升渲染密度，避免邊緣的鋸齒狀，注意不能在 renderer instance 後才加
    // const renderer = new THREE.WebGLRenderer({..., antialias: true})

    // 5. 加入 shadow
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.set(1024, 1024)
    // 避免 shadow acne (與精準度有關，會在表面意外產生微小不必要的 shadow，可設定個門檻以去除)
    directionalLight.shadow.normalBias = 0.05

    // 加入 GUI
    const gui = new dat.GUI({ width: 345 })
    const debugObject = { envMapIntensity: 0.7 }
    const toneMapping = {}

    toneMapping.No         = THREE.NoToneMapping
    toneMapping.Linear     = THREE.LinearToneMapping
    toneMapping.Reinhard   = THREE.ReinhardToneMapping
    toneMapping.Cineon     = THREE.CineonToneMapping
    toneMapping.ACESFilmic = THREE.ACESFilmicToneMapping

    gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001).name('lightX')
    gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001).name('lightY')
    gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001).name('lightZ')
    gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
    gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.001).onChange(updateAllMaterials)
    gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)
    gui.add(renderer, 'toneMapping', toneMapping ).onFinishChange(() => {
        // 因為 JS 會自動把數字轉為字串，但這些屬性只能接受數字形式
        renderer.toneMapping = Number(renderer.toneMapping)
        updateAllMaterials()
    })
}

// mesh.visible = false
// model_2()

// ############################################################### //
// #######################   Loading Page  ####################### //
// ############################################################### //

// 概念上是在載入期間使用 plane 填滿整個畫面
const loading_1 = () => {
    // 尚未執行 transform, project matrix 前，平面的長寬 2 剛好可填滿畫面的邊界 (-1 ~ 1)
    // 此座標為 normalized device coordinates (NDC)
    const geometry = new THREE.PlaneGeometry(2, 2, 1, 1)
    // 使用 shader 有很好的效能也較容易客製化
    const material = new THREE.ShaderMaterial({
        // 使用 uAlpha 控制 fragment 讓平面在仔好後淡去，記得開起 transparent 才會作用
        transparent: true,
        uniforms: { uAlpha: { value: 1 } },
        // 去除掉 projectionMatrix, modelViewMatrix 即可讓平面永遠在正前方!
        vertexShader: `
            void main() { gl_Position = vec4(position, 1.0); }
        `,
        fragmentShader: `
            uniform float uAlpha;
            void main() { gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha); }
        `,
    })
    scene.add( new THREE.Mesh(geometry, material) )
    loading_scene(material)
}

// 載入場景
const loading_scene = (material) => {
    // 加入一個簡易的 loading bar，因為是 html 所以需多注意 performance
    const element = document.createElement("DIV")
    element.className = "loading-bar"
    document.body.appendChild(element)

    // 可利用 DevTools 在開發階段模擬實際的載入環境：
    // 1. 開啟 Network 欄位裡的 Disable cache (每次都重載資源)
    // 2. 並加入客製化的 throttling 決定載入速度的 bandwidth

    const loadingManager = new THREE.LoadingManager(
        // Loaded
        () => {
            window.setTimeout(() => {
                // 載好後讓 plane 淡去
                gsap.to(material.uniforms.uAlpha, { duration: 3, value: 0, delay: 1 })
                // 加入 ended 類別和去除 transform 讓 html 離開畫面
                element.classList.add('ended')
                element.style.transform = ''
            }, 500)
        },

        // Progress
        (itemUrl, itemsLoaded, itemsTotal) => {
            // 載入的進度
            const progressRatio = itemsLoaded / itemsTotal
            // 更改 html 的長度，注意使用 transform 比直接改變 width 好，因為使用的是 GPU 運算
            element.style.transform = `scaleX(${progressRatio})`
        }
    )

    // 將所有的 loader 都加入 loadingManager
    const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)
    const environmentMap = cubeTextureLoader.load([
        '/textures/environmentMaps/0/px.jpg',
        '/textures/environmentMaps/0/nx.jpg',
        '/textures/environmentMaps/0/py.jpg',
        '/textures/environmentMaps/0/ny.jpg',
        '/textures/environmentMaps/0/pz.jpg',
        '/textures/environmentMaps/0/nz.jpg',
    ])
    scene.background = environmentMap
}

// loading_1()

// ############################################################### //
// ##################   Mixing HTML and WebGL  ################### //
// ############################################################### //

const mixHTML_1 = async () => {
    // 顯示載入頁面
    loading_1()
    // 先關掉 axis, grid helper
    mesh.children = []

    // 建立 html 元件 (point DIV 裡包含了 label 和 text DIV)
    const pointElement = document.createElement("DIV")
    const labelElement = document.createElement("DIV")
    const textElement = document.createElement("DIV")

    pointElement.className = "point point-0"
    document.body.appendChild(pointElement)

    labelElement.className = "label"
    labelElement.innerText = "1"
    pointElement.appendChild(labelElement)

    textElement.className = "text"
    textElement.innerText = "Lorem ipsum, dolor sit amet consectetur"
    pointElement.appendChild(textElement)

    // 載好後加入 visible 的 class (這裡暫時用 promise 代替)
    await new Promise(resolve => setTimeout(resolve, 3000))
    pointElement.className = "point point-0 visible"

    // 將資料點的位置和 DOM 依序放進一個 array
    const points = []
    const point_0 = {}

    // 可用 rayscaster 搭配 mouse 找出座標點 (intersects[0].point)
    point_0.position = new THREE.Vector3(0.4, 0.1, 0.75)
    point_0.element = document.querySelector('.point-0')
    // 需要更多點只要把他們都加進 array 即可
    points.push(point_0)

    // 使用 raycaster 判別標示是否被物體擋住，決定要不要顯示
    const raycaster = new THREE.Raycaster()

    const tick = () => {
        points.forEach( point => {
            const screenPosition = point.position.clone()
            // 使用 project 方法可以把三維的位置點轉換為畫面上的二維座標點!
            // 只會用到前兩項即 x, y ，其範圍左下為 (-1, -1)，右上為 (1, 1)，NDC 座標
            screenPosition.project(camera)
            // 更新位置點，並把 html 移動到對應的位置，注意 Y 軸要加負號
            const translateX = screenPosition.x * sizes.width * 0.5
            const translateY = - screenPosition.y * sizes.height * 0.5
            point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`

            // 產生一個 ray 指向資料點，並判斷有沒有打到物體
            raycaster.setFromCamera(screenPosition, camera)
            const intersects = raycaster.intersectObjects(scene.children, true)

            if(intersects.length === 0) {
                // 這個方向沒有物體，可以顯示資料
                point.element.classList.add('visible')
            }
            else {
                // 取出 ray 打到物體的最近距離
                const intersectionDistance = intersects[0].distance
                // 計算資料點與相機的距離
                const pointDistance = point.position.distanceTo(camera.position)
                // 若資料點比物體近表示沒被擋住，可顯示，反之則不顯示
                if(intersectionDistance < pointDistance) {
                    point.element.classList.remove('visible')
                }
                else {
                    point.element.classList.add('visible')
                }
            }
        })
        window.requestAnimationFrame(tick)
    }
    tick()
}

// mixHTML_1()

// ############################################################### //
// ###########################   Else  ########################### //
// ############################################################### //

// const fog = new THREE.Fog('#262837', 1, 5) // 可用 fog 讓太遠的物體淡出 Fog (color, near, far)
// renderer.setClearColor('#262837')          // 讓背景和 fog 色調一致
// scene.fog = fog

// 可將不需要的 geometry, material 捨棄掉節省空間，最後再從 scene 中 remove 掉 mesh 即可
// geometry.dispose()
// material.dispose()
// scene.remove( mesh )

// Object3D.clone() 可以將 three.js 物件複製下來成為獨立的另一個物件
// color.lerp(x, alpha) 會將原本的 color 加入 x 的 alpha 比例混合

// 開發上，盡量使用一個 canvas，如果是需要配合 scroll 移動到不同場景，可使用 stencil 限制要渲染的區域
