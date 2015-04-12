/**
 * Created by dan on 3/24/15.
 */
VaneSwivel = function(len) {

    // color base and swivel
    var frameMat = new THREE.MeshPhongMaterial({color:0xbebebe});
	    
	// base
    var baseGeo = new THREE.CylinderGeometry(2.5, 2.5, 12, 27);
    var base = new THREE.Mesh (baseGeo, frameMat);

	// base
    var axelGeo = new THREE.CylinderGeometry(1.0, 1.0, 8, 27);
    var axel = new THREE.Mesh (axelGeo, frameMat);

	var blade = new Blades();
    var swivelGroup = new THREE.Group();

	axel.rotateZ (Math.PI/2);
	axel.translateZ (1);
	axel.translateY (-9);

	base.rotateZ (Math.PI/2);
	base.translateZ (1);

	swivelGroup.add(base);
	swivelGroup.add(axel);
	swivelGroup.add(blade);

	//swivelGroup.rotateY(Math.PI);
	swivelGroup.translateZ(53);
	swivelGroup.translateX(-9);
	swivelGroup.translateY(41);

    return swivelGroup;
}

/* Inherit Wheel from THREE.Object3D */
VaneSwivel.prototype = Object.create (THREE.Object3D.prototype);
VaneSwivel.prototype.constructor = VaneSwivel;
