import * as THREE from 'three';
// orbit contols are used to control the mobility of camera.
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import stars1 from '../img/pexels-ben-walsham-11600672.jpg'
import stars2 from '../img/pexels-john-mackintosh-9904283.jpg'
import stars3 from '../img/pexels-quentin-pelletier-6641536.jpg'

const renderer = new THREE.WebGLRenderer()
//set shadow property of renderer to true.
renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)

const orbit = new OrbitControls(camera, renderer.domElement) // this is function to control the orbit of camera 


// seconde arg is aspect ratio of our screen.
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

camera.position.set(-10, 30, 30)
// we need to update the orbit of the camera every time we change position really important
orbit.update()

//creating a box
const boxGeometry = new THREE.BoxGeometry()
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 })
const box = new THREE.Mesh(boxGeometry, boxMaterial)
scene.add(box)

//creating a plane
const planeGeometry = new THREE.PlaneGeometry(30, 30)
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)
plane.rotation.x = -0.5 * Math.PI
// pland will recieve shadow
plane.receiveShadow = true

//grid helper
const gridHelper = new THREE.GridHelper(30)
scene.add(gridHelper)

//creating a sphere
const sphereGeometry = new THREE.SphereGeometry(4)
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x0000FF,
    wireframe: false
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphere)
sphere.position.set(-10, 10, 0)
//sphere will cast the shadow
sphere.castShadow = true

//ambient light
const ambientLight = new THREE.AmbientLight(0x333333)
scene.add(ambientLight)

//directional light
// const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8)
// scene.add(directionalLight)
// directionalLight.position.set(-30,50,0)
// directionalLight.castShadow = true
// directionalLight.shadow.camera.bottom = -12
// //directional light helper => indicates the square that indicates the direction of light.
// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5)
// scene.add(directionalLightHelper)

// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(dLightShadowHelper)

// spot light
// working with spot light can be bit confusing.
const spotLight = new THREE.SpotLight(0xFFFFFF)
scene.add(spotLight)
spotLight.position.set(-100, 100, 0)
spotLight.castShadow = true


//spot light helper
const sLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(sLightHelper)

scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01)

// renderer.setClearColor(0xFFEA00)
const textureLoader = new THREE.TextureLoader()
// scene.background = textureLoader.load(stars2)
const cubeTextureLoader = new THREE.CubeTextureLoader()
scene.background = cubeTextureLoader.load([
    stars1,
    stars1,
    stars1,
    stars1,
    stars1,
    stars1
])


// another cube
const box2Geometry = new THREE.BoxGeometry(4, 4, 4)
const box2Material = new THREE.MeshBasicMaterial({
    // map: textureLoader.load(stars2)
    //we can add or change texture by updating the property 'map'.
})
const box2 = new THREE.Mesh(box2Geometry, box2Material)
scene.add(box2)
box2.position.set(0, 15, 10)
box2.material.map = textureLoader.load(stars2)

const gui = new dat.GUI()
const options = {
    sphereColor: '#ffea00',
    wireframe: true,
    speed: 0.01,
    angle: 0.2,
    penumbra: 0,
    intensity: 0.8
}
gui.addColor(options, 'sphereColor').onChange(function (e) {
    sphere.material.color.set(e)
})
gui.add(options, 'wireframe').onChange(function (e) {
    sphere.material.wireframe = e
})
gui.add(options, 'speed', 0, 0.1)
gui.add(options, 'angle', 0, 1)
gui.add(options, 'penumbra', 0, 1)
gui.add(options, 'intensity', 0, 1)


let step = 0

function animate(time) {
    box.rotation.x = time / 1000
    box.rotation.y = time / 1000

    step += options.speed

    spotLight.angle = options.angle
    spotLight.penumbra = options.penumbra
    spotLight.intensity = options.intensity
    sphere.position.y = 10 * Math.abs(Math.sin(step))
    renderer.render(scene, camera)
}

// renderer.render(scene, camera)
renderer.setAnimationLoop(animate)