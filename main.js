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
    var scene	= new THREE.Scene();
    var camera	= new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);

    var ballRad = 0.5;
    var ballCF = new THREE.Matrix4();
    ballCF.multiply(new THREE.Matrix4().makeTranslation(0, ballRad, 0));
    var cameraCF = new THREE.Matrix4();
    cameraCF.multiply(ballCF);
    cameraCF.multiply(new THREE.Matrix4().makeTranslation(-10, 3, 0));
    camera.position.set(-75, 40, 0);
    //position.set(100, 100, 100);
    camera.lookAt(new THREE.Vector3(100, 0, 0));

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

	var totalCars = 10;

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
		if(Math.floor(Math.random() * (1 - 0 + 1)) + 0 == 1){
			dir = "right";
		}
		var randRoad = Math.floor(Math.random() * (5 - 0)) + 0;
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

    var totalArea1Width = 150;

    // roads and medians
    var MAX_LANES = 3;
    var ROAD_WIDTH = 14;
    var MEDIAN_WIDTH = 4;
    var roadAry = [];
    var medianAry = [];
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
        var median = new THREE.PlaneBufferGeometry(MEDIAN_WIDTH, 150, 1, 5);
        var medianMat = new THREE.MeshPhongMaterial({color:0x7CFC00});
        medianAry[i] = new THREE.Mesh(median, medianMat);
        medianAry[i].rotateX(THREE.Math.degToRad(-90));
        medianAry[i].translateX((MEDIAN_WIDTH / 2) * (2 * i) + (ROAD_WIDTH / 2) * (Math.pow(i, 2) + i));
        scene.add(medianAry[i]);
    }

    var totalArea1Length = MAX_LANES * MEDIAN_WIDTH + 6 * ROAD_WIDTH;
    console.log(totalArea1Length);

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

    var ball = new THREE.SphereGeometry(ballRad, 20, 20);
    var ballMat = new THREE.MeshPhongMaterial({color:0xFFFF00});
    var ballMesh = new THREE.Mesh(ball, ballMat);
    ballMesh.translateY(ballRad);
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

    var speed = 1.0;
    var ballSpeed = 0;
    var shift = false;  // if shift is being held or not
    var selected_obj = camera;
    document.addEventListener('keydown', function(event){
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
                if(ballSpeed <= 0.5) {
                    ballSpeed += 0.05;
                }
                break;
            case 83:    // 's' moves ball backward
                ballSpeed -= 0.1;
                ballCF.multiply(new THREE.Matrix4().makeTranslation(ballSpeed, 0, 0));
                cameraCF.multiply(new THREE.Matrix4().makeTranslation(ballSpeed, 0, 0));
                break;
            case 65:    // 'a' moves ball left
                ballSpeed -= 0.1;
                ballCF.multiply(new THREE.Matrix4().makeTranslation(0, 0, ballSpeed));
                cameraCF.multiply(new THREE.Matrix4().makeTranslation(0, 0, ballSpeed));
                break;
            case 68:    // 'd' moves ball right
                ballSpeed += 0.1;
                ballCF.multiply(new THREE.Matrix4().makeTranslation(0, 0, ballSpeed));
                cameraCF.multiply(new THREE.Matrix4().makeTranslation(0, 0, ballSpeed));
                break;
            case 69:    // 'e' moves along normal +x-axis, rotates on -z-axis
                if(shift)
                    selected_obj.rotateZ(THREE.Math.degToRad(-speed));
                else
                    selected_obj.position.x += speed;
                break;
            case 81:    // 'q' moves along normal -x-axis, rotates on +z-axis
                if(shift)
                    selected_obj.rotateZ(THREE.Math.degToRad(speed));
                else
                    selected_obj.position.x -= speed;
                break;


        }
    }, false);

    var interval;

    document.addEventListener('keyup', function(event){
        switch(event.which) {
            case 16:    // release shift to go back to translating instead of rotating
                shift = false;
                break;
            // release any key to stop ball
            case 87:
                interval = setInterval(function(){decreaseBallSpeed(true)}, 100);
                break;
            case 83:
                ballSpeed = 0;
                break;
            case 65:
                ballSpeed = 0;
                break;
            case 68:
                ballSpeed = 0;
                break;
        }
    }, false);

    function decreaseBallSpeed(posDir){
        if(posDir){
            if(ballSpeed <= 0.1){
                clearInterval(interval);
                ballSpeed = 0;
                return;
            }

            ballSpeed -= 0.1;
            console.log("minusing ballSpeed: " + ballSpeed);
        }else {
            ballSpeed += 0.1;
        }
    }

    onRenderFcts.push(function(delta, now){
        allCars[0]["cf"].decompose(tran, quat, vscale);
        allCars[0]["car"].position.copy(tran);
        allCars[0]["car"].quaternion.copy(quat);

        // responsible for ball and camera movement
        console.log(ballSpeed);
        ballCF.multiply(new THREE.Matrix4().makeTranslation(ballSpeed, 0, 0));
        cameraCF.multiply(new THREE.Matrix4().makeTranslation(ballSpeed, 0, 0));
        ballCF.decompose(tran, quat, vscale);
        ballMesh.position.copy(tran);
        ballMesh.quaternion.copy(quat);
        cameraCF.decompose(tran, quat, vscale);
        camera.position.copy(tran);
        camera.quaternion.copy(quat);
        camera.lookAt(ballMesh.position);


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

