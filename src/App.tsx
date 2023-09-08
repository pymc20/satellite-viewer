import React, {useEffect, useState} from 'react';
import earthMap from './assets/earthmap.jpg'
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

function App() {
  const [scene] = useState(new THREE.Scene());
  const [camera] = useState(new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ));
  const [renderer] = useState(new THREE.WebGLRenderer());

  const update = () => {
    requestAnimationFrame(update);
    renderer.render(scene, camera);
  }

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  useEffect(() => {
    const canvas = document.getElementById('canvas');
    if(canvas && canvas.childNodes.length === 0) {
      camera.position.set(0, 0, 5);
      renderer.setSize( window.innerWidth, window.innerHeight );
      canvas.appendChild( renderer.domElement );

      const sun = new THREE.PointLight(0xffffff, 1, 0);
      sun.position.set(0, 0, 5);

      const ambient = new THREE.AmbientLight(0x909090);

      scene.add(sun);
      scene.add(ambient);

      const box = new THREE.BoxGeometry(0.1, 0.1, 0.1);
      const boxMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
      const boxMesh = new THREE.Mesh( box, boxMaterial );
      boxMesh.position.set(1,1,1)
      scene.add(boxMesh)

      new THREE.TextureLoader().loadAsync(earthMap).then((texture) => {
        const material = new THREE.MeshPhongMaterial({
          side: THREE.DoubleSide,
          flatShading: false,
          map: texture
        });
        const geometry = new THREE.SphereGeometry( 1, 50, 50 );
        const cube = new THREE.Mesh( geometry, material );
        scene.add( cube );
      })

      const orbitController = new OrbitControls(camera, canvas)
      orbitController.minDistance = 1.1
      update();
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, []);

  return (
    <>
      <div id={'canvas'}/>
    </>
  );
}

export default App;
