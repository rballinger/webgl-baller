/**
 * Created by dan on 3/24/15.
 */
Fan = function() {
    var NUM_SPOKES = 8;

	// spokes
    var spokeGeo = new THREE.CylinderGeometry(0.3, 0.3, 3.5);
    var spokeMat = new THREE.MeshPhongMaterial({color: 0x848484});
    var spoke = new THREE.Mesh (spokeGeo, spokeMat);

	// blades
	var blade = new Blades();

	// inner cylinder stabilizer
    var innerCylGeo = new THREE.CylinderGeometry(3.0, 3.0, 0.6 ,32, 18, true);
    var innerCylMat = new THREE.MeshPhongMaterial({color: 0x848484});
    var innerCyl = new THREE.Mesh (innerCylGeo, innerCylMat);
	innerCyl.material.side = THREE.DoubleSide;
	innerCyl.rotateX(Math.PI / 2);

	// outer cylinder stabilizer
    var outerCylGeo = new THREE.CylinderGeometry(10.0, 10.0, 0.6 ,32, 18, true);
    var outerCylMat = new THREE.MeshPhongMaterial({color: 0x848484});
    var outerCyl = new THREE.Mesh (outerCylGeo, outerCylMat);
	outerCyl.material.side = THREE.DoubleSide;
	outerCyl.rotateX(Math.PI / 2);


    var group = new THREE.Group();

	group.add(innerCyl);
	group.add(outerCyl);

    var dAng = 2 * Math.PI / NUM_SPOKES;
    for (var k = 0; k < NUM_SPOKES; k++) {
        var s = spoke.clone();
		var b = blade.clone();
		b.rotateZ(k * dAng);
		b.rotateX(10);
        s.rotateZ(k * dAng);
        s.translateY(1.75);
        group.add (s);
		group.add (b);
    }

	group.translateZ(25);


    return group;
}

/* Inherit Wheel from THREE.Object3D */
Fan.prototype = Object.create (THREE.Object3D.prototype);
Fan.prototype.constructor = Fan;
