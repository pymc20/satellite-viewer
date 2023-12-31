import React, {useEffect} from 'react';
import Satellite from "./Satellite";
import Earth from "./Earth";
import useSolarSystemStore from "../store/useSolarSystemStore";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const SolarSystem = () => {
    const {renderer, solarSystemScene, camera} = useSolarSystemStore();

    const _update = () => {
        requestAnimationFrame(_update);
        renderer.render(solarSystemScene, camera);
    }

    const _onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    useEffect(() => {
        window.addEventListener('resize', _onResize)
        return () => window.removeEventListener('resize', _onResize)
    }, []);

    useEffect(() => {
        const canvas = document.getElementById('canvas');
        if (canvas && canvas.childNodes.length === 0) {
            camera.position.set(6371, 6371, 6371);
            renderer.setSize(window.innerWidth, window.innerHeight);
            canvas.appendChild(renderer.domElement);

            const ambient = new THREE.AmbientLight(0xffffff);
            solarSystemScene.add(ambient)

            // const pointLight = new THREE.PointLight(0xffffff, 2.7 * Math.pow(10, 20));
            // pointLight.power = 3.6 * Math.pow(10, 28)
            // pointLight.position.set((149600000 + 696340 + 6371) * 1000, 0, 0)
            // console.log(pointLight.scale)
            // solarSystemScene.add(pointLight)

            // solarSystemScene.add(new THREE.PointLightHelper(pointLight, 7000))

            const orbitController = new OrbitControls(camera, canvas)
            // orbitController.minDistance = 8000
            // orbitController.maxDistance = 50000
            _update();
        }
        return () => {
            if (canvas)
                for (let i = 0; i < canvas.childNodes.length; i++) {
                    canvas.childNodes.item(i).remove();
                }
        }
    }, []);

    return (
        <>
            <div id={'canvas'}/>
            <Earth/>
            <Satellite firstTleLine={'1 57624U 23120A   23253.82907575 -.00000197  00000+0  00000+0 0  9996'}
                       secondTleLine={'2 57624  16.0774 218.3627 0002834 308.9397 210.0260  1.00266179   403'}/>
        </>
    );
};

export default SolarSystem;
