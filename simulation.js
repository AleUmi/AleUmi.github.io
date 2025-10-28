document.addEventListener("DOMContentLoaded", () => {
    
    // Riferimenti agli elementi HTML
    const runButton = document.getElementById("runButton");
    const probP_input = document.getElementById("probP");
    const trialsN_input = document.getElementById("trialsN");
    const trajectoriesM_input = document.getElementById("trajectoriesM");
    
    const trajCtx = document.getElementById("trajectoryChart").getContext("2d");
    const histCtx = document.getElementById("histogramChart").getContext("2d");

    // Variabili per conservare i grafici
    let trajectoryChart;
    let histogramChart;

    // Aggiunge un "ascoltatore" al bottone
    runButton.addEventListener("click", runSimulation);

    function runSimulation() {
        
        // 1. Legge i valori di input e li valida
        const p = parseFloat(probP_input.value);
        const n = parseInt(trialsN_input.value);
        const m = parseInt(trajectoriesM_input.value);

        // Validazione di base
        if (isNaN(p) || isNaN(n) || isNaN(m) || n <= 0 || m <= 0 || p < 0 || p > 1) {
            alert("Per favore, inserisci valori validi:\n - p: (0.0 - 1.0)\n - n: > 0\n - m: > 0");
            return; // Interrompe la funzione se i dati non sono validi
        }

        // 2. Prepara le strutture dati
        const labels = Array.from({ length: n }, (_, i) => i + 1); 
        const trajectoryDatasets = []; 
        const finalFrequencies = [];   

        // 3. Esegue la simulazione 'm' volte
        for (let i = 0; i < m; i++) {
            const trajectoryData = []; 
            let successCount = 0;

            for (let j = 1; j <= n; j++) {
                if (Math.random() < p) {
                    successCount++;
                }
                const relativeFrequency = successCount / j;
                trajectoryData.push(relativeFrequency);
            }

            trajectoryDatasets.push({
                label: `Traiettoria ${i + 1}`,
                data: trajectoryData,
                borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`,
                borderWidth: 1,
                pointRadius: 0, 
                fill: false
            });

            finalFrequencies.push(trajectoryData[trajectoryData.length - 1]);
        }

        // 4. Aggiunge la linea della probabilità teorica 'p'
        trajectoryDatasets.push({
            label: `Probabilità p = ${p}`,
            data: Array(n).fill(p), 
            borderColor: 'red',
            borderWidth: 3,
            pointRadius: 0,
            fill: false
        });

        // 5. Disegna il grafico delle traiettorie
        if (trajectoryChart) {
            trajectoryChart.destroy();
        }
        trajectoryChart = new Chart(trajCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: trajectoryDatasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false },
                    title: {
                        display: true,
                        text: `Convergenza di ${m} traiettorie (n=${n})`
                    }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Numero di prove (n)' }
                    },
                    y: {
                        title: { display: true, text: 'Frequenza Relativa f(n)' },
                        min: 0,
                        max: 1
                    }
                },
                animation: {
                    duration: 0 
                }
            }
        });

        // 6. Prepara i dati per l'istogramma
        const histData = buildHistogramData(finalFrequencies, p);

        // 7. Disegna l'istogramma
        if (histogramChart) {
            histogramChart.destroy();
        }
        histogramChart = new Chart(histCtx, {
            type: 'bar', // Tipo grafico a barre standard
            data: {
                labels: histData.labels,
                datasets: [{
                    label: 'Distribuzione di f(n) (valori finali)',
                    data: histData.counts,
                    backgroundColor: 'rgba(0, 123, 255, 0.7)'
                }]
            },
            options: {
                // Rimosso 'indexAxis: y' per avere un istogramma verticale
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Distribuzione f(n)'
                    }
                },
                scales: {
                    // *** ASSI INVERTITI PER IL GRAFICO VERTICALE ***
                    x: {
                        title: { display: true, text: 'Valore f(n)' },
                        ticks: {
                           autoSkip: true,
                           maxRotation: 45, // Ruota le etichette se sono troppe
                           minRotation: 0
                        }
                    },
                    y: {
                        title: { display: true, text: 'Conteggio (su m)' }
                    }
                }
            }
        });
    }

    /**
     * Funzione helper per raggruppare i dati finali in "bin" (categorie)
     * per l'istogramma.
     */
    function buildHistogramData(data, p) {
        const binCount = 20; 
        
        const min = Math.min(...data);
        const max = Math.max(...data);
        
        // Definiamo un range centrato sulla probabilità 'p'
        let range = Math.max(p - min, max - p) * 2.1;
        // Se il range è 0 (tutti i valori uguali), impostiamo un piccolo range di default
        if (range === 0) {
            range = 0.1;
        }

        const histMin = p - range / 2;
        const histMax = p + range / 2;
        
        let binSize = (histMax - histMin) / binCount;
        
        const bins = Array(binCount).fill(0);
        const labels = [];

        // *** CORREZIONE BUG: GESTIONE binSize = 0 ***
        if (binSize === 0) {
            // Caso speciale: tutti i valori sono identici (es. p=1 o p=0)
            binSize = 1; // Impostiamo un valore fittizio per evitare divisione per zero
            for (let i = 0; i < binCount; i++) {
                labels.push(''); // Etichette vuote
            }
            // Mettiamo tutti i conteggi in un unico bin
            const centerBin = Math.floor(binCount / 2);
            bins[centerBin] = data.length;
            labels[centerBin] = data[0].toFixed(3); // Etichetta solo il bin centrale
        } else {
            // Comportamento normale
            for (let i = 0; i < binCount; i++) {
                const binStart = histMin + i * binSize;
                const binEnd = binStart + binSize;
                // Etichette più leggibili
                labels.push(`${binStart.toFixed(3)}`);
            }

            data.forEach(value => {
                let binIndex = Math.floor((value - histMin) / binSize);
                
                if (binIndex < 0) binIndex = 0;
                if (binIndex >= binCount) binIndex = binCount - 1;
                
                bins[binIndex]++;
            });
        }

        return { labels, counts: bins };
    }

    // Esegue la simulazione una volta al caricamento
    runSimulation();
});