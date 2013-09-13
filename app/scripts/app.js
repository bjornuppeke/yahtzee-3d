/*global define */
define(['threejs', 'physijs', 'orbitControls', 'detector', 'shake', 'well', 'die', 'hand'], function (a, b, c, d, e, well, die, hand) {
    'use strict';

    var app = function (container) {
        var width = window.innerWidth,
            height = window.innerHeight * 0.75,
            ratio = width / height,
            landscape = !!Math.floor(ratio);

        app.initThree(container, {
            width: width,
            height: height,
            ratio: ratio,
            landscape: landscape,
            groundWidth: landscape ? Math.round(100 * ratio) : Math.round(100 / ratio),
            groundHeight: 100,
            wallHeight: 50,
            thickness: 0.5,
            showWalls: true,
            dieSize: 10,
            dieMass: 2,
            backgroundColor: 0x0096ff
        });

        app.animate();
    };

    app.initThree = function (container, options) {

        Physijs.scripts.worker = 'scripts/physijs_worker.js';
        Physijs.scripts.ammo = './ammo.js';

        // Scene
        app.projector = new THREE.Projector;
        app.scene = new Physijs.Scene;
        app.scene.setGravity(new THREE.Vector3( 0, -400, 0 ));

        // Camera
        app.camera = new THREE.PerspectiveCamera( 20, options.ratio, 1, 1000 );
        app.camera.position.set(options.landscape ? 0 : -1, Math.round(Math.tan(80) * 31), options.landscape);
        app.camera.lookAt(app.scene.position);

        //Camera controls
        // app.controls = new THREE.OrbitControls(app.camera);

        // Light
        var light = new THREE.DirectionalLight( 0xFFFFFF );
        light.position.set( 0, 200, 100 );
        light.target.position.set( 0, 0, 0 );
        light.castShadow = true;
        light.shadowDarkness = 0.5;
        light.shadowCameraVisible = false;
        light.shadowCameraLeft = options.groundWidth * -0.5;
        light.shadowCameraRight = options.groundWidth * 0.5;
        light.shadowCameraTop = options.groundHeight * -0.5;
        light.shadowCameraBottom = options.groundHeight * 0.5;
        light.shadowCameraNear = 60;
        light.shadowCameraFar = 300;
        light.shadowBias = -0.01;
        light.shadowMapWidth = light.shadowMapHeight = 2048;
        
        app.scene.add( light );

        // Renderer
        app.renderer = Detector.webgl ? new THREE.WebGLRenderer({antialiasing: true}) : new THREE.CanvasRenderer();
        app.renderer.setSize( options.width, options.height );
        app.renderer.shadowMapEnabled = true;
        app.renderer.shadowMapSoft = false;
        container.appendChild(app.renderer.domElement);

        // Well
        app.scene.add( well(options) );

        // Dice
        app.dice = [];
        app.meshes = [];
        app.spawnDice(options);

        // Hand
        app.hand = hand({
            dice: app.dice,
            options: options
        });

        // Click
        container.addEventListener( 'mousedown', function(e) {
            e.preventDefault();

            var vector = new THREE.Vector3( ( e.clientX / options.width ) * 2 - 1, - ( (e.clientY -  this.offsetTop) / options.height ) * 2 + 1, 0.5 );
            app.projector.unprojectVector( vector, app.camera );
            var raycaster = new THREE.Raycaster( app.camera.position, vector.sub( app.camera.position ).normalize() );
            var intersects = raycaster.intersectObjects( app.dice );

            if ( intersects.length > 0 ) {
                app.hand.pick(intersects[0].object);
            }

        }, false );
    };

    app.spawnDice = function(options) {
        // material
        var dieFaces = [
                new THREE.MeshLambertMaterial({
                    map: THREE.ImageUtils.loadTexture('images/die/face_4.png')
                }),
                new THREE.MeshLambertMaterial({
                    map: THREE.ImageUtils.loadTexture('images/die/face_3.png')
                }),
                new THREE.MeshLambertMaterial({
                    map: THREE.ImageUtils.loadTexture('images/die/face_2.png')
                }),
                new THREE.MeshLambertMaterial({
                    map: THREE.ImageUtils.loadTexture('images/die/face_5.png')
                }),
                new THREE.MeshLambertMaterial({
                    map: THREE.ImageUtils.loadTexture('images/die/face_1.png')
                }),
                new THREE.MeshLambertMaterial({
                    map: THREE.ImageUtils.loadTexture('images/die/face_6.png')
                })
            ],

            dieFaceMaterial = new THREE.MeshFaceMaterial(dieFaces);

        for (var i = 1; i < 6; i++) {

            var coefficient = i%2 ? ((i - 1) / -2) : i / 2,
                myDie = die({
                    size: options.dieSize,
                    mass: options.dieMass,
                    faceMaterial: dieFaceMaterial,
                    x: options.groundWidth / 6 * coefficient
                });

            app.dice.push(myDie);
            app.scene.add(myDie);
        }
    };

    app.animate = function() {

        window.requestAnimationFrame( app.animate );
        if (app.controls) {
            app.controls.update(app.camera);
        }
        app.scene.simulate(); // run physics
        // console.log(app.dice[0]._physijs.linearVelocity);
        app.render();
    };

    app.render = function() {

        app.renderer.render( app.scene, app.camera );
    };

    return app;
});