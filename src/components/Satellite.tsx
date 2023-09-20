import React from 'react';
import * as satellite from 'satellite.js'
import * as THREE from "three";
import useSolarSystemStore from "../store/useSolarSystemStore";
import dayjs from "dayjs";

interface SatelliteProps {
    firstTleLine: string,
    secondTleLine: string
}

const Satellite = (props: SatelliteProps) => {
    const {firstTleLine, secondTleLine} = props;
    const {solarSystemScene} = useSolarSystemStore();
    const now = dayjs();
    let current = now
    const endDate = now.add(1, 'month');

    const _getSatellitePosition = (date: any) => {
        const satrec = satellite.twoline2satrec(firstTleLine, secondTleLine);
        const positionAndVelocity = satellite.propagate(satrec, date);
        if (!positionAndVelocity.position) return {x: 0, y: 0, z: 0}
        return positionAndVelocity.position as satellite.EciVec3<number>
    }


    const _update = () => {
        requestAnimationFrame(_update);
        const mesh = solarSystemScene.getObjectByName('satellite')
        if (mesh) {
            if (current.diff(endDate, 'day') === 0) current = now;
            current = current.add(1, 'minute')
            const {x, y, z} = _getSatellitePosition(current.toDate())
            mesh.position.set(x, y, z)
        }
    }

    const _makeSatellite = () => {
        const position = _getSatellitePosition(dayjs().toDate());
        const boxGeometry = new THREE.BoxGeometry(500, 500, 500);
        const meshBasicMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
        const mesh = new THREE.Mesh(boxGeometry, meshBasicMaterial);
        mesh.position.set(position.x, position.y, position.z)
        mesh.name = 'satellite'
        solarSystemScene.add(mesh)
        _update();
    }

    const _makeOrbitLine = () => {
        const orbitLineList = [];
        let continueTime = now;
        while (continueTime.diff(endDate, 'day') !== 0) {
            continueTime = continueTime.add(1, 'minute')
            const position = _getSatellitePosition(continueTime.toDate())
            orbitLineList.push(new THREE.Vector3(position.x, position.y, position.z))
        }
        const lineBasicMaterial = new THREE.LineBasicMaterial({color: 0xffffff});
        const bufferGeometry = new THREE.BufferGeometry().setFromPoints(orbitLineList);
        const line = new THREE.Line(bufferGeometry, lineBasicMaterial)
        solarSystemScene.add(line)
    }

    _makeSatellite();
    _makeOrbitLine();

    return (
        <></>
    );
}

export default Satellite;
