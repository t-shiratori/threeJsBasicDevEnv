import './assets';

function init() {

    /* scene
    --------------------------------------*/
    let scene = new THREE.Scene();

    /* camera
    --------------------------------------*/
    let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = 0;
    camera.position.y = 30;
    camera.position.z = 50;
    camera.lookAt(scene.position);
    scene.add(camera);

    /* renderer
    --------------------------------------*/
    let renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xF5E1DA));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    /* Plane
    --------------------------------------*/
    let planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
    let planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xF1F1F1,
        side: THREE.DoubleSide
    });
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = -5;
    plane.position.z = 0;
    scene.add(plane);

    /* Cube
    --------------------------------------*/
    let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    let cubeMaterial = new THREE.MeshLambertMaterial({color: 0x40A798, wireframe: false});
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;
    cube.position.x = 5;
    cube.position.y = 5;
    cube.position.z = 0;
    scene.add(cube);

    /* Sphere
    --------------------------------------*/
    let sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    let sphereMaterial = new THREE.MeshLambertMaterial({color: 0x476268, wireframe: true});
    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.castShadow = true;
    sphere.position.x = -5;
    sphere.position.y = 4;
    sphere.position.z = 0;
    scene.add(sphere);

    /* AmbientLight
    --------------------------------------*/
    let ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    /* SpotLight
    --------------------------------------*/
    let spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-10, 30, 0);
    spotLight.castShadow = true;
    scene.add(spotLight);

    /* OrbitControls
    --------------------------------------*/
    // orbit control
    let Orbit = OrbitControls(THREE);
    let orbitControls = new Orbit(camera);

    document.getElementById('WebGL-output').appendChild(renderer.domElement);

    render();

    function render() {
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

}

window.onload = init;
