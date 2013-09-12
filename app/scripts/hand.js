/*global define */
define([], function () {
    'use strict';

    var hand = function(spec) {

    	var spec = spec || {},
    		dice = spec.dice || [],
    		options = spec.options || {},
    		throwsLeft = 3,
			pickedDice = [],
			$hud = $('#throw');

        var pickUpDice = function() {

			for (var i = 1; i < pickedDice.length + 1; i++) {

	            var coefficient = i%2 ? ((i - 1) / -2) : i / 2;

	            pickedDice[i - 1].rotation.set(
	                Math.random(),
	                Math.random(),
	                Math.random()
	            );

	            pickedDice[i - 1].position.set(
	                options.groundWidth * 0.5 - options.dieSize,
	                options.wallHeight + options.dieSize,
	                (options.dieSize + 1) * coefficient
	            );
	            
	            pickedDice[i - 1].__dirtyPosition = true;
	            pickedDice[i - 1].__dirtyRotation = true;
	        }
		}

		var throwDice = function() {

	        for (var i = 0; i < pickedDice.length; i += 1) {

	        	if (pickedDice[i].mass != 0) {

		            var direction = new THREE.Vector3(
		                -300,
		                -300,
		                Math.random() * 500 - 250
		            ),
		            offset = new THREE.Vector3( 1, -1, 1 );

		            pickedDice[i].applyCentralImpulse(direction, offset);
		        }
	        }

	        throwsLeft -= 1;

	        pickNone();

	        if (throwsLeft === 0) {
	        	throwsLeft = 3;
	        }

	        updateHUD();
	    }

	    var pickNone = function() {
	    	pickedDice = [];
	    }

	    var pickAll = function() {
	    	pickNone();
	    	for (var i = 0; i < dice.length; i += 1) {
	    		pickedDice.push(dice[i]);
	    	}
	    }

	    var updateHUD = function() {
	    	$hud.html(throwsLeft + (throwsLeft === 1 ? ' throw left' : ' throws left'));
	    }

	    var handleThrowing = function() {
	    	if (throwsLeft === 3) {
        		pickAll();
        	}

            pickUpDice()
            throwDice();
	    }

	    updateHUD();

	    // Throw
        document.addEventListener('keydown', function(e) {
            switch ( e.keyCode ) {
            case 32: // space
            	handleThrowing();
                break;
            }
        }, false);

        // Shake
        window.addEventListener('shake', function() {
            handleThrowing();
        }, false);

		return {

			pick: function(die) {

				if (!_.contains(pickedDice, die)) {
					pickedDice.push(die);
				}
			}
		};
	}

	return hand;
});