import * as React from 'react';
import useSolarSystemStore from "../store/useSolarSystemStore";
import {useEffect} from "react";
import * as THREE from "three";
import earthMap from "../assets/earthmap.jpg";

const Earth = () => {
    const {solarSystemScene} = useSolarSystemStore();

    useEffect(() => {
        new THREE.TextureLoader().loadAsync(earthMap).then((texture) => {
            const material = new THREE.MeshPhongMaterial({
                side: THREE.DoubleSide,
                flatShading: false,
                map: texture
            });
            const geometry = new THREE.SphereGeometry(6371, 50, 50);
            const cube = new THREE.Mesh(geometry, material);
            cube.name = 'earth'
            solarSystemScene.add(cube);
        })
        return () => {
            const earth = solarSystemScene.getObjectByName('earth');
            if (earth) solarSystemScene.remove(earth)
        }
    }, []);

    return (
        <></>
    );
};

export default Earth;
