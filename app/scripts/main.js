require.config({
    paths: {
        jquery: '../bower_components/jquery/jquery',
        underscore: '../bower_components/underscore/underscore-min',
        threejs: '../bower_components/threejs/build/three.min',
        trackballControls: '../bower_components/threejs/examples/js/controls/TrackballControls',
        orbitControls: '../bower_components/threejs/examples/js/controls/OrbitControls',
        detector: '../bower_components/threejs/examples/js/Detector',
        shake: '../bower_components/shake.js/shake',
        physijs: 'physi'
    },
    shim: {
        physijs: ['threejs'],
        trackballControls: ['threejs'],
        orbitControls: ['threejs']
    }
});

require(['app', 'jquery', 'underscore'], function (app, $, _) {
    'use strict';
    // use app here
    var container = document.getElementById( 'three-dee' );
    app(container);
});
