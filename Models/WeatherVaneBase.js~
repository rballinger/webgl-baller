/**
 * Created by dan on 3/24/15.
 */
WeatherVaneBase = function() {

	var baseMat = new THREE.MeshPhongMaterial({color:0x696969});

    // group objects together
    var group = new THREE.Group();

    // legs of base structure
    var geoLegOne = new THREE.CylinderGeometry(0.5, 0.5, 45, 42);
    var legOne = new THREE.Mesh (geoLegOne, baseMat);

    var geoLegTwo = new THREE.CylinderGeometry(0.5, 0.5, 45, 42);
    var legTwo = new THREE.Mesh (geoLegTwo, baseMat);

    var geoLegThree = new THREE.CylinderGeometry(0.5, 0.5, 45, 42);
    var legThree = new THREE.Mesh (geoLegThree, baseMat);

    var geoLegFour = new THREE.CylinderGeometry(0.5, 0.5, 45, 42);
    var legFour = new THREE.Mesh (geoLegFour, baseMat);

    // position the primitive objects
    var inXangle = Math.PI/12;
    var inYangle = Math.PI/12;

    legOne.position.set (-6, 20, 48);
    legOne.rotateX (inXangle);
    legOne.rotateZ (inYangle);
    legTwo.position.set (-6, 20, 60);
    legTwo.rotateX (-inXangle);
    legTwo.rotateZ (inYangle);
    legThree.position.set (-18, 20, 48);
    legThree.rotateX (inXangle);
    legThree.rotateZ (-inYangle);
    legFour.position.set (-18, 20, 60);
    legFour.rotateX (-inXangle);
    legFour.rotateZ (-inYangle);

    // add primitive shapes to group to form UFO structure
    group.add (legOne);
    group.add (legTwo);
    group.add (legThree);
    group.add (legFour);

    var geoCrossMemberOne = new THREE.CylinderGeometry(0.5, 0.5, 10, 22);
    var crossMemberOne = new THREE.Mesh (geoCrossMemberOne, baseMat);
    crossMemberOne.position.set (-6.6, 22, 54);
    crossMemberOne.rotateX (Math.PI/2);

    var geoCrossMemberTwo = new THREE.CylinderGeometry(0.5, 0.5, 10, 22);
    var crossMemberTwo = new THREE.Mesh (geoCrossMemberTwo, baseMat);
    crossMemberTwo.position.set (-17.4, 22, 54);
    crossMemberTwo.rotateX (Math.PI/2);

    var geoCrossMemberThree = new THREE.CylinderGeometry(0.5, 0.5, 11, 22);
    var crossMemberThree = new THREE.Mesh (geoCrossMemberThree, baseMat);
    crossMemberThree.position.set (-12.0, 22, 48.8);
    crossMemberThree.rotateX (Math.PI/2);
    crossMemberThree.rotateZ (Math.PI/2);

    var geoCrossMemberFour = new THREE.CylinderGeometry(0.5, 0.5, 11, 22);
    var crossMemberFour = new THREE.Mesh (geoCrossMemberFour, baseMat);
    crossMemberFour.position.set (-12.0, 22, 59.4);
    crossMemberFour.rotateX (Math.PI/2);
    crossMemberFour.rotateZ (Math.PI/2);

    var geoCrossMemberFive = new THREE.CylinderGeometry(0.5, 0.5, 16, 22);
    var crossMemberFive = new THREE.Mesh (geoCrossMemberFive, baseMat);
    crossMemberFive.position.set (-3.6, 11, 54);
    crossMemberFive.rotateX (Math.PI/2);

    var geoCrossMemberSix = new THREE.CylinderGeometry(0.5, 0.5, 16, 22);
    var crossMemberSix = new THREE.Mesh (geoCrossMemberSix, baseMat);
    crossMemberSix.position.set (-20.4, 11, 54);
    crossMemberSix.rotateX (Math.PI/2);

    var geoCrossMemberSeven = new THREE.CylinderGeometry(0.5, 0.5, 17, 22);
    var crossMemberSeven = new THREE.Mesh (geoCrossMemberSeven, baseMat);
    crossMemberSeven.position.set (-12.0, 11, 46);
    crossMemberSeven.rotateX (Math.PI/2);
    crossMemberSeven.rotateZ (Math.PI/2);

    var geoCrossMemberEight = new THREE.CylinderGeometry(0.5, 0.5, 17, 22);
    var crossMemberEight = new THREE.Mesh (geoCrossMemberEight, baseMat);
    crossMemberEight.position.set (-12.0, 11, 62);
    crossMemberEight.rotateX (Math.PI/2);
    crossMemberEight.rotateZ (Math.PI/2);

    // add cross members to structure
    group.add (crossMemberOne);
    group.add (crossMemberTwo);
    group.add (crossMemberThree);
    group.add (crossMemberFour);
    group.add (crossMemberFive);
    group.add (crossMemberSix);
    group.add (crossMemberSeven);
    group.add (crossMemberEight);

    group.translateX (-88);
    //group.translateY (18);
    //group.translateY (28);
    return group;
}

/* Inherit Wheel from THREE.Object3D */
WeatherVaneBase.prototype = Object.create (THREE.Object3D.prototype);
WeatherVaneBase.prototype.constructor = WeatherVaneBase;

