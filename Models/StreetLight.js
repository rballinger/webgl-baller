/**
 * Created by dan on 3/24/15.
 */
StreetLight = function(len) {

    // color of elbow, shade and post
    var frameMat = new THREE.MeshPhongMaterial({color:0xbebebe});

    // color of elbow, shade and post
    var baseMat = new THREE.MeshPhongMaterial({color:0x696969});

    var concrete1Tex = THREE.ImageUtils.loadTexture("textures/concrete.jpg");
    concrete1Tex.repeat.set(1, 1);
    concrete1Tex.wrapS = THREE.MirroredRepeatWrapping;
    concrete1Tex.wrapT = THREE.RepeatWrapping;
	var concrete1Mat = new THREE.MeshPhongMaterial({color:0x696969,ambient:0x1d6438, map:concrete1Tex});

    var concrete2Tex = THREE.ImageUtils.loadTexture("textures/concrete2.jpg");
    concrete2Tex.repeat.set(1, 1);
    concrete2Tex.minFilter = THREE.NearestFilter;
    //concrete2Tex.wrapS = THREE.MirroredRepeatWrapping;
    //concrete2Tex.wrapT = THREE.RepeatWrapping;
	var concrete2Mat = new THREE.MeshPhongMaterial({color:0x696969,ambient:0x1d6438, map:concrete2Tex});


    // group objects together
    var group = new THREE.Group();

    // post
    var postGeo = new THREE.CylinderGeometry(0.75, 0.75, 22, 27);
    var post = new THREE.Mesh (postGeo, frameMat);

    // base
    var baseGeo = new THREE.CylinderGeometry(2.25, 2.25, 6, 24);
    var base = new THREE.Mesh (baseGeo, concrete1Mat);

    // elbow
    var elbowGeo = new THREE.TorusGeometry(6, 0.75, 20, 24, Math.PI);
    var elbow = new THREE.Mesh (elbowGeo, frameMat);
    elbow.rotateY (Math.PI);

    // base
    var shadeGeo = new THREE.CylinderGeometry(0.7, 2.75, 2, 28);
    var shade = new THREE.Mesh (shadeGeo, baseMat);

    // curb
    var curbGeo = new THREE.CylinderGeometry(15.0, 15.0, 2, 4);
    var curb = new THREE.Mesh (curbGeo, concrete2Mat);
    curb.rotateY (Math.PI/4);

    // position the primitive objects
    curb.position.set (6, -7, 8);
    shade.position.set (-6, 14, 8);
    base.position.set (6, -6, 8);
    post.position.set (6, 4, 8);
    elbow.position.set (0, 15, 8);

    // add primitive shapes to group to form street light structure
    group.add (curb);
    group.add (shade);
    group.add (base);
    group.add (post);
    group.add (elbow);

    group.translateY (8);
    return group;
}

/* Inherit Wheel from THREE.Object3D */
StreetLight.prototype = Object.create (THREE.Object3D.prototype);
StreetLight.prototype.constructor = StreetLight;

