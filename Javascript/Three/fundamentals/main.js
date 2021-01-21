import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';

// python3 -m http.server

function main() {
  // 先找到渲染的 canvas 元件
  const canvas = document.querySelector('#c');
  // 建立 Renderer
  const renderer = new THREE.WebGLRenderer({canvas});

  
	// 建立 Camera
  // 下面四個參數決定了一個 frustum 幾何形狀，也就是要被選染的範圍
  const fov = 75;   // fov (field of view): 垂直視角，單位 deg
	const aspect = 2; // aspect: 畫面長寬比，默認值為 2
	const near = 0.1; // near: 最近要被渲染的距離
	const far = 5;    // far: 最遠要被渲染的距離
	const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	// Camera 預設在原點，往 -Z 方向看
	// 調整相機位置以便看到原點的物體
	camera.position.z = 2.5;

	// 建立 Scene
	const scene = new THREE.Scene();

	// 建立方形 Geometry
	const boxWidth = 1;
	const boxHeight = 1;
	const boxDepth = 1;
	const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  // 製作一個 cube 的 Mesh
	function makeInstance(geometry, color, x) {
		// 建立 Material
    const material = new THREE.MeshPhongMaterial({color});
    // const material = new THREE.MeshBasicMaterial({color: 0x44aa88});

    // 利用 Geometry 和 Material 產生 Mesh
    const cube = new THREE.Mesh(geometry, material);

    // 將 Mesh 加進 Scene 裡
    scene.add(cube);

    // 更改 Mesh 位置
    cube.position.x = x;

    return cube;
  }

  // 產生三個 cube 在不同位置，回傳的 mesh 成為陣列 (供後續動畫使用)
  const cubes = [
    makeInstance(geometry, 0x44aa88,  0),
    makeInstance(geometry, 0x8844aa, -2),
    makeInstance(geometry, 0xaa8844,  2),
  ];

  // 加入光線
	{
	  const color = 0xFFFFFF;
	  const intensity = 1;
	  const light = new THREE.DirectionalLight(color, intensity);
	  light.position.set(-1, 2, 4);
	  // 將光線加進 Scene
	  scene.add(light);
    // {} 寫法是為了讓 const, let 參數限制在裡面 (block scope)
	}

  // 使用 setSize 隨顯示畫面大小改變 canvas 的顯示的解析度
  // 同時回傳 boolean 判斷 camera aspect 是否更新
  function resizeRendererToDisplaySize(renderer) {
    // canvas 初始的 width, height 值即為顯示的解析度，也稱為 drawingbuffer size
    const canvas = renderer.domElement;
    // pixelRatio 改善 HD-DPI 顯示，讓圖形更 sharp
    const pixelRatio = window.devicePixelRatio;
    // clientWidth 為 canvas 顯示在 browser 上的寬度 
    const width = canvas.clientWidth * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    // 若 clientWidth 與 width 不同會造成模糊，需重新調整
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      // 使用 setSize 改變 canvas 的 drawingbuffer size
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  // 加入動畫 和 RWD
  function render(time) {
  	// convert time to seconds
    time *= 0.001;

    // RWD 設計
    if (resizeRendererToDisplaySize(renderer)) {
      // 為了避免畫面撐滿整個 browser 造成顯示上的變形
      // 所以動態變更 camera 顯示的長寬比
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    // 改變 rotation 讓每個 cube 旋轉
    cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * .1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });

    // 最終，透過 renderer 渲染出每個 frame 的結果
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  // 每過一段時間就會重新 render 畫面
  requestAnimationFrame(render);

  // 使用 WebGLRenderer 作為 Renderer
  // 使用 PrspectiveCamera 作為 Camera (不在 scenegraph 內)
  // scenegraph 裡的源頭為 Scene
  // Scene 上加入了 DirectionalLight 和三個 Mesh 物件
  // 其中三個 Mesh 共用了同個 BoxGeometry 和 PhongMaterial
}

main();

