/**
 * Created by Ryan on 3/23/2015.
 */

/* Note: when viewed in browser to the user the coordinate system is:
 *                   +y |
 *                      |___ +x
 *                  +z /
 */

require([], function(){
    // detect WebGL
    if( !Detector.webgl ){
        Detector.addGetWebGLMessage();
        throw 'WebGL Not Available'
    }
    // setup webgl renderer full page
    var renderer	= new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    // setup a scene and camera
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);

    var ballRad = 0.5;
    var ballCF = new THREE.Matrix4();
    ballCF.multiply(new THREE.Matrix4().makeTranslation(0, ballRad, 0));
    var cameraCF = new THREE.Matrix4();
    cameraCF.multiply(ballCF);
    cameraCF.multiply(new THREE.Matrix4().makeTranslation(-15, 4, 0));

	// determines if call-back will render new scene
	var run = true;

    // declare the rendering loop
    var onRenderFcts= [];

    // handle window resize events
    var winResize	= new THREEx.WindowResize(renderer, camera);

	// hold the current time for car repositioning in render
	var holdTime;

	// position of car one
	var carOneYSpeed = -1;

	// distance from 0,0,0 to either tunnel face
	var tunnelEnd = 95;

	var totalCars = 0;

    //////////////////////////////////////////////////////////////////////////////////
    //		lighting					//
    //////////////////////////////////////////////////////////////////////////////////

    var ambientLight= new THREE.AmbientLight( 0x343434 );
    ambientLight.position.set(0, 20, 0);
    scene.add( ambientLight);
    var backLight	= new THREE.DirectionalLight('white', 2.0);
    backLight.position.set(100, 50, -150);
    scene.add( backLight );
    var helper2 = new THREE.DirectionalLightHelper(backLight, 20);
    scene.add(helper2);

    //////////////////////////////////////////////////////////////////////////////////
    //		add an object and make it move					//
    //////////////////////////////////////////////////////////////////////////////////

    var tran = new THREE.Vector3();
    var quat = new THREE.Quaternion();
    var vscale = new THREE.Vector3();

	var allCars = [];
	var roadPositions = [0,1,2,3,4,5];

	var occupiedLanes = [];// only one car to a lane

	occupiedLanes["left"] = [false,false,false,false,false,false];
	occupiedLanes["right"] = [false,false,false,false,false,false];

	// make random cars
	for(var i = 0; i < totalCars; i++){
		var dir = "left";
		if(Math.floor(Math.random() * 2) == 1){
			dir = "right";
		}
		var randRoad = Math.floor(Math.random() * 5);
		var randSpeed = Math.random() * (1.7 - 0.4) + 0.4;
		// if car attempted to take an occupied lane run loop again
		if(!occupiedLanes[dir][randRoad]){
			allCars[i] = createCar(dir,roadPositions[randRoad],randSpeed);
		}else{
			i--;
		}
		occupiedLanes[dir][randRoad] = true;	// lane occupied
	}


	function createCar(direction,road,speed){
		var lane = 0;

		if(direction == "right"){
			if(road == 0){
				lane = 3.5;
			}else if(road == 1){
				lane = 21.5;
			}else if(road == 2){
				lane = 35.5;
			}else if(road == 3){
				lane = 53.5;
			}else if(road == 4){
				lane = 67.5;
			}else if(road == 5){
				lane = 81.5;
			}
		}else if(direction == "left"){
			if(road == 0){
				lane = 13.7;
			}else if(road == 1){
				lane = 31.7;
			}else if(road == 2){
				lane = 45.7;
			}else if(road == 3){
				lane = 63.7;
			}else if(road == 4){
				lane = 77.7;
			}else if(road == 5){
				lane = 91.5;
			}
		}

		var changeDir = 1;
		if(direction == "left"){
			changeDir = -1;
		}

		if(speed < 0){
			speed = speed*-1;
		}
		// add car
		var car_cf = new THREE.Matrix4();
		
		if(direction == "left"){
			car_cf.makeTranslation(lane, 0, -120);
			car_cf.multiply(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(90)));
			car_cf.multiply(new THREE.Matrix4().makeRotationY(THREE.Math.degToRad(180)));
		}else{
			car_cf.makeTranslation(lane, 0, -120);
			car_cf.multiply(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(-90)));
		}
		car_cf.decompose(tran, quat, vscale);
		var car = new Car();
		// set car to car_cf
		car.position.copy(tran);
		car.quaternion.copy(quat);
		car.scale.set(1,1,1);
		scene.add(car);

		// headlight coord frames
		/*var lightR_cf;
		var lightL_cf;
		// add headlights
		var lightR = new THREE.SpotLight('white', 10, 200, Math.PI/12, 1);
		lightR.target.position.set(0, -300, 1000*changeDir);
		lightR.target.updateMatrixWorld();
		var lightL = new THREE.SpotLight('white', 10, 200, Math.PI/12, 1);
		lightL.target.position.set(0, -300, 1000*changeDir);
		lightL.target.updateMatrixWorld();
		scene.add(lightR);
		scene.add(lightL);*/

		var totalCar = [];

		totalCar["car"] = car;
		/*totalCar["lightL"] = lightL;
		totalCar["lightR"] = lightR;
		totalCar["lightR_cf"] = lightR_cf;
		totalCar["lightL_cf"] = lightL_cf;*/
		totalCar["cf"] = car_cf;
		totalCar["speed"] = speed;
		//totalCar["direction"] = direction;

		return totalCar;
	}

    // roads and medians
    var totalArea1Width = 150;
    var MAX_LANES = 3;
    var ROAD_WIDTH = 14;
    var MEDIAN_WIDTH = 4;
    var roadAry = [];
    var medianAry = [];
	var hold_i = 0;
    for(var i = 0; i < MAX_LANES; i++){
        var roadTex = THREE.ImageUtils.loadTexture("textures/road.png");
        roadTex.repeat.set(i + 1, 30);
        roadTex.wrapS = THREE.RepeatWrapping;
        roadTex.wrapT = THREE.RepeatWrapping;
        var road = new THREE.PlaneBufferGeometry(ROAD_WIDTH * (i + 1), totalArea1Width, 1, 5);
        var roadMat = new THREE.MeshPhongMaterial({map:roadTex});
        roadAry[i] = new THREE.Mesh(road, roadMat);
        roadAry[i].rotateX(THREE.Math.degToRad(-90));
        roadAry[i].translateX((MEDIAN_WIDTH / 2) * (2 * i + 1) + (ROAD_WIDTH / 2) * Math.pow((i + 1), 2));
        scene.add(roadAry[i]);
        // add median
        var median;
        var medianMat;
        if(i == 0){
            // starting median
            median = new THREE.PlaneBufferGeometry(MEDIAN_WIDTH * 5, 150, 1, 5);
            medianMat = new THREE.MeshPhongMaterial({color:0x7CFC00});
            medianAry[i] = new THREE.Mesh(median, medianMat);
            medianAry[i].translateX(-MEDIAN_WIDTH / 2 * 4, 0, 0);
        }else{
            median = new THREE.PlaneBufferGeometry(MEDIAN_WIDTH, 150, 1, 5);
            medianMat = new THREE.MeshPhongMaterial({color:0x7CFC00});
            medianAry[i] = new THREE.Mesh(median,medianMat);
        }
        medianAry[i].rotateX(THREE.Math.degToRad(-90));
        medianAry[i].translateX((MEDIAN_WIDTH / 2) * (2 * i) + (ROAD_WIDTH / 2) * (Math.pow(i, 2) + i));
        scene.add(medianAry[i]);
		hold_i = i;
    }

    // finish median
	var medianMesh;
    median = new THREE.PlaneBufferGeometry(MEDIAN_WIDTH * 5, 150, 1, 5);
    medianMat = new THREE.MeshPhongMaterial({color:0x7CFC00});
    medianMesh = new THREE.Mesh(median, medianMat);
    medianMesh.translateX(-MEDIAN_WIDTH / 2 * 4, 0, 0);

    medianMesh.rotateX(THREE.Math.degToRad(-90));
    medianMesh.translateX((MEDIAN_WIDTH) * (2 * hold_i++) + (ROAD_WIDTH / 2) * (Math.pow(hold_i++, 2) + hold_i++) + MEDIAN_WIDTH + 1.0);
	scene.add(medianMesh);


	// street light with curb
	/*var streetLight = new StreetLight();
    streetLight.rotateY(THREE.Math.degToRad(90));
    streetLight.position.set(0, 8, 10);
	scene.add(streetLight);
    // spotlight for streetlight
    var streetLamp	= new THREE.SpotLight('white', 10, 40, Math.PI/4);
    streetLamp.position.set(8, 22, 16);
    streetLamp.target.position.set(8, 0, 16);
    streetLamp.target.updateMatrixWorld();
    scene.add( streetLamp );
    var helper = new THREE.SpotLightHelper(streetLamp);
    scene.add(helper);*/

	var trees = [];
	var treeLineSpacing = [-60,-50,-40,-30,-20,-10,0,10,20,30,40,50,60];
	
	for(var i = 0; i < treeLineSpacing.length; i++){

		var holdTree = [];
		
		var tree = new Tree();

		var cf = new THREE.Matrix4();
		cf.makeTranslation(105, 0, treeLineSpacing[i]);
		cf.decompose(tran, quat, vscale);

		tree.position.copy(tran);
		tree.quaternion.copy(quat);

		holdTree["tree"] = tree;
		holdTree["cf"] = cf;
		
		trees[i] = holdTree;

		scene.add(trees[i]["tree"]);
	}

	// add hole positions
	var holePositions = [[-30,0],[-15,0],[15,0],[30,0]];
	var allHoles = [];

	var holeGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.0 ,32);
    var holeMat = new THREE.MeshPhongMaterial({color: 0x000000});

	for(var i = 0; i < holePositions.length; i++){	
		var hole = new THREE.Mesh (holeGeo, holeMat);
		hole.position.set(holePositions[i][1],0.0009,holePositions[i][0]);
		allHoles[i] = hole;
		scene.add(hole);
	}

	// add walls and tunnels
    var totalArea1Length = MAX_LANES * MEDIAN_WIDTH + 6 * ROAD_WIDTH;
    var WALL_HEIGHT = 15;
    var wallLeftTex = THREE.ImageUtils.loadTexture("textures/tunnelLeft.png");
    wallLeftTex.repeat.set(1, 1);
    wallLeftTex.wrapS = THREE.RepeatWrapping;
    wallLeftTex.wrapT = THREE.RepeatWrapping;
    var wallLeftMat = new THREE.MeshPhongMaterial({map:wallLeftTex});
    var wallLeft = new THREE.PlaneBufferGeometry(totalArea1Length, WALL_HEIGHT, 1, 1);
    var wallLeftMesh = new THREE.Mesh(wallLeft, wallLeftMat);
    wallLeftMesh.position.set(totalArea1Length / 2 - (MEDIAN_WIDTH / 2), WALL_HEIGHT / 2, -totalArea1Width / 2);
    var wallRightTex = THREE.ImageUtils.loadTexture("textures/tunnelRight.png");
    wallRightTex.repeat.set(1, 1);
    wallRightTex.wrapS = THREE.RepeatWrapping;
    wallRightTex.wrapT = THREE.RepeatWrapping;
    var wallRightMat = new THREE.MeshPhongMaterial({map:wallRightTex});
    var wallRight = new THREE.PlaneBufferGeometry(totalArea1Length, WALL_HEIGHT, 1, 1);
    var wallRightMesh = new THREE.Mesh(wallRight, wallRightMat);
    wallRightMesh.rotateY(THREE.Math.degToRad(180));
    wallRightMesh.position.set(totalArea1Length / 2 - (MEDIAN_WIDTH / 2), WALL_HEIGHT / 2, totalArea1Width / 2);
    scene.add(wallLeftMesh);
    scene.add(wallRightMesh);

    var origin = new THREE.AxisHelper(30);
    scene.add(origin);

    // create ball "william"
    var ballSpeed = 0.05;
    var gravity = 2;
    var ballTex = THREE.ImageUtils.loadTexture("textures/basketball.jpg");
    //var ballTexBump = new THREE.ImageUtils.loadTexture("texture/oldtennisballbump.jpg");
    var ball = new THREE.SphereGeometry(ballRad, 20, 20);
    var ballMat = new THREE.MeshPhongMaterial({map:ballTex});;
    var ballMesh = new THREE.Mesh(ball, ballMat);
    ballMesh.translateY(ballRad);
    ballMesh.direction = new THREE.Vector3(0, 0, 0);
    // set all possible directions of movement
    var hypotenuseRad = ballRad * Math.sqrt(2) / 2;
    console.log(hypotenuseRad);
    ballMesh.rays = [
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(1, 0, 1),
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(1, 0, -1),
        new THREE.Vector3(0, 0, -1),
        new THREE.Vector3(-1, 0, -1),
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(-1, 0, 1),
        new THREE.Vector3(0, -1, 0)
    ];
    // add raycaster to test for intersections
    ballMesh.caster = new THREE.Raycaster();

    function checkBallCollision() {
        console.log("checking for collisions...");
        var collisions;
        var distance = 0.6;
        for (var i = 0; i < ballMesh.rays.length; i++) {
            collisions = [];
            ballMesh.caster.set(ballMesh.position, ballMesh.rays[i]);
            collisions = ballMesh.caster.intersectObjects(sceneObstacles);

            if (collisions.length > 0 && collisions[0].distance <= distance) {
                console.log("COLLIDED!");
                console.log("*" + i + "*\n");
                if (i === 0 && ballMesh.direction.z === ballSpeed) {
                    ballMesh.direction.setZ(0);
                } else if (i === 4 && ballMesh.direction.z === -ballSpeed) {
                    ballMesh.direction.setZ(0);
                }

                if (i === 2 && ballMesh.direction.x === ballSpeed) {
                    ballMesh.direction.setX(0);
                } else if (i === 6 && ballMesh.direction.x === -ballSpeed) {
                    ballMesh.direction.setX(0);
                }

                if (i === 8) {
                    ballMesh.direction.setY(0);
                }
            }
        }
    }

    var testBox = new THREE.BoxGeometry(3, 4, 5, 1, 1, 1);
    var testBoxMat = new THREE.MeshPhongMaterial({color:0xffff00});
    var testBoxMesh = new THREE.Mesh(testBox, testBoxMat);
    testBoxMesh.position.set(10, 2, 1);
    scene.add(testBoxMesh);

    // add all scene obstacles
    var sceneObstacles = [];
    sceneObstacles.push(testBoxMesh);
    for(var i = 0; i < roadAry.length; i++){
        sceneObstacles.push(roadAry[i]);
    }
    for(var i = 0; i < medianAry.length; i++) {
        sceneObstacles.push(medianAry[i]);
    }

    // sets which way the ball rolls
    function setBallDirection(controls){
        var x = controls.forward ? ballSpeed : controls.back ? -ballSpeed : 0,
            y = -gravity;
            z = controls.right ? ballSpeed : controls.left ? -ballSpeed : 0;
        ballMesh.direction.set(x, y, z);
    }

	// detects if ball fell in hole
	function ballFall(){
		var radius = 0.64;
		for(var i = 0; i < holePositions.length; i++){
			if(Math.sqrt(Math.pow(Math.abs(ballMesh.position.z - holePositions[i][0]),2)+ 					Math.pow(Math.abs(ballMesh.position.x - holePositions[i][1]),2)) < radius){
				return true;
			}
		}
		return false;	
	}

    // detects if the reaches scene limits
    function ballLimitCollide(){
        // limits ball movement from going forward too far
        if(ballMesh.direction.x > 0 && ballMesh.position.x >= 112){
            return true;
        }
        // limits ball movement from going back too far
        if(ballMesh.direction.x < 0 && ballMesh.position.x <= -5){
            return true;
        }
        // limits ball movement to left wall
        if(ballMesh.direction.z < 0 && ballMesh.position.z <= -60){
            return true;
        }
        // limits ball movement to right wall
        if(ballMesh.direction.z > 0 && ballMesh.position.z >= 60){
            return true;
        }
        return false;
    }

    // moves the ball in each frame corresponding to its direction vector
    function moveBall(){
        var xTrans, zTrans, yTrans = 0;
        //yTrans += -ballSpeed;
        checkBallCollision();
        yTrans += ballMesh.direction.y;
        if(ballMesh.direction.x !== 0 || ballMesh.direction.z !== 0){
            if(ballFall()){
				ballMesh.position.y -= 0.05;
				if(ballMesh.position.y < -1){
					alert("Win");	

					var position = new THREE.Vector3();
					position.getPositionFromMatrix( ballMesh.matrixWorld );
										ballMesh.position.x = position.x;
					ballMesh.position.y = position.y;
					ballMesh.position.z = position.z;
					xTrans = 0;
					yTrans = 0;
				}
				return true;
			}

            //if(ballLimitCollide()){
            //    return false;
            //}
            checkBallCollision();
            // move ball
            console.log(ballMesh.direction);
            xTrans = ballMesh.direction.x * ((ballMesh.direction.z === 0) ? 4 : Math.sqrt(8));
            zTrans = ballMesh.direction.z * ((ballMesh.direction.x === 0) ? 4 : Math.sqrt(8));

            ballMesh.position.x += xTrans;
            ballMesh.position.z += zTrans;

            cameraCF.multiply(new THREE.Matrix4().makeTranslation(xTrans, 0, zTrans));

            if(ballMesh.direction.x == ballSpeed){
                ballCF = new THREE.Matrix4().makeRotationZ(-ballSpeed / ballRad).multiply(ballCF);
            }else if(ballMesh.direction.x == -ballSpeed){
                ballCF = new THREE.Matrix4().makeRotationZ(ballSpeed / ballRad).multiply(ballCF);
            }
            if(ballMesh.direction.z == ballSpeed){
                ballCF = new THREE.Matrix4().makeRotationX(ballSpeed / ballRad).multiply(ballCF);
            }else if(ballMesh.direction.z == -ballSpeed){
                ballCF = new THREE.Matrix4().makeRotationX(-ballSpeed / ballRad).multiply(ballCF);
            }
        }
        console.log(ballMesh.position);
        ballMesh.position.y += yTrans;
		return true;
    }
    scene.add(ballMesh);

    onRenderFcts.push(function(delta, now){
		if(run){
			for(var i = 0; i < totalCars; i++){
				allCars[i]["cf"].multiply(new THREE.Matrix4().makeTranslation(0, -allCars[i]["speed"], 0));
				allCars[i]["cf"].decompose(tran, quat, vscale);
				allCars[i]["car"].position.copy(tran);
				allCars[i]["car"].quaternion.copy(quat);

				// get the coordinates of the car
				var position = new THREE.Vector3();
				position.getPositionFromMatrix( allCars[i]["car"].matrixWorld );
				
				// move car to other end of tunnel to restart its path
				if(allCars[i]["direction"] = "left" && position.z < -tunnelEnd - 35){
					allCars[i]["cf"].multiply(new THREE.Matrix4().makeTranslation(0, 2*(tunnelEnd + 35), 0));
					allCars[i]["cf"].decompose(tran, quat, vscale);
					allCars[i]["car"].position.copy(tran);
					allCars[i]["car"].quaternion.copy(quat);
				}else if(allCars[i]["direction"] = "right" && position.z > tunnelEnd + 35){
					allCars[i]["cf"].multiply(new THREE.Matrix4().makeTranslation(0, 2*(tunnelEnd + 35), 0));
					allCars[i]["cf"].decompose(tran, quat, vscale);
					allCars[i]["car"].position.copy(tran);
					allCars[i]["car"].quaternion.copy(quat);
				}
			}
		}
    });

    //////////////////////////////////////////////////////////////////////////////////
    //		Camera Controls							//
    //////////////////////////////////////////////////////////////////////////////////
    var mouse	= {x : 0, y : 0};
    document.addEventListener('mousemove', function(event){
        mouse.x	= (event.clientX / window.innerWidth ) - 0.5;
        mouse.y	= (event.clientY / window.innerHeight) - 0.5;
    }, false);

    var shift = false;  // if shift is being held or not
    var selected_obj = camera;
    var controls = {
        forward: false,
        back: false,
        left: false,
        right: false
    };
    document.addEventListener('keydown', function(event){
        var prevent = true;
        switch(event.which){
            /**** hold shift to rotate objects *****/
            case 16:    // hold shift to rotate objects
                shift = true;
                break;
			/**** STOP/START ANIMATION ******/
            case 32:
                run = !run;
				break;
            /**** use WADS for moving the ball ******/
            case 87:    // 'w' moves ball forward
                controls.forward = true;
                break;
            case 83:    // 's' moves ball backward
                controls.back = true;
                break;
            case 65:    // 'a' moves ball left
                controls.left = true;
                break;
            case 68:    // 'd' moves ball right
                controls.right = true;
                break;
            /* not used currently
            case 69:    // 'e' rotates camera right

                break;
            case 81:    // 'q' rotates camera left

                break;
            */
        }
        if (prevent) {
            event.preventDefault();
        } else {
            return;
        }
        setBallDirection(controls);
    }, false);

    document.addEventListener('keyup', function(event){
        var prevent = true;
        switch(event.which) {
            case 16:    // release shift to go back to translating instead of rotating
                shift = false;
                break;
            // release any key to stop ball
            case 87:
                controls.forward = false;
                break;
            case 83:
                controls.back = false;
                break;
            case 65:
                controls.left = false;
                break;
            case 68:
                controls.right = false;
                break;
        }
        if (prevent) {
            event.preventDefault();
        } else {
            return;
        }
        setBallDirection(controls);
    }, false);

    onRenderFcts.push(function(delta, now){
        /*allCars[0]["cf"].decompose(tran, quat, vscale);
        allCars[0]["car"].position.copy(tran);
        allCars[0]["car"].quaternion.copy(quat);*/

        // responsible for ball and camera movement
        if(moveBall()){
        	ballCF.decompose(tran, quat, vscale);
        	ballMesh.quaternion.copy(quat);
        	cameraCF.decompose(tran, quat, vscale);
        	camera.position.copy(tran);
        	camera.quaternion.copy(quat);
        	camera.lookAt(ballMesh.position);
		}



        /*allCars[0]["lightR_cf"] = new THREE.Matrix4().copy(allCars[0]["cf"]);
        allCars[0]["lightR_cf"].multiply(new THREE.Matrix4().makeTranslation(1.7, 0, (allCars[0]["car"].offGround + allCars[0]["car"].chassisHeight - 0.5) * 3.5));
        allCars[0]["lightR_cf"].decompose(tran, quat, vscale);
        allCars[0]["lightR"].position.copy(tran);
        allCars[0]["lightR"].quaternion.copy(quat);

        allCars[0]["lightL_cf"] = new THREE.Matrix4().copy(allCars[0]["lightR_cf"]);
        allCars[0]["lightL_cf"].multiply(new THREE.Matrix4().makeTranslation((allCars[0].chassisWidth - 1)*3.5, 0, 0))
        allCars[0]["lightL_cf"].decompose(tran, quat, vscale);
        allCars[0]["lightL"].position.copy(tran);
        allCars[0]["lightL"].quaternion.copy(quat);*/
    });

    //////////////////////////////////////////////////////////////////////////////////
    //		render the scene						//
    //////////////////////////////////////////////////////////////////////////////////
    onRenderFcts.push(function(){
        renderer.render( scene, camera );
    });

    //////////////////////////////////////////////////////////////////////////////////
    //		Rendering Loop runner						//
    //////////////////////////////////////////////////////////////////////////////////
    var lastTimeMsec= null;
    requestAnimationFrame(function animate(nowMsec){
        // keep looping
        requestAnimationFrame( animate );
        // measure time
        lastTimeMsec	= lastTimeMsec || nowMsec-1000/60;
        var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec);
        lastTimeMsec	= nowMsec;
        // call each update function
        onRenderFcts.forEach(function(onRenderFct){
            onRenderFct(deltaMsec/1000, nowMsec/1000)
        })
    })
})

