/**
 * Created by dan on 3/24/15.
 */
UFO = function() {

    // color of elbow, shade and post
    var frameMat = new THREE.MeshPhongMaterial({color:0xbebebe});

    // color of elbow, shade and post
    var baseMat = new THREE.MeshPhongMaterial({color:0x696969});

    // color of UFO mid band
    var midMat = new THREE.MeshPhongMaterial({color:0xff1493});

    // color of UFO cockpit band
    var pitMat = new THREE.MeshPhongMaterial({color:0x6b8e23});

    // group objects together
    var group = new THREE.Group();

    // post
    var geoBottom = new THREE.CylinderGeometry(30, 5, 5, 42);
    var bottom = new THREE.Mesh (geoBottom, frameMat);

    // base
    var geoTop = new THREE.CylinderGeometry(5, 30, 5, 42);
    var top = new THREE.Mesh (geoTop, frameMat);

    // middle
    var geoMid = new THREE.CylinderGeometry(30, 30, 2, 42);
    var mid = new THREE.Mesh (geoMid, midMat);

    // Sphere
    var geoSphere = new THREE.SphereGeometry(8, 42, 42);
    var sphere = new THREE.Mesh (geoSphere, pitMat);

    // scale the sphere along x and z axes
    sphere.scale.set(1.5, 0.9, 1.5);

    // position the primitive objects
    bottom.position.set (-6, -3.5, 8);
    top.position.set (-6, 3.5, 8);
    mid.position.set (-6, 0, 8);
    sphere.position.set (-6, 1, 8);

    // add primitive shapes to group to form UFO structure
    group.add (bottom);
    group.add (top);
    group.add (mid);
    group.add (sphere);

    //group.translateX (-38);
    //group.translateY (18);
//group.translateY (18);
    return group;
}

/* Inherit Wheel from THREE.Object3D */
UFO.prototype = Object.create (THREE.Object3D.prototype);
UFO.prototype.constructor = UFO;

