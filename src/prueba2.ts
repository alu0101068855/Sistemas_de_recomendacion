import * as fs from 'fs';
import { exit } from 'process';


// Distancia Euclidea
function distanciaEuclidea(usuarioU: number, usuarioV: number, vectorNorm: number[][]){
  let resultado: number = 0;
  for(let i: number= 0; i < vectorNorm[usuarioU].length; i++){
    if(!isNaN(vectorNorm[usuarioU][i]) && !isNaN(vectorNorm[usuarioV][i])){
      resultado = resultado +  Math.pow((vectorNorm[usuarioU][i] - vectorNorm[usuarioV][i]), 2);
  }
  resultado = Math.sqrt(resultado);
  return resultado;
  }
} 

//Coseno 
function coseno(usuarioU: number, usuarioV: number, vectorNorm: number[][]){
  let numerador: number = 0;
  let denominadorIzq: number = 0;
  let denominadorDrch: number = 0;
  for(let i: number= 0; i < vectorNorm[usuarioU].length; i++){
    if(!isNaN(vectorNorm[usuarioU][i]) && !isNaN(vectorNorm[usuarioV][i])){
      numerador = numerador + vectorNorm[usuarioU][i] * vectorNorm[usuarioV][i]
      denominadorIzq = denominadorIzq + (Math.pow(vectorNorm[usuarioU][i],2));
      denominadorDrch = denominadorDrch + (Math.pow(vectorNorm[usuarioV][i],2));
    }
  }
  let resultado: number = (numerador / (Math.sqrt(denominadorIzq) * Math.sqrt(denominadorDrch)));
  return resultado;
}

//FOR PARA REALIZAR LA PARTE DE ARRIBA DEL COEfICIENTE DE PEARSON
function pearson(usuarioU: number, usuarioV: number, vectorNorm: number[][]){
  let vectorUsuarioU: number[] = [];
  let vectorUsuarioV: number[] = [];
  valoresComunes(usuarioU, usuarioV, vectorUsuarioU, vectorUsuarioV, vectorNorm);

  let mediaUsuarioU: number = media(vectorUsuarioU);
  let mediaUsuarioV: number =  media(vectorUsuarioV);

  let numerador: number = 0;
  let denominadorIzq: number = 0;
  let denominadorDrch: number = 0;
 
  
  for(let i: number= 0; i < vectorNorm[usuarioU].length; i++){
    if(!isNaN(vectorNorm[usuarioU][i]) && !isNaN(vectorNorm[usuarioV][i])){
      numerador= numerador + ((vectorNorm[usuarioU][i] - mediaUsuarioU) * (vectorNorm[usuarioV][i] - mediaUsuarioV));
      denominadorIzq = denominadorIzq + (Math.pow(vectorNorm[usuarioU][i] - mediaUsuarioU,2));
      denominadorDrch = denominadorDrch + (Math.pow(vectorNorm[usuarioV][i] - mediaUsuarioV,2));
    }
  }
  let resultado: number = (numerador / (Math.sqrt(denominadorIzq) * Math.sqrt(denominadorDrch)));
  return resultado;
}

function calcularSimilitud(metrica:string, matrizSimilitud: number [][], vectorNorm: number[][]){
  if (metrica == 'Pearson' || metrica == 'pearson'){
    for(let i: number= 0; i < vectorNorm.length; i++){
      for(let j: number = 0; j < vectorNorm[i].length; j++){
        matrizSimilitud[i][j] = pearson(i,j, vectorNorm);
      }
    }
  } 
  else if (metrica == 'Coseno' || metrica == 'coseno' ){
    for(let i: number= 0; i < vectorNorm.length; i++){
      for(let j: number = 0; j < vectorNorm[i].length; j++){
        matrizSimilitud[i][j] = coseno(i,j, vectorNorm);
      }
    }
  }
  else if (metrica == 'Euclidea' || metrica == 'euclidea' ){
    for(let i: number= 0; i < vectorNorm.length; i++){
      for(let j: number = 0; j < vectorNorm[i].length; j++){
        matrizSimilitud[i][j] = distanciaEuclidea(i,j, vectorNorm);
      }
    }
  }
  else {
    console.error('El valor introducido para calcular la metrica es incorrecto');
    console.log('Funcionamiento del programa: node dist/filtrado.js src/nombreArchivo metrica numero_vecinos prediccion')
  }
  return matrizSimilitud;
}
//Prediccion simple 
function prediccionSimple(posicion: number, nVecinos: [number, number][], vectorNorm: number[][]){
  let numerador: number = 0;
  let denominador: number = 0;

  nVecinos.forEach(i => {
    numerador = numerador + (i[1] * vectorNorm[i[0]][posicion])
    denominador = denominador + Math.abs(i[1]);
  });
  let resultado: number = numerador / denominador;
  if (resultado < 0){
    resultado = 0;
  } 
  if (resultado > 1){
    resultado = 1;
  }
  let resultadoString: string = resultado.toFixed(4);
  return Number(resultadoString);
}

//Calcular item comunes que los usuarios u y v han votado

function valoresComunes(usuarioU:number, usuarioV: number, vectorUsuarioU: number[], vectorUsuarioV: number[], vectorNorm: number[][]): {vectorUsuarioU: number[], vectorUsuarioV: number[]}{
  for(let i = 0; i < vectorNorm[usuarioU].length; i++){
    if(!isNaN(vectorNorm[usuarioU][i]) && !isNaN(vectorNorm[usuarioV][i])){
      vectorUsuarioU[i] = vectorNorm[usuarioU][i];
      vectorUsuarioV[i] = vectorNorm[usuarioV][i];
    }
  }
  return;
}

// Prediccion diferencias de media
function prediccionDifMedia(usuario: number, posicion: number, nVecinos: [number, number][], vectorNorm: number[][]){
  let mediaUsuario: number = media(vectorNorm[usuario]);
  let medias: number [] = [];
  nVecinos.forEach(i => {
    medias.push(media(vectorNorm[i[0]]));
  });
  let numerador: number = 0;
  let denominador: number = 0;
  nVecinos.forEach(i => {
    numerador = numerador + (i[1] * (vectorNorm[i[0]][posicion] - media(vectorNorm[i[0]])));
    denominador = denominador + Math.abs(i[1]);
  });
  let resultado: number = mediaUsuario + (numerador /denominador);
  if (resultado < 0){
    resultado = 0;
  } 
  if (resultado > 1){
    resultado = 1;
  }
  let resultadoString: string = resultado.toFixed(4);
  return Number(resultadoString);
}

//Calcular vecinos
function calcularVecinos(metrica: string, vecinos: number, usuarioX: number, posCalcular: number, matrizSimilitud: number[][], vectorNorm: number[][] ){
  let nVecinos: [number, number][] = [];
  let filaUsuarioOrdenar: number[] = [];
  for (let i : number = 0; i < matrizSimilitud[usuarioX].length; i++){
    filaUsuarioOrdenar.push(matrizSimilitud[usuarioX][i]);
  }
  if (metrica == 'Pearson' || metrica == 'Coseno'){
    filaUsuarioOrdenar.sort((n1,n2) => n1 - n2);
  } else {
    filaUsuarioOrdenar.sort((n1,n2) => n2 - n1);
  }
  let filaUsuarioLimpia: number[] = JSON.parse(JSON.stringify(matrizSimilitud[usuarioX]));
  let filaUsuarioLimpia2: number[] = JSON.parse(JSON.stringify(filaUsuarioLimpia));
  let vecinosCoincidentes: number [] = [];
  let usuario: number = 0;
  filaUsuarioOrdenar.forEach(i => {
    usuario = filaUsuarioLimpia2.indexOf(i);
    filaUsuarioLimpia2[usuario] = 0;
    if(!isNaN(vectorNorm[usuario][posCalcular])){
      vecinosCoincidentes.push(usuario);
    }
  });

  let cantidadVecinos: number[] = vecinosCoincidentes.slice(0,vecinos);

  let valorSimilitud: number = 0;
  cantidadVecinos.forEach(i => {
    valorSimilitud = filaUsuarioLimpia[i];
    nVecinos.push([i, valorSimilitud]);
    
  });
  console.log(`Vecinos utilizados para calcular Usuario ${usuarioX} -> Item ${posCalcular}`);
  console.log(nVecinos);
  return nVecinos;
}

//MEdia
function media(valores: number[]): number {
  let datos : number [] = [];
  for (let i : number = 0; i < valores.length; i++){
    if (!isNaN(valores[i])){
      datos.push(valores[i]);
    }
  }
  let suma: number = 0;
  for (let i : number = 0; i < datos.length; i++){
    suma = suma + datos[i];
  }
  return suma / datos.length;
}


















//FUNCION PRINCIPAL
let argumentos = process.argv.length;
function comprobar(){
  if(process.argv[2] == '-h' || process.argv[2] == '--help') {
    console.log('Funcionamiento del programa: node dist/filtrado.js src/nombreArchivo metrica numero_vecinos prediccion');
    return 2;
  }
  if(argumentos != 6) {
    console.error('Numero de parametros invalido');
    console.log('Funcionamiento del programa: node dist/filtrado.js src/nombreArchivo metrica numero_vecinos prediccion');
    return 2;
  }
  return 0;
}

if(comprobar() != 2){
  const fileName: string = process.argv[2];
  if(!fs.existsSync(fileName)){
    console.error("El archivo No EXISTE!");
  } else {
    let fileContent = fs.readFileSync(fileName, 'utf8');
    let vectorFichero = fileContent.split('\n');
    let filaString: string[];
    let vectorString: string[][] = [];
    // RELLENA UN VECTOR DE STRINGS DEL FICHERO
    for(let i = 0; i < vectorFichero.length; i++){
      filaString = vectorFichero[i].split(' ');
      vectorString[i] = filaString;
    }
    let vector_num: number[][] = [];
    let vector_num2: number[][] = [];
    // RELLENA UN VECTOR PASADO A NUMEROS DEL VECTOR DE STRINGS
    for(let i = 0; i < vectorString.length; i++){
      let fila: number[] = [];  
      for(let j = 0; j < vectorString[i].length; j++){
      if (vectorString[i][j] == '-'){
        vectorString[i][j] = '-';
      }
      if (vectorString[i][j] == ''){
        break;
      }
      fila[j] = (Number(vectorString[i][j])) ;
    }
        vector_num.push(fila);
      vector_num2.push(fila);

    }
    let vectorNorm: number [][] = [];
    //método para saber el mayor numero y el menor de la matriz
    let numMax: number = -99999999;
    let numMin: number = 100000000;
    let vectorOrd: number[][] = vector_num;
    for(let i = 0; i < vectorOrd.length; i++){
      for(let j = 0; j < vectorOrd[i].length; j++){
      if(vectorOrd[i][j] < numMin){
        numMin = vectorOrd[i][j];
      }
      if(vectorOrd[i][j] > numMax){
        numMax = vectorOrd[i][j];
      }
      }
    }

    // MATRIZ NORMALIZADA
    let vectorNaN: number[] = []
    for(let i = 0; i < vector_num.length; i++){
      let fila: number[] = [];
      let numb: number = 0;
      for(let j = 0; j < vector_num[i].length; j++){
        if(isNaN(vector_num[i][j])){
          vectorNaN.push(i);
        }
        numb = vector_num[i][j] - numMin;
        numb = numb / (numMax - numMin);
        fila[j] = numb;	 
      }
      vectorNorm.push(fila);
    }
    let metrica: string = process.argv[3];
    let prediccion: string = process.argv[5];
    let matrizSimilitud: number[][] = [];
    for(let i = 0; i < vectorNorm.length; i++){
      let fila: number[] = [];
      for(let j = 0; j < vectorNorm[i].length; j++){
        fila[j] = 0;   
      }
      matrizSimilitud.push(fila);
    }
  
    calcularSimilitud(metrica, matrizSimilitud, vectorNorm);
    console.log('Matriz Similitud \n ', matrizSimilitud);
  
    let matrizResultado: number [][] = [];
    for(let i = 0; i < vectorNorm.length; i++){
      let fila: number[] = [];
      for(let j = 0; j < vectorNorm[i].length; j++){
        fila[j] = vectorNorm[i][j];   
      }
      matrizResultado.push(fila);
    }
    let valorVecinos: [number, number][];
    let vecinos: number = Number(process.argv[4]);
    vectorNaN.forEach(i => {
      for(let j = 0; j < matrizResultado[i].length; j++){
        if (isNaN(matrizResultado[i][j])){
          valorVecinos = calcularVecinos(metrica, vecinos, i, j, matrizSimilitud, vectorNorm);
          if(prediccion == "Simple"){
            let pred: number = prediccionSimple(j, valorVecinos, vectorNorm);
            matrizResultado[i][j] = pred;
          } else if(prediccion == "Media"){
            let pred: number = prediccionDifMedia(i, j, valorVecinos, vectorNorm);
            matrizResultado[i][j] = pred;
          }
        }
      }
    });
    console.log('Matriz resultante de la predicción');
    console.log (matrizResultado);
  }  
}


