const inputClp = document.getElementById('inputClp');
const inputConvertir = document.getElementById('inputConvertir');
const btnConvertir = document.getElementById('btnConvertir');
const resultadoConversion = document.getElementById('resultadoConversion');

btnConvertir.addEventListener('click', function() {
    const montoCLP = parseFloat(inputClp.value);
    const monedaConvertir = inputConvertir.value;

    if (!isNaN(montoCLP)) {
        try {
            fetch('https://mindicador.cl/api')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error en la respuesta de la API');
                    }
                    return response.json();
                })
                .then(data => {
                    let resultado;
                    if (monedaConvertir === 'euroCoin') {
                        resultado = montoCLP / data.euro.valor;
                    } else if (monedaConvertir === 'bitcoinCoin') {
                        resultado = montoCLP / data.bitcoin.valor;
                    } else if (monedaConvertir === 'dolarCoin') {
                        resultado = montoCLP / data.dolar.valor;
                    } else {
                        resultado = 'Seleccione una moneda válida';
                    }

                    if (typeof resultado === 'number') {
                        resultadoConversion.textContent = `Resultado: ${resultado.toFixed(2)} pesos `;
                    } else {
                        resultadoConversion.textContent = resultado;
                    }
                })
                .catch(error => {
                    console.log('Error:', error);
                    resultadoConversion.textContent = 'Hubo un error al obtener los datos de conversión: ' + error.message;
                });
        } catch (error) {
            console.log('Error:', error);
            resultadoConversion.textContent = 'Hubo un error al obtener los datos de conversión: ' + error.message;
        }
    } else {
        resultadoConversion.textContent = 'Ingrese un monto válido';
        
    }

    inputClp.value = '';
    inputConvertir.value = '';
});
