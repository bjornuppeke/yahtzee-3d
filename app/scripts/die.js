/*global define */
define(['threejs', 'physijs'], function () {
    'use strict';

	var die = function(spec) {

		var spec = spec || {},

			size = spec.size || 10,

			mass = spec.mass || 2,

			x = spec.x || 0,

			material = Physijs.createMaterial(
                spec.faceMaterial,
                0.9, // friction
                0.1 // restitution
            ),

			mesh = new Physijs.BoxMesh(
	            new THREE.CubeGeometry( size, size, size ),
	            material,
	            mass
	        );

        mesh.position.set( x, 10, 0 );

        mesh.rotation.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
        );

        mesh.castShadow = true;
        mesh.receiveShadow = true;

		return mesh;
	};

	return die;
});