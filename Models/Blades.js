/**
 * Created by dan on 3/24/15.
 */
Blades = function() {

	var x = -5.5;
	var y = -0.5;
	var z = -0.5;

	var xScale = 0.2;
	var yScale = 0.17;
	var zScale = 0.2;

	var changeInX = -1.0;
	var gradAngle = 3;
	var gradient = -1*Math.tan(3);

	var numSegDiv = 20;
    var panelsPerSeg = 11;

    var geometry = new THREE.BufferGeometry();
	var points = [[10,0,6],[10,0,3],[10,0,0],[10,2,0],[10,4,0],[10,6,0],[10,7,3],[10,8,6],[10,6,6],[10,4,6],[10,2,6]];

    var vertexArr = new Float32Array(3*points.length*numSegDiv + 3);

    var normalArr = new Float32Array(3*points.length*numSegDiv + 3);
    var posZnorm = new THREE.Vector3();
    posZnorm.x = 0.0;
    posZnorm.y = 0.0;
    posZnorm.z = 1.0;
    posZnorm.normalize();

    var negZnorm = new THREE.Vector3();
    negZnorm.x = 0.0;
    negZnorm.y = 0.0;
    negZnorm.z = -1.0;
    negZnorm.normalize();

    var negYnorm = new THREE.Vector3();
    negYnorm.x = Math.tan(gradAngle);
    negYnorm.y = -1.0;
    negYnorm.z = 0.5;  
    negYnorm.normalize();

    var posYnorm = new THREE.Vector3();
    posYnorm.x = Math.tan(gradAngle);
    posYnorm.y = 1.0;
    posYnorm.z = -0.2;
    posYnorm.normalize();

    var posXnorm = new THREE.Vector3();
    posXnorm.x = 1;
    posXnorm.y = 0;
    posXnorm.z = 0;
    posXnorm.normalize();

    var negXnorm = new THREE.Vector3();
    negXnorm.x = -1;
    negXnorm.y = 0;
    negXnorm.z = 0;
    negXnorm.normalize();

	var points = [[10.0,0.0,6.0],[10.0,0.0,3.0],[10.0,0.0,0.0],[10.0,2.0,0.0],[10.0,4.0,0.0],[10.0,6.0,0.0],[10.0,7.0,3.0],[10.0,8.0,6.0],[10.0,6.0,6.0],[10.0,4.0,6.0],[10.0,2.0,6.0]];

	var frontCapOrder = [10,0,2,2,3,10,9,10,3,3,4,9,8,9,4,4,5,8,7,8,5];
	var endCapOrder = [2,0,10,10,3,2,3,10,9,9,4,3,4,9,8,8,5,4,5,8,7];

    var i = 0;
    var j = 0;

	// scale
	for(i = 0; i < points.length; i++){
		points[i][0] *= xScale;
		points[i][1] *= yScale;
		points[i][2] *= zScale;
	}

	// translation
	for(i = 0; i < points.length; i++){
		points[i][0] += x;
		points[i][1] += y;
		points[i][2] += z;
	}

	k = 0;

	// calculating points
	// add points to vertex array, add normals to vertices
	for(i = 0; i < numSegDiv; i++){
		for(j = 0; j < points.length; j++){
			vertexArr[k] = points[j][0];
			vertexArr[k + 1] = points[j][1];
			vertexArr[k + 2] = points[j][2];
			if(i == 0){
				normalArr[k] = posXnorm.x;
		    	normalArr[k + 1] = posXnorm.y;
		    	normalArr[k + 2] = posXnorm.z;
			}else if(i == numSegDiv - 1){
				normalArr[k] = negXnorm.x;
		    	normalArr[k + 1] = negXnorm.y;
		    	normalArr[k + 2] = negXnorm.z;
			}else if(j == 0 || j <= 10 && j > 7){
				normalArr[k] = posZnorm.x;
		    	normalArr[k + 1] = posZnorm.y;
		    	normalArr[k + 2] = posZnorm.z;
			}else if(j >= 2 && j <= 5){
				normalArr[k] = negZnorm.x;
		    	normalArr[k + 1] = negZnorm.y;
		    	normalArr[k + 2] = negZnorm.z;
			}else if(j == 1){
				normalArr[k] = negYnorm.x;
		    	normalArr[k + 1] = negYnorm.y;
		    	normalArr[k + 2] = negYnorm.z;
			}else if(j == 6 || j == 7){
				normalArr[k] = posYnorm.x;
		    	normalArr[k + 1] = posYnorm.y;
		    	normalArr[k + 2] = posYnorm.z;
			}
			// change gradient
			if( j >= 0 && j <= 2 ){
				points[j][1] -= gradient;
			}else if(j >= 5 && j <=7){
				points[j][1] += gradient;
			}		
			points[j][0] += changeInX;
			k+=3;
		}
	}

	// last point
	vertexArr[k] = points[j - 1][0] - changeInX;
	vertexArr[k + 1] = points[j - 1][1];
	vertexArr[k + 2] = points[j - 1][2];

    normalArr[k] = negZnorm.x;
    normalArr[k + 1] = negZnorm.y;
    normalArr[k + 2] = negZnorm.z;

    i = 0;
	j = 12;
	k = panelsPerSeg;

	var index = 0;
    var indexArr = new Uint32Array(panelsPerSeg*(numSegDiv-1)*6+frontCapOrder.length*3);

	for(var r = 0; r < (panelsPerSeg)*(numSegDiv-1) - 1; r++){
		indexArr[index] = i;
		indexArr[index + 1] = k;
		indexArr[index + 2] = j;
		if((k-10)%11 == 0){
			indexArr[index + 4] = k - 21;
		}else{
			indexArr[index + 4] = k - 10;
		}
		indexArr[index + 3] = j;
		indexArr[index + 5] = i;
		index+=6
		i += 1;
		j += 1;
		k += 1;
	}

	// last triangle
	indexArr[index++] = j;
	indexArr[index++] = k - 10;
	indexArr[index++] = i;

    i = 10;
	j = 2;
 	k = 11;

	// front cap of blade
	for(var f = 0; f < 7; f ++){
		indexArr[index] = i;
		indexArr[index + 1] = k%11;
		indexArr[index + 2] = j;
		indexArr[index + 3] = j;
		indexArr[index + 4] = j + 1;
		indexArr[index + 5] = i;

		index+=6;

		i--;
		j++;
		k--;
	}
	var totalPoints = panelsPerSeg*(numSegDiv);

	// back cap of blade
	indexArr[index++] = totalPoints - 6;
	indexArr[index++] = totalPoints - 3;
	indexArr[index++] = totalPoints - 4;

	indexArr[index++] = totalPoints - 6;
	indexArr[index++] = totalPoints - 7;
	indexArr[index++] = totalPoints - 2;

	indexArr[index++] = totalPoints - 6;
	indexArr[index++] = totalPoints - 2;
	indexArr[index++] = totalPoints - 3;

	indexArr[index++] = totalPoints - 7;
	indexArr[index++] = totalPoints - 8;
	indexArr[index++] = totalPoints - 1;

	indexArr[index++] = totalPoints - 7;
	indexArr[index++] = totalPoints - 1;
	indexArr[index++] = totalPoints - 2;

	indexArr[index++] = totalPoints - 8;
	indexArr[index++] = totalPoints - 9;
	indexArr[index++] = totalPoints - 11;

	indexArr[index++] = totalPoints - 8;
	indexArr[index++] = totalPoints - 11;
	indexArr[index++] = totalPoints - 1;

    geometry.addAttribute('position', new THREE.BufferAttribute(vertexArr, 3));
    geometry.addAttribute('normal', new THREE.BufferAttribute(normalArr, 3));
    geometry.addAttribute('index', new THREE.BufferAttribute(indexArr, 1));

    geometry.computeBoundingSphere();

    var bladeMat = new THREE.MeshPhongMaterial({color: 0xFF8C00});
    var bladeMesh = new THREE.Mesh(geometry, bladeMat);

    var swivelGroup = new THREE.Group();
	swivelGroup.add(bladeMesh);

    return swivelGroup;
}

/* Inherit Wheel from THREE.Object3D */
Blades.prototype = Object.create (THREE.Object3D.prototype);
Blades.prototype.constructor = Blades;
