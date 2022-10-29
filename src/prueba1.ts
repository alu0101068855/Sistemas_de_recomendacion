import * as fs from 'fs';
const fileName: string = process.argv[2];
let fileContent = fs.readFileSync(fileName, 'utf8');
let vectorFichero = fileContent.split('\n');
let filaString: string[];

console.log(vectorFichero);
let vectorString: string[][] = [];
// RELLENA UN VECTOR DE STRINGS DEL FICHERO
for(let i = 0; i < vectorFichero.length; i++){
	filaString = vectorFichero[i].split(' ');
	vectorString[i] = filaString;
	}
	

	console.log(vectorFichero.length);
console.log(vectorString[1].length);

let vector_num: number[][] = []; 
let vector_num2: number[][] = []; 

//vector_num.length = vector.length;
//vector_num[0][0]= 2;
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
console.log(vector_num);
//método para saber el mayor numero y el menor de la matriz

let numMax: number = -99999999;
let numMin: number = 100000000;
let vectorOrd: number[][] = vector_num;
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


console.log(`valor minimo`, numMin);
	console.log(`valor maximo`, numMax);
	 //MATRIZ NORMALIZADA
for(let i = 0; i < vector_num.length; i++){
	let fila: number[] = []; 
	let numb: number = 0; 
	for(let j = 0; j < vector_num[i].length; j++){
		numb = vector_num[i][j] - numMin;
		numb = numb / numMax;
		fila[j] = numb;
			
    }
    vectorNorm.push(fila);

}
export type Punto = {
	X: number,
	Y: number
  };
 
  let puntoNan: Punto = {
	X: 0,
	Y: 0,
  };
let contadorNAN: number = 0;
//Buscar el primer NAN
for(let i: number = 0; i < vectorNorm.length; i++){ 
	for(let j: number = 0; j < vectorNorm[i].length; j++){
		if(isNaN(vectorNorm[i][j])){
			puntoNan.X = i;
			puntoNan.Y = j;
			console.log('Punto NAN ', puntoNan);
		}
    }   
}

//calcular por cuanto se divide la media
let sumAux: number = 0;
let divAux: number = 0;
let media: number = 0;
let vectorMedia: number[] = [];
//FOR QUE CALCULA TODAS LAS MEDIAS Y LAS GUARDA EN VECTORMEDIA
for(let i: number= 0; i < vectorNorm.length; i++){
	for(let j: number = 0; j < vectorNorm[puntoNan.X].length; j++){
		if(isNaN(vectorNorm[i][j]) || j == puntoNan.Y){
		
		}
		else {
			sumAux = sumAux + vectorNorm[i][j];
			divAux++;
		}
	}
	media = sumAux / divAux;
	sumAux = 0;
	divAux = 0;
	vectorMedia.push(media);
	media= 0;

}
//FOR PARA REALIZAR LA PARTE DE ARRIBA DEL COEfICIENTE DE PEARSON
let valor1: number = 0;
let valor2: number = 0;
let valor3: number = 0;
let valor4: number = 0;
let valor5: number = 0;
let valor6: number = 0;
let valor7: number = 0;
let valores: number[] = [];
let valores2: number[] = [];
let valoresfinal: number[] = [];
for(let i: number= 0; i < vectorNorm.length-1; i++){
	for(let j: number = 0; j < vectorNorm[puntoNan.X].length; j++){
	if(isNaN(vectorNorm[puntoNan.X][j]) || isNaN(vectorNorm[puntoNan.X+1+i][j])){

	}
	else{
		valor1 = vectorNorm[puntoNan.X][j] - vectorMedia[puntoNan.X];
		valor4 = Math.pow(valor1, 2);
		console.log('valor ', vectorNorm[puntoNan.X][j], vectorMedia[puntoNan.X]);
		valor2 = vectorNorm[puntoNan.X+1+i][j] - vectorMedia[puntoNan.X+i+1];
		valor5 = Math.pow(valor2, 2);
		console.log('valr1: ', valor1, 'vlor2:', valor2);
		valor3 = valor3 +(valor1 * valor2);
		valor6 = valor6 + valor4;
		valor7 = valor7 + valor5;

		
	} 
}
	valores2[i] = Math.sqrt(valor6) * Math.sqrt(valor7);
	valores[i] = valor3;
	valoresfinal[i] = valores[i] /valores2[i];
	valor3 = 0;
	valor6 = 0;
	valor7 = 0;
}
console.log('valores ', valores);
console.log('valores2 ', valores2);
console.log('valoresFinal ', valoresfinal);
//media = sumAux / divAux;
console.log('media ', vectorMedia);	 
console.log(vectorNorm);
//Calcular Similitudes
function calcularSimilitud(método:string){

}
//FUNCION PRINCIPAL
let metrica: string = 'Pearson';
calcularSimilitud(metrica);