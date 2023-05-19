import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { useEffect, useRef, useMemo, useState } from 'react'
import { useThree, extend, useFrame } from '@react-three/fiber'
import { Float, Text, Html, PivotControls, TransformControls, OrbitControls } from '@react-three/drei'
import { OrbitControls as ThreeOrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// React 本來就會把子 component 加到 children
// 所以這裡的 mesh 很自然會被加進 scene graph
// 但 geometry, material 等 r3f 則會以屬性的方式加到父物件上 (mesh)
// 其實就是自動幫你加入 attach="geometry" 或 attach="material" 的標籤
// 然後再把一些幾何、材質參數做默認的初始設定，相機、渲染器也都架設好了
export default function Basic()
{
    // const mesh = new THREE.Mesh()
    // mesh.geometry = new THREE.BoxGeometry(1, 1, 1)
    // mesh.material = new THREE.MeshBasicMaterial({ color: 'red' })
    // scene.add(mesh)

    return <mesh>
        <torusKnotGeometry />
        <meshNormalMaterial />
    </mesh>
}

// 可以覆蓋這些默認的數值，都是跟 Three 文件相互對應，矩陣傳入，好比說
// scale={ [ 1, 1, 1 ] }, scale={ 1 }
// 但有些屬性值有特殊處理，直接簡化傳字串進去即可
// color="orange", scale="1", position-x="1"
// 如果是類的初始化值，則以 args 的矩陣傳入
// args={ [ 1.5, 32, 32 ] }
export function BasicA()
{
    return <group position={ [ 0, 0, 1 ] } rotation-x={ 0.5 }>
        <mesh scale={ 1 }>
            <boxGeometry />
            <meshBasicMaterial color="red" />
        </mesh>
        <mesh>
            <sphereGeometry args={ [ 1.5, 32, 32 ] } />
            <meshBasicMaterial color="orange" wireframe />
        </mesh>
    </group>
}

// useFrame 的 hook 會每幀都觸發，可以搭配 useRef 傳入物體
// state 內有許多場景有關的資訊，delta 是與上一幀的 ms 時間差
export function BasicB()
{
    const cubeRef = useRef()

    // 相機跟物體剛好在同個相位旋轉，所以看起來靜止
    useFrame((state, delta) =>
    {
        console.log('tick')
        cubeRef.current.rotation.y += delta * 1

        const angle = state.clock.elapsedTime
        state.camera.position.x = Math.sin(angle) * 8
        state.camera.position.z = Math.cos(angle) * 8
        state.camera.lookAt(0, 0, 0)
    })

    return <mesh ref={ cubeRef }>
        <torusKnotGeometry />
        <meshNormalMaterial />
    </mesh>
}

// extend 會產生一個繼承該類的 component，注意大小寫，若名稱相同可簡化為 extend({ OrbitControls })
extend({ MyOrbitControls: ThreeOrbitControls })
// useThree 的 hook 會回傳許多場景有關的資訊
export function BasicC()
{
    const { camera, gl } = useThree()

    return <>
        <myOrbitControls args={ [ camera, gl.domElement ] } />
        <ambientLight intensity={ 0.1 } />
        <directionalLight position={ [ 1, 2, 3 ] } intensity={ 0.5 } />
        <mesh>
            <torusKnotGeometry />
            <meshStandardMaterial />
        </mesh>
    </>
}

// 客製化幾何形狀
export function BasicD()
{
    const geometryRef = useRef()
    const verticesCount = 10 * 3
    // 繁重計算用 useMemo，依賴矩陣是空的，只會在第一次渲染時計算，並存在 cache
    const positions = useMemo(() =>
    {
        const positions = new Float32Array(verticesCount * 3)
        for(let i=0; i<verticesCount*3; i++) { positions[i] = (Math.random() - 0.5) * 3 }

        return positions
    }, [])
    // 用 useEffect 計算 normal，依賴矩陣是空的，也只會渲染一次。因為在渲染後才執行，所以要得到 useRef 的值
    useEffect(() => { geometryRef.current.computeVertexNormals() }, [])
    // 這裡渲染指的是 DOM 程式的生成，而不是 Three.js 引擎的繪製

    // 用到了 attach，這是 React 語法，會把子物件以屬性的方式加入，即 geometry.attributes.position
    return <mesh>
        <bufferGeometry ref={ geometryRef }>
            <bufferAttribute
                attach="attributes-position"
                count={ verticesCount }
                itemSize={ 3 }
                array={ positions }
            />
        </bufferGeometry>
        <meshBasicMaterial color="red" side={ THREE.DoubleSide } />
    </mesh>
}

// camera 或 renderer 可以到 canvas 上面設定
export function BasicE(props)
{
    const cameraSettings = { fov: 45, zoom: 100, near: 0.1, far: 200, position: [ 0, 0, 1 ] }

    return <>
        <Canvas
            orthographic
            dpr={ 1 }
            gl={ {
                antialias: true,
                toneMapping: THREE.ACESFilmicToneMapping,
                outputEncoding: THREE.sRGBEncoding
            } }
            camera={ cameraSettings }
        >
            {props.children}
        </Canvas>
    </>
}

// R3F 社群開發了許多可重複使用的 hooks 和 components (或稱 helpers)
// 其中一部分被整理到 Drei 生態系下，讓大家不用從頭造輪子
// 要注意的是 Drei 為 PascalCase 不像 R3F 為 camelcase

// Drei 的 controls
export function DreiA()
{
    const cube = useRef()

    return <>
        {/* 用 makeDefault 避免干擾其他控制 */}
        <OrbitControls makeDefault />

        <mesh position-x={ 2 } ref={ cube }>
            <boxGeometry />
            <meshNormalMaterial />
        </mesh>
        {/* 默認為 translate 另外有 rotate, scale */}
        <TransformControls object={ cube } mode="translate" />

        {/* anchor 轉軸相對位置, depthTest 會在物體內部也顯示, fixed 不隨觀看距離變小，但scale要重調 */}
        <PivotControls
            anchor={ [ 0, 0, 0 ] }
            depthTest={ false }
            lineWidth={ 4 }
            scale={ 1 }
            fixed={ false }
            axisColors={ [ '#9381ff', '#ff4d6d', '#7ae582' ] }
        >
            <mesh position-x={ -2 }>
                <sphereGeometry />
                <meshNormalMaterial />
            </mesh>
        </PivotControls>
    </>
}

// Drei 的 HTML 文字 (產生 div)
export function DreiB()
{
    const sphere = useRef()

    return <>
        <OrbitControls />

        <mesh ref={ sphere } position-x={ -2 }>
            <sphereGeometry />
            <meshNormalMaterial />
        </mesh>

        {/* wrapperClass 設定類別，用 css 的 .label > div 來設定樣式 */}
        {/* occlude 矩陣可偵測在哪些物體後方要隱藏文字 */}
        {/* center 由 html 中心點作為參考座標 */}
        {/* distanceFactor 讓文字隨距離縮放 */}
        <Html
            position={ [ 1, 0, 0 ] }
            wrapperClass="label"
            center
            distanceFactor={ 8 }
            occlude={ [ sphere ] }
        >
            That's a sphere 👍
        </Html>
    </>
}

// Drei 的 Text 文字 (場景內的 SDF)
export function DreiC()
{
    // 有別於 polyfons 文字，sdf 文字更平順自由度也更高
    // 可看 Inigo Quilez 的東西瞭解更多 sdf 基本原理

    // Troika 函式庫是個專門為 sdf 文字的解決方案，Drei 則在這個基礎之上打造 helper
    // https://github.com/protectwise/troika/tree/main/packages/troika-three-text

    // Troika 支援 woff, ttf, otf，建議使用最輕量型的 woff，下面是字體格式轉換工具
    // https://transfonter.org/
    // https://www.fontsquirrel.com/tools/webfont-generator

    // Google Fonts 大多是 woff2 而不是 woff，可搭配 Google Webfonts Helper 下載想要的格式
    // 其他字體要注意 License，但 Google Fonts 的都可任意使用
    // https://fonts.google.com/
    // https://gwfh.mranftl.com/fonts

    return <>
        <OrbitControls />
        {/* Float 讓物體有漂浮的感覺 */}
        <Float
            speed={ 5 }
            floatIntensity={ 2 }
        >
            {/* Text 文字 */}
            <Text
                font="./bangers-v20-latin-regular.woff"
                textAlign="center"
                color="salmon"
                fontSize={ 2 }
                position-y={ 0 }
                maxWidth={ 10 }
            >
                I LOVE R3F
                <meshNormalMaterial />
            </Text>
        </Float>
    </>
}

