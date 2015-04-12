/**
 * Created by dulimarh on 3/6/15.
 */
Wheel = function() {

	var NUM_HEXNUTS = 5;
	var HEXNUT_RAD = 1.0;

    var outterWallGeo = new THREE.CylinderGeometry(1.5, 3, 0.0 ,32);
    var outterWallMat = new THREE.MeshPhongMaterial({color: 0x848484});
    var outterWall = new THREE.Mesh (outterWallGeo, outterWallMat);
    var wheel_group = new THREE.Group();

    var innerWallGeo = new THREE.CylinderGeometry(1.5, 3, 0.0 ,32);
    var innerWallMat = new THREE.MeshPhongMaterial({color: 0x848484});
    var innerWall = new THREE.Mesh (innerWallGeo, innerWallMat);

    var treadGeo = new THREE.CylinderGeometry(3, 3, 2 ,32, 18, true);
    var tireTex = THREE.ImageUtils.loadTexture("textures/tire_tread.jpg");
    tireTex.repeat.set(10,1);
    tireTex.wrapS = THREE.RepeatWrapping;
    tireTex.wrapT = THREE.RepeatWrapping;
    var treadMat = new THREE.MeshPhongMaterial({color: 0x848484,  map:tireTex});
    var tread = new THREE.Mesh (treadGeo, treadMat);

    var hubGeo = new THREE.CylinderGeometry(2, 2, 2.1 ,32, 18, false);
    var hubMat = new THREE.MeshPhongMaterial({color: 0x696969});
    var hub = new THREE.Mesh (hubGeo, hubMat);

    var nutGeo = new THREE.CylinderGeometry(0.2, 0.2, 2.4 ,6, 16, false);
    var nutMat = new THREE.MeshPhongMaterial({color: 0x696969});
    var nut = new THREE.Mesh (nutGeo, nutMat);
	
	outterWall.rotateX (Math.PI);
	outterWall.translateY (2);
	hub.translateY (-1);
	//nut.translateY (-1);
	tread.translateY (-1);

    wheel_group.add (outterWall);
	wheel_group.add (innerWall);
	wheel_group.add (tread);
	wheel_group.add (hub);
	//wheel_group.add (nut);

    var dAng = 2 * Math.PI / NUM_HEXNUTS;
    var ang = 0;

    for (var k = 0; k < NUM_HEXNUTS; k++) {
        var s = nut.clone();
        s.translateX(HEXNUT_RAD*Math.cos(ang));
		s.translateZ(HEXNUT_RAD*Math.sin(ang));
        s.translateY(-1);
        wheel_group.add (s);
		ang += dAng;
    }

    return wheel_group;
}

/* Inherit Wheel from THREE.Object3D */
Wheel.prototype = Object.create (THREE.Object3D.prototype);
Wheel.prototype.constructor = Wheel;
