/**
 * Created by dan on 3/24/15.
 */
var Ground = function () {
    var geometry = new THREE.BufferGeometry();

    var subDivY = 100;
    var subDivX = 100;
    var vertexArr = new Float32Array((subDivX)*(subDivY)*3);

    var i = 0;
    var depth = 0.0;

    var normalArr = new Float32Array(vertexArr.length);
    var norm = new THREE.Vector3();
    norm.x = 0.0;
    norm.y = 1.0;
    norm.z = 0.0;
    norm.normalize();

    var x = -250.0;
    var z = -250.0;
    var counter = 0;

    for(i = 0; i < subDivX; i += 1) {
        for (j = 0; j < subDivY; j += 1) {
            vertexArr[counter] = x;
            vertexArr[counter + 1] = 0.0;
            vertexArr[counter + 2] = z;

            normalArr[counter] = norm.x;
            normalArr[counter + 1] = norm.y;
            normalArr[counter + 2] = norm.z;
            counter += 3;
            z += 5.0;
        }
        z = -250.0;
        x += 5.0;
    }

    geometry.addAttribute('position', new THREE.BufferAttribute(vertexArr, 3));
    geometry.addAttribute('normal', new THREE.BufferAttribute(normalArr, 3));

    j = 0, k = 0;
    i = 0;
    y = 0;
    counter = 0;

    var indexArr = new Uint32Array((subDivX-1)*(subDivY-1) * 6);

    for(i = 0; i < subDivX-1; i++) {
        for (y = 0; y < subDivY - 1; y++) {
            indexArr[counter] = j + subDivY;
            indexArr[counter + 1] = j;
            indexArr[counter + 2] = j + 1;
            indexArr[counter + 3] = j + 1;
            indexArr[counter + 4] = j + subDivY + 1;
            indexArr[counter + 5] = j + subDivY;
            j++;
            k++;
            counter += 6;
        }
    }

    geometry.addAttribute('index', new THREE.BufferAttribute(indexArr, 1));

    geometry.computeBoundingSphere();
    return geometry;
}
