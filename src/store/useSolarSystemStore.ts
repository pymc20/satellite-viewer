import * as THREE from 'three';
import { create } from 'zustand'

interface SolarSystemType {
    renderer: THREE.WebGLRenderer
    camera: THREE.PerspectiveCamera
    solarSystemScene: THREE.Scene
}

const useSolarSystemStore = create<SolarSystemType>(() => ({
    renderer: new THREE.WebGLRenderer(),
    camera: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1e+7),
    solarSystemScene: new THREE.Scene()
}))

export default useSolarSystemStore
