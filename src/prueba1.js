"use strict";
exports.__esModule = true;
var fs = require("fs");
var fileName = 'src/prueba1.txt';
var fileContent = fs.readFileSync(fileName, 'utf8');
var vectorFichero = fileContent.split('\n');
var filaString;
console.log(vectorFichero);
var vectorString = [];
// RELLENA UN VECTOR DE STRINGS DEL FICHERO
for (var i = 0; i < vectorFichero.length; i++) {
    filaString = vectorFichero[i].split(' ');
    vectorString[i] = filaString;
}
console.log(vectorFichero.length);
console.log(vectorString[1].length);
var media = 0;
var vector_num = [];
var vector_num2 = [];
//vector_num.length = vector.length;
//vector_num[0][0]= 2;
// RELLENA UN VECTOR PASADO A NUMEROS DEL VECTOR DE STRINGS
for (var i = 0; i < vectorString.length; i++) {
    var fila = [];
    for (var j = 0; j < vectorString[i].length; j++) {
        if (vectorString[i][j] == '-') {
            vectorString[i][j] = '-';
        }
        if (vectorString[i][j] == '') {
            break;
        }
        fila[j] = (Number(vectorString[i][j]));
    }
    vector_num.push(fila);
    vector_num2.push(fila);
}
var vectorNorm = [];
console.log(vector_num);
//método para saber el mayor numero y el menor de la matriz
var numMax = -99999999;
var numMin = 100000000;
var vectorOrd = vector_num;
/*for(let i = 0; i < vectorOrd.length; i++){
    let fila: number[] = [];
    fila = vectorOrd[i].sort();
    if(vectorOrd[i][0] < numMin){
    numMin = vectorOrd[i][0];
    }
    for(let k = vectorOrd[i].length-1; k >= 0; k--){
        if(isNaN(vectorOrd[i][k])){
            console.log(`pouta`);
        } else {
            if(vectorOrd[i][k] > numMax){
                numMax = vectorOrd[i][k];
                }
                break;
        }
    }
}*/
for (var i = 0; i < vectorOrd.length; i++) {
    for (var j = 0; j < vectorOrd[i].length; j++) {
        if (vectorOrd[i][j] < numMin) {
            numMin = vectorOrd[i][j];
        }
        if (vectorOrd[i][j] > numMax) {
            numMax = vectorOrd[i][j];
        }
    }
}
console.log("valor minimo", numMin);
console.log("valor maximo", numMax);
//MATRIZ NORMALIZADA
for (var i = 0; i < vector_num.length; i++) {
    var fila = [];
    var numb = 0;
    for (var j = 0; j < vector_num[i].length; j++) {
        numb = vector_num[i][j] - numMin;
        numb = numb / numMax;
        fila[j] = numb;
    }
    vectorNorm.push(fila);
}
console.log(vectorNorm);
