import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import {GUI} from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';

// python3 -m http.server

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});
  // 將座標參數視覺化的 dat.gui 工具
  const gui = new GUI();

  const fov = 40;
  const aspect = 2;
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 50, 0);
  // 指定 camera 面向正 z 軸時為 up
  camera.up.set(0, 0, 1);
  // camera 望向原點
  camera.lookAt(0, 0, 0);

  const scene = new THREE.Scene();

  {
    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.PointLight(color, intensity);
    scene.add(light);
  }

  // 有被 push 進 objects 的 mesh 會在後面製作旋轉的動畫
  const objects = [];

  // 為了能清楚看見旋轉動畫，所以只用六個 segment 繪製球，也就是六角形
  const radius = 1;
  const widthSegments = 6;
  const heightSegments = 6;
  const sphereGeometry = new THREE.SphereBufferGeometry(
      radius, widthSegments, heightSegments);

  // 子物件 add 到 父物件下會參考其座標一起旋轉和縮放
  // 所以若直接寫 sunMesh.add(earthMesh);
  // 地球會繞太陽公轉，但地因為太陽尺寸放大 5 倍的關係
  // 地球的尺寸和繞駛半徑也會跟著意外的放大

  // 為了方便獨力開發，改用 solarSystem 這個新的 mesh
  // 同時作為 sunMesh 和 earchOrbit 的父物件
  const solarSystem = new THREE.Object3D();
  scene.add(solarSystem);
  // 整個太陽系旋轉 (讓地球公轉)
  objects.push(solarSystem);

  // 加入太陽
  const sunMaterial = new THREE.MeshPhongMaterial({emissive: 0xFFFF00});
  const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
  // 將太陽尺寸方大五倍
  sunMesh.scale.set(5, 5, 5);
  solarSystem.add(sunMesh);
  // 太陽自轉
  objects.push(sunMesh);

  // earthOrbit 作為 earth 和 moonOrbit 的父物件
  const earthOrbit = new THREE.Object3D();
  earthOrbit.position.x = 10;
  solarSystem.add(earthOrbit);
  // 整個地球座標旋轉 (讓月球公轉)
  objects.push(earthOrbit);

  // 加入地球
  const earthMaterial = new THREE.MeshPhongMaterial({color: 0x2233FF, emissive: 0x112244});
  const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
  earthOrbit.add(earthMesh);
  // 地球自轉
  objects.push(earthMesh);

  // moonOrbit 作為 moon 的父物件
  const moonOrbit = new THREE.Object3D();
  moonOrbit.position.x = 2;
  // 整個月球座標旋轉
  earthOrbit.add(moonOrbit);
	 
  // 加入 moon
  const moonMaterial = new THREE.MeshPhongMaterial({color: 0x888888, emissive: 0x222222});
  const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
  // 月球尺寸減半
  moonMesh.scale.set(.5, .5, .5);
  moonOrbit.add(moonMesh);
  // 月球自轉
  objects.push(moonMesh);

  // scene - solarSystem - sunMesh(5x)
  //                     - earthOrbit - earthMesh
  //                                  - moonOrbit - moonMesh(0.5x) 

  // 可以用 AxesHelper 將物件座標和原點視覺化，x(紅), y(綠), z(藍)
  function AxesHelper() {
	objects.forEach((node) => {
	const axes = new THREE.AxesHelper();
	// false 表示不會因為座標在球內部就不畫出座標
	axes.material.depthTest = false;
	// 渲染順序，預設為 0，數值 1 表示會在畫面都畫完後才覆蓋在上方
	axes.renderOrder = 1;
	// 將物件加上 AxesHelper
	node.add(axes);
	// 可以注意到 sun 轉得比 solarSystem 的座標快 2 倍
	// 這是因為 sumMesh 本身又再加了一次旋轉 
	// 地球的公轉速度就是 solarSystem 旋轉的速度
	});  
  }   
  // AxesHelper(); 

  // 產生一個 class 給 dat.gui 使用
  // 可以將每個物件的 AxesHelper 和 GridHelper 的顯示同時開關
  class AxisGridHelper {
		constructor(node, units = 10) {
		  const axes = new THREE.AxesHelper();
		  axes.material.depthTest = false;
		  axes.renderOrder = 2;  // after the grid
		  node.add(axes);

		  const grid = new THREE.GridHelper(units, units);
		  grid.material.depthTest = false;
		  grid.renderOrder = 1;
		  node.add(grid);
		  // 地球在 solarSystem 的 Grid 的單位 10 的距離
		  // 月球在 moonOrbit 的 Grid 的單位 2 的距離

		  this.grid = grid;
		  this.axes = axes;
		  this.visible = false;
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

  // 產生顯示 Axis 和 Grid 的 dat.GUI
  function makeAxisGrid(node, label, units) {
    const helper = new AxisGridHelper(node, units);
    // 使用 dat.gui 前要先給每個物件一個 class 和 label
    // class 裡頭有 AxesHelper 和 GridHelper 的資訊
    gui.add(helper, 'visible').name(label);
  }
 
  makeAxisGrid(solarSystem, 'solarSystem', 25);
  makeAxisGrid(sunMesh, 'sunMesh');
  makeAxisGrid(earthOrbit, 'earthOrbit');
  makeAxisGrid(earthMesh, 'earthMesh');
  makeAxisGrid(moonOrbit, 'moonOrbit');
  makeAxisGrid(moonMesh, 'moonMesh');
 
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    // 陣列中的每個 mesh 都隨時間旋轉
    objects.forEach((obj) => {
      obj.rotation.y = time;
    });

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
