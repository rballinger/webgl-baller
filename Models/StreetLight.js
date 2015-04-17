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


    //////////////////////////////////////////////////////////////////////////////////
    //		tree shading	/shaderScripts/treeShader.html				//
    //////////////////////////////////////////////////////////////////////////////////

	var shaderProp = {
		uniforms : {
			color_dark : {
				type: "v4",
				value : new THREE.Vector4(0.8, 0.3, 0.1, 1.0)
			},
			needle_tex : {
				type: "t",
				value : THREE.ImageUtils.loadTexture("textures/pineNeedles.jpg")
			}
		},
		vertexShader: document.getElementById("vs0").textContent,
		fragmentShader : document.getElementById("fs0").textContent
	};

    // group objects together
    var group = new THREE.Group();

    // post
    var postGeo = new THREE.CylinderGeometry(0.20, 0.20, 7.5, 27);
    var post = new THREE.Mesh (postGeo, frameMat);

    // base
    var baseGeo = new THREE.CylinderGeometry(0.7, 0.7, 1.0, 36);
    var base = new THREE.Mesh (baseGeo, concrete1Mat);

    // elbow
    var elbowGeo = new THREE.TorusGeometry(1.2, 0.20, 28, 24, Math.PI);
    var elbow = new THREE.Mesh (elbowGeo, frameMat);
    elbow.rotateY (Math.PI);

    // base
    var shadeGeo = new THREE.CylinderGeometry(0.2, 0.75, 0.8, 28);
    var shade = new THREE.Mesh (shadeGeo, baseMat);

    // position the primitive objects
    shade.position.set (8.4, -3.85, 0);
    base.position.set (6, -7.6, 0);
    post.position.set (6, -7.2, 0);
    elbow.position.set (7.2, -3.5, 0);

    // add primitive shapes to group to form street light structure
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

