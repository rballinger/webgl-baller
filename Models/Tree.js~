/**
 * Created by dan on 4/11/15.
 */
Tree = function() {

	var repeats = 1;

	var treeGroup = new THREE.Group();
	var size = 0.2;
	var treeTop = new THREE.CylinderGeometry(0.0*size, 3*size, 5.0*size,14);
    var pineTex = THREE.ImageUtils.loadTexture("textures/pineNeedles.jpg");
    pineTex.repeat.set(repeats, repeats);
    pineTex.wrapS = THREE.MirroredRepeatWrapping;
    pineTex.wrapT = THREE.RepeatWrapping;
	var pineMat = new THREE.MeshPhongMaterial({color:0x696969, map:pineTex});
	var treeTopMesh = new THREE.Mesh(treeTop, pineMat);
	treeTopMesh.position.set(0*size,3.8,0*size);

	treeGroup.add( treeTopMesh );

	var treeMid = new THREE.CylinderGeometry(0.0*size, 5*size, 8.0*size ,14);
	var treeMidMesh = new THREE.Mesh(treeMid, pineMat);
	treeMidMesh.position.set(0*size,3,0*size);

	var treeBottom = new THREE.CylinderGeometry(0.0*size, 7*size, 11.0*size ,14);
	var treeBottomMesh = new THREE.Mesh(treeBottom, pineMat);
	treeBottomMesh.position.set(0*size,2,0*size);

   	var trunkTex = THREE.ImageUtils.loadTexture("textures/wood.jpg");
    trunkTex.repeat.set(1, 1);
    trunkTex.wrapS = THREE.MirroredRepeatWrapping;
    trunkTex.wrapT = THREE.RepeatWrapping;
	var trunkMat = new THREE.MeshPhongMaterial({color:0x696969, map:trunkTex});

	var treeTrunk = new THREE.CylinderGeometry(1.5*size, 1.5*size, 5.0*size ,14);
	var treeTrunkMesh = new THREE.Mesh(treeTrunk, trunkMat);
	treeTrunkMesh.position.set(0*size,0.3,0*size);

	treeGroup.add(treeTopMesh);
	treeGroup.add(treeMidMesh);
	treeGroup.add(treeBottomMesh);
	treeGroup.add(treeTrunkMesh);

    return treeGroup;
}
