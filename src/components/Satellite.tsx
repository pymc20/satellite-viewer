import React, {useEffect} from 'react';
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

    const _getSatellitePosition = (date: any) => {
        const satrec = satellite.twoline2satrec(firstTleLine, secondTleLine);
        const positionAndVelocity = satellite.propagate(satrec, date);
        return positionAndVelocity.position as satellite.EciVec3<number>
    }

    const _makeSatellite = () => {
        const position = _getSatellitePosition(dayjs().toDate());
        const boxGeometry = new THREE.BoxGeometry(500, 500, 500);
        const meshBasicMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        const mesh = new THREE.Mesh( boxGeometry, meshBasicMaterial );
        mesh.position.set(position.x, position.y, position.z)
        solarSystemScene.add(mesh)
    }

    const _makeOrbitLine = () => {
        const now = dayjs();
        const orbitLineList = [];
        for(let i=0; i < 100; i++) {
            const position = _getSatellitePosition(now.add(i, 'hour').toDate())
            orbitLineList.push(new THREE.Vector3(position.x, position.y, position.z))
        }
        const lineBasicMaterial = new THREE.LineBasicMaterial( { color: 0xffffff } );
        const bufferGeometry = new THREE.BufferGeometry().setFromPoints( orbitLineList );
        const line = new THREE.Line(bufferGeometry, lineBasicMaterial)
        console.log(orbitLineList)
        solarSystemScene.add(line)
    }

    useEffect(() => {
        _makeSatellite();
        _makeOrbitLine();
    }, []);

    return (
        <></>
    );
}

export default Satellite;
