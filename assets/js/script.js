const inputClp = document.getElementById('inputClp');
const inputConvertir = document.getElementById('inputConvertir');
const btnConvertir = document.getElementById('btnConvertir');
const resultadoConversion = document.getElementById('resultadoConversion');
const graficaIndicador = document.getElementById('graficaIndicador');

btnConvertir.addEventListener('click', function() {
    const montoCLP = parseFloat(inputClp.value);
    const monedaConvertir = inputConvertir.value;

    if (!isNaN(montoCLP)) {
        try {
            fetch('https://mindicador.cl/api/dolar')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error en la respuesta de la API');
                    }
                    return response.json();
                })
                .then(data => {
                    let resultado;
                    if (monedaConvertir === 'euroCoin') {
                        resultado = montoCLP / data.serie[0].valor;
                    } else if (monedaConvertir === 'bitcoinCoin') {
                        resultado = montoCLP / data.serie[0].valorBitcoin;
                    } else if (monedaConvertir === 'dolarCoin') {
                        resultado = montoCLP;
                    } else {
                        resultado = 'Seleccione una moneda válida';
                    }

                    if (typeof resultado === 'number') {
                        resultadoConversion.textContent = `Resultado: ${resultado.toFixed(2)} pesos `;
                    } else {
                        resultadoConversion.textContent = resultado;
                    }

                    // Generar gráfico con Chart.js
                    const labels = [];
                    const values = [];

                    data.serie.forEach(entry => {
                        labels.push(entry.fecha);
                        values.push(entry.valor);
                    });

                    const ctx = graficaIndicador.getContext('2d');
                    const chart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: 'Valor del dólar',
                                data: values,
                                backgroundColor: 'rgba(0, 128, 0, 0.5)',
                                borderColor: 'blue',
                                fill: false
                            }]
                        },
                        options: {
                            responsive: true,
                            scales: {
                                x: {
                                    display: true,
                                    title: 'Fecha'
                                },
                                y: {
                                    display: true,
                                    title: 'Valor'
                                }
                            }
                        }
                    });
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
