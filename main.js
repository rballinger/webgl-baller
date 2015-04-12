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
    camera.position.set(225, 100, 120);
    camera.lookAt(scene.position);

	// determines if call-back will render new scene
	var run = true;

    // declare the rendering loop
    var onRenderFcts= [];

    // handle window resize events
    var winResize	= new THREEx.WindowResize(renderer, camera);

	// hold the current time for car repositioning in render
	var holdTime;

	// position of car one
	var carOneYSpeed = -3;

	var tunnelRightPos = -125;
	var tunnelLeftPos = 125;

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

    var car_cf = new THREE.Matrix4();
    car_cf.makeTranslation(60, 0, -165);
    car_cf.multiply(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(-90)));
    //car_cf.multiply(new THREE.Matrix4().makeRotationZ(THREE.Math.degToRad(-90)));
    car_cf.decompose(tran, quat, vscale);

    // add car
    var car = new Car();
    // set car to car_cf
    car.position.copy(tran);
    car.quaternion.copy(quat);
	car.scale.set(3.5,3.5,3.5);
    scene.add(car);

    // headlight coord frames
    var lightR_cf;
    var lightL_cf;
    // add headlights
    var lightR = new THREE.SpotLight('white', 10, 100, Math.PI/6, 1);
    lightR.target.position.set(0, 0, 1000);
    lightR.target.updateMatrixWorld();
    var lightL = new THREE.SpotLight('white', 10, 100, Math.PI/6, 1);
    lightL.target.position.set(0, 0, 1000);
    lightL.target.updateMatrixWorld();
    scene.add(lightR);
    scene.add(lightL);

    // road ways
    var roadOnePlane = new THREE.PlaneBufferGeometry(260, 50, 5, 5);
    var asphaltTex = THREE.ImageUtils.loadTexture("textures/road.jpg");
    asphaltTex.repeat.set(1, 1);
    asphaltTex.wrapS = THREE.MirroredRepeatWrapping;
    asphaltTex.wrapT = THREE.RepeatWrapping;
	var roadMat = new THREE.MeshPhongMaterial({color:0x696969, map:asphaltTex});
	var roadOne = new THREE.Mesh(roadOnePlane, roadMat);
    roadOne.rotateX(THREE.Math.degToRad(-90));
	roadOne.rotateZ(THREE.Math.degToRad(-90));
	roadOne.translateY(-50);
    scene.add(roadOne);

	var roadTwo = new THREE.Mesh(roadOnePlane, roadMat);
    roadTwo.rotateX(THREE.Math.degToRad(-90));
	roadTwo.rotateZ(THREE.Math.degToRad(-90));
	roadTwo.translateY(50);
    scene.add(roadTwo);

	// Grass
    var grassPlane = new THREE.PlaneBufferGeometry(260, 50, 5, 5);
    var grassTex = THREE.ImageUtils.loadTexture("textures/grass.jpg");
    grassTex.repeat.set(1, 1);
    grassTex.wrapS = THREE.MirroredRepeatWrapping;
    grassTex.wrapT = THREE.RepeatWrapping;
	var grassMat = new THREE.MeshPhongMaterial({color:0x696969, map:grassTex});
	var grassMid = new THREE.Mesh(grassPlane, grassMat);
    grassMid.rotateX(THREE.Math.degToRad(-90));
	grassMid.rotateZ(THREE.Math.degToRad(-90));
    scene.add(grassMid);

	var grassBegin = new THREE.Mesh(grassPlane, grassMat);
    grassBegin.rotateX(THREE.Math.degToRad(-90));
	grassBegin.rotateZ(THREE.Math.degToRad(-90));
	grassBegin.translateY(100);
    scene.add(grassBegin);

	var grassEnd = new THREE.Mesh(grassPlane, grassMat);
    grassEnd.rotateX(THREE.Math.degToRad(-90));
	grassEnd.rotateZ(THREE.Math.degToRad(-90));
	grassEnd.translateY(-100);
    scene.add(grassEnd);

	// Tunnel
    var tunnelPlane = new THREE.PlaneBufferGeometry(102, 60, 5, 5);
    var tunnelTex = THREE.ImageUtils.loadTexture("textures/tunnel.jpg");
    tunnelTex.repeat.set(1, 1);
    tunnelTex.wrapS = THREE.MirroredRepeatWrapping;
    tunnelTex.wrapT = THREE.RepeatWrapping;
	var tunnelMat = new THREE.MeshPhongMaterial({color:0x696969, map:tunnelTex});
	var tunnelOne = new THREE.Mesh(tunnelPlane, tunnelMat);
	tunnelOne.translateY(18);
	tunnelOne.translateX(51);
	tunnelOne.translateZ(tunnelRightPos);
    scene.add(tunnelOne);

	var tunnelTwo = new THREE.Mesh(tunnelPlane, tunnelMat);
	tunnelTwo.translateY(18);
	tunnelTwo.translateX(-51);
	tunnelTwo.translateZ(tunnelRightPos);
    scene.add(tunnelTwo);

	var tunnelThree = new THREE.Mesh(tunnelPlane, tunnelMat);
	tunnelThree.translateY(18);
	tunnelThree.translateX(51);
	tunnelThree.translateZ(tunnelLeftPos);
	tunnelThree.rotateY(THREE.Math.degToRad(180));
    scene.add(tunnelThree);

	var tunnelFour = new THREE.Mesh(tunnelPlane, tunnelMat);
	tunnelFour.translateY(18);
	tunnelFour.translateX(-51);
	tunnelFour.translateZ(tunnelLeftPos);
	tunnelFour.rotateY(THREE.Math.degToRad(180));
    scene.add(tunnelFour);

	// rock wall
    var wallPlane = new THREE.PlaneBufferGeometry(248, 95, 5, 5);
    var wallTex = THREE.ImageUtils.loadTexture("textures/rockWall.jpg");
    wallTex.repeat.set(1, 1);
    wallTex.wrapS = THREE.MirroredRepeatWrapping;
    wallTex.wrapT = THREE.RepeatWrapping;
	var wallMat = new THREE.MeshPhongMaterial({color:0x696969, map:wallTex});
	var wallOne = new THREE.Mesh(wallPlane, wallMat);
	wallOne.translateY(48);
	wallOne.translateZ(-125.7);
    scene.add(wallOne);

	var wallTwo = new THREE.Mesh(wallPlane, wallMat);
	wallTwo.translateY(48);
	wallTwo.translateZ(125.7);
	wallTwo.rotateY(THREE.Math.degToRad(180));
    scene.add(wallTwo);

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

	var tree1 = new Tree();
	scene.add(tree1);
	tree1.position.set (0, 38, 85);

	var tree2 = new Tree();
	scene.add(tree2);
	tree2.position.set (0, 38, 0);

	var tree3 = new Tree();
	scene.add(tree3);
	tree3.position.set (0, 38, -85);

    onRenderFcts.push(function(delta, now){
		if(run){
			/* TODO */

		    car_cf.multiply(new THREE.Matrix4().makeTranslation(0, carOneYSpeed, 0));
		    car_cf.decompose(tran, quat, vscale);
		    car.position.copy(tran);
    		car.quaternion.copy(quat);

			// get the coordinates of the car
			var position = new THREE.Vector3();
			position.getPositionFromMatrix( car.matrixWorld );
				
			// move car to other end of tunnel to restart its path
			if(position.z > tunnelLeftPos + 55){
				//holdTime = now;

				//if(holdTime - now > 1000000){
					car_cf.makeTranslation(60, 0, -165);
					car_cf.multiply(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(-90)));
					car_cf.decompose(tran, quat, vscale);
				//}
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

    var speed = 5.0;
    var carSpeed = 0;
    var shift = false;  // if shift is being held or not
    var selected_obj = camera;
    document.addEventListener('keydown', function(event){
        switch(event.which){
            /**** to select objects ******/
            case 84:    // 't' to select car
                selected_obj = car;
                break;
            case 67:    // 'c' to select camera
                selected_obj = camera;
                break;
            /**** hold shift to rotate objects *****/
            case 16:    // hold shift to rotate objects
                shift = true;
                break;
			/**** STOP/START ANIMATION ******/
            case 32:
                run = !run;
				break;
            /**** for moving/rotating selected object ******/
            case 65:    // 'a' moves along normal +z-axis, rotates on +y-axis
                if(shift)
                    selected_obj.rotateY(THREE.Math.degToRad(speed));
                else
                    selected_obj.position.z += speed;
                break;
            case 68:    // 'd' moves along normal -z-axis, rotates on -y-axis
                if(shift)
                    selected_obj.rotateY(THREE.Math.degToRad(-speed));
                else
                    selected_obj.position.z -= speed;
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
            case 87:    // 'w' moves along normal +y-axis, rotates on +x-axis
                if(shift)
                    selected_obj.rotateX(THREE.Math.degToRad(speed));
                else
                    selected_obj.position.y += speed;
                break;
            case 83:    // 's' moves along normal -y-axis, rotates on -x-axis
                if(shift)
                    selected_obj.rotateX(THREE.Math.degToRad(-speed));
                else
                    selected_obj.position.y -= speed;
                break;
            /***** other stuff ******/
            case 73:    // 'i' "drive" car forward when it's selected
                if(selected_obj == car) {
                    carSpeed += 0.1;
                    car_cf.multiply(new THREE.Matrix4().makeTranslation(0, -carSpeed, 0));
                    car.rotateTires(carSpeed);
                }
                break;
            case 75:    // 'k' to drive car backward when it's selected
                if(selected_obj == car) {
                    carSpeed += 0.1;
                    car_cf.multiply(new THREE.Matrix4().makeTranslation(0, carSpeed, 0));
                    car.rotateTires(-carSpeed);
                }
                break;
        }
    }, false);

    document.addEventListener('keyup', function(event){
        switch(event.which) {
            case 16:    // release shift to go back to translating instead of rotating
                shift = false;
                break;
            case 73:    // release drive forward key to stop car
                carSpeed = 0;
                break;
            case 75:    // release drive backward key to stop car
                carSpeed = 0;
                break;
        }
    }, false);

    onRenderFcts.push(function(delta, now){
        car_cf.decompose(tran, quat, vscale);
        car.position.copy(tran);
        car.quaternion.copy(quat);

        lightR_cf = new THREE.Matrix4().copy(car_cf);
        lightR_cf.multiply(new THREE.Matrix4().makeTranslation(0.5, 0, car.offGround + car.chassisHeight - 0.5));
        lightR_cf.decompose(tran, quat, vscale);
        lightR.position.copy(tran);
        lightR.quaternion.copy(quat);

        lightL_cf = new THREE.Matrix4().copy(lightR_cf);
        lightL_cf.multiply(new THREE.Matrix4().makeTranslation(car.chassisWidth - 1, 0, 0))
        lightL_cf.decompose(tran, quat, vscale);
        lightL.position.copy(tran);
        lightL.quaternion.copy(quat);
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
