import * as THREE from '/node_modules/three/build/three.module.js';
console.log(THREE);

import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';


// 씬 ==========================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xfff200);


// 카메라 =======================================================================================
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// 캔버스 =============================================
// const canvas = document.getElementById('silverhyo');

// 라이트
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(0, 0, 3);
directionalLight.lookAt(1, 1, 0); 
scene.add(directionalLight);

// 매쉬 =========================================
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ 
    color: 0xfff100
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);




const GLTFMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x004fff,
    metalness: 0.8,
    roughness: 0.15,
    wireframe: true,
})



// GLTF Loader
const loader = new GLTFLoader();


let GLTFObjGroup = new THREE.Object3D();


loader.load(
    // resource URL
    'aa.gltf',

    // called when the resource is loaded
    function (gltf) {
        scene.add(gltf.scene)

        const GLTFobj = gltf.scene;
        GLTFobj.scale.set(1, 1, 1);    // 불러온 object를 변수에 적용
        GLTFobj.position.y = 1;    // 불러온 object의 position 설정

        GLTFObjGroup.add(GLTFobj);
        scene.add(GLTFObjGroup);
        
        GLTFobj.traverse(function (obj) {
            if (obj.isMesh) {
                obj.material = GLTFMaterial
                obj.castShadow = true
                obj.receiveShadow = true
            }
        })

        gltf.animations
        gltf.scene
        gltf.scenes
        gltf.cameras
        gltf.asset
    },
    // called while loading is progressing
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    // called when loading fhas errors
    function (error) {
        console.log('An error occured')
    }
)




// 렌더러 =================================
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);


// Orbit Controls : 카메라 셋팅 이후에 setting해야 한다
const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 2;    // 최대한 Zoonin할 수 있는 거리
controls.maxDistance = 8;    // 최대한 Zoonout할 수 있는 거리
controls.maxPolarAngle = Math.PI / 2;
controls.update();


// 애니메이션 ==========

function render(time) {
    time *= 0.001;    // convert time to seconds

    // cube.rotation.x = time;
    // cube.rotation.y = time;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
}
requestAnimationFrame(render);


// OrbitContols 사용할 경우 매니메이션 사용 말고 아래 사용한다. update를 위해서
function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y -= 0.01;
    GLTFObjGroup.rotation.x += 0.00;
    GLTFObjGroup.rotation.y += 0.03;
    

    //required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();
    renderer.render(scene, camera);
}
animate();



// 반응형 처리
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;    // 카메라의 종횡비
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);
