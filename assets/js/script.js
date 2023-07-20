const inputClp = document.getElementById('inputClp');
const inputConvertir = document.getElementById('inputConvertir');
const btnConvertir = document.getElementById('btnConvertir');
const resultadoConversion = document.getElementById('resultadoConversion');
const graficaIndicador = document.getElementById('graficaIndicador');
let chart;

btnConvertir.addEventListener('click', function() {
    const montoCLP = parseFloat(inputClp.value);
    const monedaConvertir = inputConvertir.value;

    if (isNaN(montoCLP)) {
        resultadoConversion.textContent = 'Ingrese un monto válido';
        return;
    }

    if (monedaConvertir === '') {
        resultadoConversion.textContent = 'Seleccione una moneda válida';
        return;
    }

    fetch(`https://mindicador.cl/api/${monedaConvertir}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }
            return response.json();
        })
        .then(data => {
            let resultado;
            let valorConversion;

            if (monedaConvertir === 'dolar') {
                valorConversion = 1;
            } else {
                valorConversion = data.serie[0].valor;
            }

            resultado = montoCLP / valorConversion;

            if (typeof resultado === 'number') {
                resultadoConversion.textContent = `Resultado: ${resultado.toFixed(2)} pesos `;
            } else {
                resultadoConversion.textContent = resultado;
            }

            // Eliminar el gráfico anterior si existe
            if (typeof chart !== 'undefined') {
                chart.destroy();
            }

            // Generar gráfico con Chart.js
            const labels = [];
            const values = [];

            data.serie.forEach(entry => {
                labels.push(entry.fecha);
                values.push(entry.valor);
            });

            const ctx = graficaIndicador.getContext('2d');
            chart = new Chart(ctx, {
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

    inputClp.value = '';
    inputConvertir.value = '';
});
