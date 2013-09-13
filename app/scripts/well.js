/*global define */
define(['threejs', 'physijs'], function () {
    'use strict';

    var well = function(options) {

		var groundMaterial = Physijs.createMaterial(
                new THREE.MeshLambertMaterial({
                    color: options.backgroundColor,
                    wireframe: false
                }),
                0.9, // friction
                0.1 // restitution
            ),
            wallMaterial = Physijs.createMaterial(
                new THREE.MeshLambertMaterial({
                    color: 0xffdd00,
                    opacity: 0.0,
                    transparent: true
                }),
                0.9, // friction
                0.1 // restitution
            ),
            walls = {},
            roof = {},
            mesh = new Physijs.BoxMesh(
                new THREE.CubeGeometry(options.groundWidth, options.thickness, options.groundHeight),
                groundMaterial,
                0 // mass
            );

        mesh.receiveShadow = true;

        walls.right = new Physijs.BoxMesh(
            new THREE.CubeGeometry(options.thickness, options.wallHeight, options.groundHeight),
            wallMaterial,
            0 // mass
        );
        walls.right.position.set(options.groundWidth * 0.5 - 10, options.wallHeight * 0.5, 0);
        
        walls.left = new Physijs.BoxMesh(
            new THREE.CubeGeometry(options.thickness, options.wallHeight, options.groundHeight),
            wallMaterial,
            0 // mass
        );
        walls.left.position.set(options.groundWidth * -0.5 + 10, options.wallHeight * 0.5, 0);
        
        walls.far = new Physijs.BoxMesh(
            new THREE.CubeGeometry(options.groundWidth, options.wallHeight, options.thickness),
            wallMaterial,
            0 // mass
        );
        walls.far.position.set(0, options.wallHeight * 0.5, options.groundHeight * -0.5 + 10);

        walls.near = new Physijs.BoxMesh(
            new THREE.CubeGeometry(options.groundWidth, options.wallHeight, options.thickness),
            wallMaterial,
            0 // mass
        );
        walls.near.position.set(0, options.wallHeight * 0.5, options.groundHeight * 0.5 - 10);
        
        roof = new Physijs.BoxMesh(
            new THREE.CubeGeometry(options.groundWidth, options.thickness, options.groundHeight),
            wallMaterial,
            0 // mass
        );
        roof.position.set(0, options.wallHeight, 0);

        if (options.showWalls) {
            for (var key in walls) {
            	if(walls.hasOwnProperty(key)){
            		mesh.add(walls[key]);
            	}
            }
        }

	    return mesh;
	};

	return well;
});