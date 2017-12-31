class Main {

    constructor(outPutDom, stats, fullscreen) {
        this.outPutDom = outPutDom;
        this.stats = stats;
        this.fullscreen = fullscreen;
        this.listener;
        this.scene;
        this.camera;
        this.webGLRenderer;
        this.geometry;
        this.cloud;
        this.orbitControls;
        this.time0 = 0;
        this.particleNum = 20000;
        this.datControls;
        this.helper = {};
        this.simplex = new SimplexNoise(Math.random);
        this.maxSpace = 20;
        this.waveSize = 50;
        this.noiseInfluence = 20;
    }

    init() {
        // datGui
        let gui = new dat.GUI();
        this.datControls = new function() {
            this.helper = false;
            this.fullscreen = false;
        };

        gui.add(this.datControls, 'helper');
        gui.add(this.datControls, 'fullscreen').onChange((e) => {
            if (e) {
                this.fullscreen.viewFullScreen();
            } else {
                this.fullscreen.exitFullScreen();
            }
        });
        this.fullscreen.setViewFunc(function() {
            gui.__controllers[2].__checkbox.checked = true;
        });
        this.fullscreen.setExitFunc(function() {
            gui.__controllers[2].__checkbox.checked = false;
        });

        // scene
        this.scene = new THREE.Scene();

        // camera
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.x = 30;
        this.camera.position.y = 40;
        this.camera.position.z = 7;
        this.camera.lookAt(new THREE.Vector3(10, 0, 0));

        // renderer
        this.webGLRenderer = new THREE.WebGLRenderer({
            alpha: true
        });
        this.webGLRenderer.setClearColor(new THREE.Color(0x000000), 0);
        //this.webGLRenderer.setClearColor(new THREE.Color(0x000000));
        this.webGLRenderer.setSize(window.innerWidth, window.innerHeight);
        this.webGLRenderer.shadowMap.enabled = true;

        // add helper grid
        this.helper.gridHelper = new THREE.GridHelper(50, 10); // sizs,divisions
        this.helper.gridHelper.position.y = -30;
        this.scene.add(this.helper.gridHelper);

        // add helper axes
        this.helper.axes = new THREE.AxesHelper(5);
        this.scene.add(this.helper.axes);

        // add particle
        this.geometry = new THREE.Geometry();
        for (let i = 0; i < this.particleNum; i++) {
            let p = new THREE.Vector3();
            p.x = THREE.Math.randInt(-this.maxSpace, this.maxSpace);
            p.y = THREE.Math.randInt(-this.maxSpace, this.maxSpace);
            p.z = THREE.Math.randInt(-this.maxSpace, this.maxSpace);
            p.tx = 0;
            p.ty = 0;
            p.tz = 0;
            p.tTheta = THREE.Math.degToRad(THREE.Math.randInt(0, 360));
            p.tPhi = THREE.Math.degToRad(THREE.Math.randInt(0, 360));
            p.r = 0.05; // step
            this.geometry.vertices.push(p);
        }
        this.cloud = this.createPoints(this.geometry);
        this.scene.add(this.cloud);

        // orbit control
        let Orbit = OrbitControls(THREE);
        this.orbitControls = new Orbit(this.camera, this.webGLRenderer.domElement);

        // アウトプット用のドムにアペンド
        this.outPutDom.appendChild(this.webGLRenderer.domElement);

        window.addEventListener('resize', () => {
            this.reset();
        });

        this.startLoop();
    }

    update() {
        this.cloud.geometry.vertices.forEach((p, i) => {
            p.tTheta = this.simplex.noise3D(p.x / this.waveSize, p.y / this.waveSize, p.z / this.waveSize) * this.noiseInfluence;
            p.tPhi = this.simplex.noise3D(p.x / this.waveSize + 10, p.y / this.waveSize, p.z / this.waveSize) * this.noiseInfluence;
            p.x += Math.cos(p.tTheta) * Math.cos(p.tPhi) * p.r; // p.r = step
            p.y += Math.cos(p.tTheta) * Math.sin(p.tPhi) * p.r;
            p.z += Math.sin(p.tTheta) * p.r;

            if (p.x < -this.maxSpace) {
                p.x = this.maxSpace;
            }
            if (p.x > this.maxSpace) {
                p.x = -this.maxSpace;
            }
            if (p.y < -this.maxSpace) {
                p.y = this.maxSpace;
            }
            if (p.y > this.maxSpace) {
                p.y = -this.maxSpace;
            }
            if (p.z < -this.maxSpace) {
                p.z = this.maxSpace;
            }
            if (p.z > this.maxSpace) {
                p.z = -this.maxSpace;
            }
        });

        this.cloud.geometry.verticesNeedUpdate = true;

        // datGui
        this.helper.axes.visible = this.datControls.helper;
        this.helper.gridHelper.visible = this.datControls.helper;

        // stats更新
        if (this.stats) {
            this.stats.update();
        }
    }

    generateTexture() {
        let canvas,
            ctx,
            gradient,
            texture;

        canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        ctx = canvas.getContext('2d');
        gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
        gradient.addColorStop(0, 'rgba(255,255,255,1)'); // 中心
        gradient.addColorStop(0.3, 'rgba(0,155,255,1)'); // 中心
        gradient.addColorStop(1, 'rgba(0,0,0,0)'); // 端
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    createPoints(geom) {
        const _self = this;
        let material,
            cloud;

        material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 2,
            transparent: true,
            blending: THREE.AdditiveBlending,
            map: _self.generateTexture(),
            depthWrite: false
        });

        cloud = new THREE.Points(geom, material);
        cloud.sortParticles = true;
        return cloud;
    }

    startLoop() {
        let render = () => {
            this.orbitControls.update();
            this.update();
            this.webGLRenderer.render(this.scene, this.camera);
            requestAnimationFrame(render);
        }
        render();
    }

    reset() {
        this.webGLRenderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }
}

export default Main;
