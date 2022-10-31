# Sistemas de recomendación

### Grupo:
- Marcos Jesús Santana Ramos (alu0101033471)
- Carlos Pío Reyes (alu0101132945)
- Héctor Abreu Acosta (alu0101068855)

### Ejemplo de uso

Para usar el programa se debe ejecutar de la siguiente manera: 
```node "fichero.txt" Pearson 3 Simple``` si se quiere por terminal.
```node "fichero.txt" Pearson 3 Simple > resultado.txt``` si se quiere guardar la salida en un fichero.

- "fichero.txt": Fichero con la matriz a analizar.
- Pearson Coseno o Euclidea: Método para calcular la similitud.
- 3: Número de vecinos para el análisis.
- Simple o Media: Método de predicción.

A continuación se muestra un ejemplo de uso respecto al software desarrollado.

$ node dist/prueba2.js src/prueba1.txt Pearson 3 Simple
1. Metrica empleada: Pearson 

2. Metodo de prediccion:  Simple 

3. Número de vecinos: 3 

MATRIZ DE SIMILITUD
[0] => 1.000            0.853           0.707           0.000           -0.792
[1] => 0.853            1.000           0.468           0.490           -0.900
[2] => 0.707            0.468           1.000           -0.161          -0.467
[3] => 0.000            0.490           -0.161          1.000           -0.642
[4] => -0.792           -0.900          -0.467          -0.642          1.000

 Vecinos utilizados para calcular Usuario 0 -> Item 4
[ [ 4, -0.7921180343813393 ], [ 3, 0 ], [ 2, 0.7071067811865475 ] ]
Resultado de la prediccion: 0.472

MATRIZ DE RESULTADOS
[0] => 1.000            0.500           0.750           0.750           0.472
[1] => 0.500            0.000           0.250           0.500           0.500
[2] => 0.750            0.500           0.750           0.500           1.000
[3] => 0.500            0.500           0.000           1.000           0.750
[4] => 0.000            1.000           1.000           0.250           0.000

### Descripción de la implementación:

1. **Lectura de fichero y creacion de matriz.**
Se comienza con la lectura del fichero que contiene la matriz para formatearla y su posterior uso. Para realizar esto se lee el contenido del fichero modificado y se almacena en un vector de strings que posteriormnete se modificara y se almacenara en una matriz numérica.

```javascript
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
 ```
Después, se debe crear una matriz normalizada de valores independientemente del tipo de recomendacion (0 a 5, 1 a 5, 0 a 10).

Una vez hecho esto se crea la matriz de similitud con el mismo tamaño que la matriz normalizada y se almacena en un vector las filas que contienen valos no numericos (referenci al valor '-'). 
```javascript
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
```
2. **Métricas**

Para calcular la matriz de similitud se elige uno de los tres métodos que se pasan por argumentos y se recorre cada posición de la matriz de similitudes rellenando con los valores correspondientes según la métrica elegida.
```javascript
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
```

3. **Calculo de los vecinos**

Para calcular los vecinos se crea una funcion que recibe por parámetros la métrica empleada, el número de vecinos, el usuario del que se debe calcular sus vecinos, la posicion (item) que se quiere predecir, la matriz de similitud y la matriz normalizada.

Lo primero es ordenar la fila de la matriz de similitudes del usuario dependiendo de la metrica selecionada y obtener los vecinos que han valorado el item que se debe analizar.

Ua vez que se tienen los usuarios que han valorado el item i ordenamos en base a la similitud, se seleccionan en base al número de vecinos seleccionados y se devuelve un vector de tuplas vecino-similitud.

```javascript
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

    console.log(`\n Vecinos utilizados para calcular Usuario ${usuarioX} -> Item ${posCalcular}`);

    console.log(nVecinos);

    return nVecinos;

}
```

4. **Predicción**
5. 
Se debe implementar las formulas matemáticas de la predicción seleccionada y rellenar la matriz Resultado con los valores obtenidos.

Ejemplo predicción Simple:
```javascript
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
```
Rellenar la matriz final:
```javascript
let valorVecinos;
        let vecinos = Number(process.argv[4]);
        vectorNaN.forEach(i => {
            for (let j = 0; j < matrizResultado[i].length; j++) {
                if (isNaN(matrizResultado[i][j])) {
                    valorVecinos = calcularVecinos(metrica, vecinos, i, j, matrizSimilitud, vectorNorm);
                    if (prediccion == "Simple") {
                        let pred = prediccionSimple(j, valorVecinos, vectorNorm);
                        matrizResultado[i][j] = pred;
                        console.log(`Resultado de la prediccion: ${pred.toFixed(3)}`);
                    }
                    else if (prediccion == "Media") {
                        let pred = prediccionDifMedia(i, j, valorVecinos, vectorNorm);
                        matrizResultado[i][j] = pred;
                        console.log(`\nResultado prediccion - Usuario ${i}  -> Item  ${j}  = ${pred} \n`);
                    }
                }
            }
        });
   ```
