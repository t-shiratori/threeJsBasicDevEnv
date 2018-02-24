import './assets';

function init() {

    /* font load
    --------------------------------------*/
    const fontLoader = new THREE.FontLoader();
    fontLoader.load('fonts/helvetiker_regular.typeface.json', function (font) {
        var textShape = new THREE.BufferGeometry();
        var matDark = new THREE.LineBasicMaterial( {
            color: color,
            side: THREE.DoubleSide
        } );
        var shapes = font.generateShapes('Hello World', 100, 2 );
        var geometry = new THREE.ShapeGeometry( shapes );
        geometry.computeBoundingBox();
        var xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
        geometry.translate( xMid, 0, 0 );
        textShape.fromGeometry( geometry );
        text = new THREE.Mesh( textShape, matLite );
                    text.position.z = - 150;
                    
                    main();
					scene.add( text );
    });

    function render() {
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    function main() {
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
    }

}

window.onload = init;
