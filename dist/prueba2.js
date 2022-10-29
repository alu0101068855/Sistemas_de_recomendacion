"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
// Distancia Euclidea
function distanciaEuclidea(usuarioU, usuarioV, vectorNorm) {
    let resultado = 0;
    for (let i = 0; i < vectorNorm[usuarioU].length; i++) {
        if (!isNaN(vectorNorm[usuarioU][i]) && !isNaN(vectorNorm[usuarioV][i])) {
            resultado = resultado + Math.pow((vectorNorm[usuarioU][i] - vectorNorm[usuarioV][i]), 2);
        }
        resultado = Math.sqrt(resultado);
        return resultado;
    }
}
//Coseno 
function coseno(usuarioU, usuarioV, vectorNorm) {
    let numerador = 0;
    let denominadorIzq = 0;
    let denominadorDrch = 0;
    for (let i = 0; i < vectorNorm[usuarioU].length; i++) {
        if (!isNaN(vectorNorm[usuarioU][i]) && !isNaN(vectorNorm[usuarioV][i])) {
            numerador = numerador + vectorNorm[usuarioU][i] * vectorNorm[usuarioV][i];
            denominadorIzq = denominadorIzq + (Math.pow(vectorNorm[usuarioU][i], 2));
            denominadorDrch = denominadorDrch + (Math.pow(vectorNorm[usuarioV][i], 2));
        }
    }
    let resultado = (numerador / (Math.sqrt(denominadorIzq) * Math.sqrt(denominadorDrch)));
    return resultado;
}
//FOR PARA REALIZAR LA PARTE DE ARRIBA DEL COEfICIENTE DE PEARSON
function pearson(usuarioU, usuarioV, vectorNorm) {
    let vectorUsuarioU = [];
    let vectorUsuarioV = [];
    valoresComunes(usuarioU, usuarioV, vectorUsuarioU, vectorUsuarioV, vectorNorm);
    let mediaUsuarioU = media(vectorUsuarioU);
    let mediaUsuarioV = media(vectorUsuarioV);
    let numerador = 0;
    let denominadorIzq = 0;
    let denominadorDrch = 0;
    for (let i = 0; i < vectorNorm[usuarioU].length; i++) {
        if (!isNaN(vectorNorm[usuarioU][i]) && !isNaN(vectorNorm[usuarioV][i])) {
            numerador = numerador + ((vectorNorm[usuarioU][i] - mediaUsuarioU) * (vectorNorm[usuarioV][i] - mediaUsuarioV));
            denominadorIzq = denominadorIzq + (Math.pow(vectorNorm[usuarioU][i] - mediaUsuarioU, 2));
            denominadorDrch = denominadorDrch + (Math.pow(vectorNorm[usuarioV][i] - mediaUsuarioV, 2));
        }
    }
    let resultado = (numerador / (Math.sqrt(denominadorIzq) * Math.sqrt(denominadorDrch)));
    return resultado;
}
function calcularSimilitud(metrica, matrizSimilitud, vectorNorm) {
    if (metrica == 'Pearson' || metrica == 'pearson') {
        for (let i = 0; i < vectorNorm.length; i++) {
            for (let j = 0; j < vectorNorm[i].length; j++) {
                matrizSimilitud[i][j] = pearson(i, j, vectorNorm);
            }
        }
    }
    else if (metrica == 'Coseno' || metrica == 'coseno') {
        for (let i = 0; i < vectorNorm.length; i++) {
            for (let j = 0; j < vectorNorm[i].length; j++) {
                matrizSimilitud[i][j] = coseno(i, j, vectorNorm);
            }
        }
    }
    else if (metrica == 'Euclidea' || metrica == 'euclidea') {
        for (let i = 0; i < vectorNorm.length; i++) {
            for (let j = 0; j < vectorNorm[i].length; j++) {
                matrizSimilitud[i][j] = distanciaEuclidea(i, j, vectorNorm);
            }
        }
    }
    else {
        console.error('El valor introducido para calcular la metrica es incorrecto');
        console.log('Funcionamiento del programa: node dist/filtrado.js src/nombreArchivo metrica numero_vecinos prediccion');
    }
    return matrizSimilitud;
}
//Prediccion simple 
function prediccionSimple(posicion, nVecinos, vectorNorm) {
    let numerador = 0;
    let denominador = 0;
    nVecinos.forEach(i => {
        numerador = numerador + (i[1] * vectorNorm[i[0]][posicion]);
        denominador = denominador + Math.abs(i[1]);
    });
    let resultado = numerador / denominador;
    if (resultado < 0) {
        resultado = 0;
    }
    if (resultado > 1) {
        resultado = 1;
    }
    let resultadoString = resultado.toFixed(4);
    return Number(resultadoString);
}
//Calcular item comunes que los usuarios u y v han votado
function valoresComunes(usuarioU, usuarioV, vectorUsuarioU, vectorUsuarioV, vectorNorm) {
    for (let i = 0; i < vectorNorm[usuarioU].length; i++) {
        if (!isNaN(vectorNorm[usuarioU][i]) && !isNaN(vectorNorm[usuarioV][i])) {
            vectorUsuarioU[i] = vectorNorm[usuarioU][i];
            vectorUsuarioV[i] = vectorNorm[usuarioV][i];
        }
    }
    return;
}
// Prediccion diferencias de media
function prediccionDifMedia(usuario, posicion, nVecinos, vectorNorm) {
    let mediaUsuario = media(vectorNorm[usuario]);
    let medias = [];
    nVecinos.forEach(i => {
        medias.push(media(vectorNorm[i[0]]));
    });
    let numerador = 0;
    let denominador = 0;
    nVecinos.forEach(i => {
        numerador = numerador + (i[1] * (vectorNorm[i[0]][posicion] - media(vectorNorm[i[0]])));
        denominador = denominador + Math.abs(i[1]);
    });
    let resultado = mediaUsuario + (numerador / denominador);
    if (resultado < 0) {
        resultado = 0;
    }
    if (resultado > 1) {
        resultado = 1;
    }
    let resultadoString = resultado.toFixed(4);
    return Number(resultadoString);
}
//Calcular vecinos
function calcularVecinos(metrica, vecinos, usuarioX, posCalcular, matrizSimilitud, vectorNorm) {
    let nVecinos = [];
    let filaUsuarioOrdenar = [];
    for (let i = 0; i < matrizSimilitud[usuarioX].length; i++) {
        filaUsuarioOrdenar.push(matrizSimilitud[usuarioX][i]);
    }
    if (metrica == 'Pearson' || metrica == 'Coseno') {
        filaUsuarioOrdenar.sort((n1, n2) => n1 - n2);
    }
    else {
        filaUsuarioOrdenar.sort((n1, n2) => n2 - n1);
    }
    let filaUsuarioLimpia = JSON.parse(JSON.stringify(matrizSimilitud[usuarioX]));
    let filaUsuarioLimpia2 = JSON.parse(JSON.stringify(filaUsuarioLimpia));
    let vecinosCoincidentes = [];
    let usuario = 0;
    filaUsuarioOrdenar.forEach(i => {
        usuario = filaUsuarioLimpia2.indexOf(i);
        filaUsuarioLimpia2[usuario] = 0;
        if (!isNaN(vectorNorm[usuario][posCalcular])) {
            vecinosCoincidentes.push(usuario);
        }
    });
    let cantidadVecinos = vecinosCoincidentes.slice(0, vecinos);
    let valorSimilitud = 0;
    cantidadVecinos.forEach(i => {
        valorSimilitud = filaUsuarioLimpia[i];
        nVecinos.push([i, valorSimilitud]);
    });
    console.log(`Vecinos utilizados para calcular Usuario ${usuarioX} -> Item ${posCalcular}`);
    console.log(nVecinos);
    return nVecinos;
}
//MEdia
function media(valores) {
    let datos = [];
    for (let i = 0; i < valores.length; i++) {
        if (!isNaN(valores[i])) {
            datos.push(valores[i]);
        }
    }
    let suma = 0;
    for (let i = 0; i < datos.length; i++) {
        suma = suma + datos[i];
    }
    return suma / datos.length;
}
//FUNCION PRINCIPAL
let argumentos = process.argv.length;
function comprobar() {
    if (process.argv[2] == '-h' || process.argv[2] == '--help') {
        console.log('Funcionamiento del programa: node dist/filtrado.js src/nombreArchivo metrica numero_vecinos prediccion');
        return 2;
    }
    if (argumentos != 6) {
        console.error('Numero de parametros invalido');
        console.log('Funcionamiento del programa: node dist/filtrado.js src/nombreArchivo metrica numero_vecinos prediccion');
        return 2;
    }
    return 0;
}
if (comprobar() != 2) {
    const fileName = process.argv[2];
    if (!fs.existsSync(fileName)) {
        console.error("El archivo No EXISTE!");
    }
    else {
        let fileContent = fs.readFileSync(fileName, 'utf8');
        let vectorFichero = fileContent.split('\n');
        let filaString;
        let vectorString = [];
        // RELLENA UN VECTOR DE STRINGS DEL FICHERO
        for (let i = 0; i < vectorFichero.length; i++) {
            filaString = vectorFichero[i].split(' ');
            vectorString[i] = filaString;
        }
        let vector_num = [];
        let vector_num2 = [];
        // RELLENA UN VECTOR PASADO A NUMEROS DEL VECTOR DE STRINGS
        for (let i = 0; i < vectorString.length; i++) {
            let fila = [];
            for (let j = 0; j < vectorString[i].length; j++) {
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
        let vectorNorm = [];
        //método para saber el mayor numero y el menor de la matriz
        let numMax = -99999999;
        let numMin = 100000000;
        let vectorOrd = vector_num;
        for (let i = 0; i < vectorOrd.length; i++) {
            for (let j = 0; j < vectorOrd[i].length; j++) {
                if (vectorOrd[i][j] < numMin) {
                    numMin = vectorOrd[i][j];
                }
                if (vectorOrd[i][j] > numMax) {
                    numMax = vectorOrd[i][j];
                }
            }
        }
        // MATRIZ NORMALIZADA
        let vectorNaN = [];
        for (let i = 0; i < vector_num.length; i++) {
            let fila = [];
            let numb = 0;
            for (let j = 0; j < vector_num[i].length; j++) {
                if (isNaN(vector_num[i][j])) {
                    vectorNaN.push(i);
                }
                numb = vector_num[i][j] - numMin;
                numb = numb / (numMax - numMin);
                fila[j] = numb;
            }
            vectorNorm.push(fila);
        }
        let metrica = process.argv[3];
        let prediccion = process.argv[5];
        let matrizSimilitud = [];
        for (let i = 0; i < vectorNorm.length; i++) {
            let fila = [];
            for (let j = 0; j < vectorNorm[i].length; j++) {
                fila[j] = 0;
            }
            matrizSimilitud.push(fila);
        }
        calcularSimilitud(metrica, matrizSimilitud, vectorNorm);
        console.log('Matriz Similitud \n ', matrizSimilitud);
        let matrizResultado = [];
        for (let i = 0; i < vectorNorm.length; i++) {
            let fila = [];
            for (let j = 0; j < vectorNorm[i].length; j++) {
                fila[j] = vectorNorm[i][j];
            }
            matrizResultado.push(fila);
        }
        let valorVecinos;
        let vecinos = Number(process.argv[4]);
        vectorNaN.forEach(i => {
            for (let j = 0; j < matrizResultado[i].length; j++) {
                if (isNaN(matrizResultado[i][j])) {
                    valorVecinos = calcularVecinos(metrica, vecinos, i, j, matrizSimilitud, vectorNorm);
                    if (prediccion == "Simple") {
                        let pred = prediccionSimple(j, valorVecinos, vectorNorm);
                        matrizResultado[i][j] = pred;
                    }
                    else if (prediccion == "Media") {
                        let pred = prediccionDifMedia(i, j, valorVecinos, vectorNorm);
                        matrizResultado[i][j] = pred;
                    }
                }
            }
        });
        console.log('Matriz resultante de la predicción');
        console.log(matrizResultado);
    }
}
