import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { Suspense, useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function Test() {
  const { scene } = useLoader(GLTFLoader, '/olive/dist/models/african-olive-tree.glb');
  const { camera, gl } = useThree();

  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);
  }, [gl]);

  useEffect(() => {
    // 1. 缩小模型（0.7 表示缩小到原尺寸的 70%，数值越小模型越小）
    scene.scale.set(0.2, 0.2, 0.2);

    scene.traverse((object) => {
      if (object.isMesh) {
        object.material.side = THREE.DoubleSide;
        if (object.material.transparent) {
          object.renderOrder = 1;
          object.position.z += 0.001;
        }
      }
    });

    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    box.getCenter(center);
    scene.position.sub(center);

    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    // 2. 增加相机距离（乘以 1.8 让相机更远，模型显得更小）
    const distance = maxDim / 2 / Math.tan(fov / 2) * 1.8;

    camera.near = 0.1;
    camera.far = distance * 10; // 扩大远平面，避免模型被裁剪
    // 3. 适当提高相机高度，适配缩小后的模型视角
    camera.position.set(0, maxDim * 0.6, distance);
    camera.lookAt(0, 0, 0);
    // 4. 减小相机视野（FOV 越小，模型显示越小）
    camera.fov = 50; // 从 60 减小到 50
    camera.updateProjectionMatrix();

    if (gl.renderer) {
      gl.renderer.logarithmicDepthBuffer = true;
    }
  }, [scene, camera, gl]);

  return <primitive object={scene} />;
}

export default function App() {
  return (
      <Canvas
          style={{ width: '100vw', height: '100vh' }}
          camera={{ position: [0, 0, 10], fov: 50 }} // 同步修改初始 FOV
      >
        <ambientLight intensity={Math.PI} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Test />
        </Suspense>
        <OrbitControls
            maxDistance={1000}
            minDistance={0.5}
        />
      </Canvas>
  );
}
