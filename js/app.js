// app.js - Aplicação principal
document.addEventListener('DOMContentLoaded', async () => {
    await loadCities();
    populateCities();

    const form = document.getElementById('calculador-form');
    const manualCheckbox = document.getElementById('manual-distance');

    function toggleManualDistance() {
        const distanceInput = document.getElementById('distance');
        distanceInput.readOnly = !manualCheckbox.checked;
    }

    manualCheckbox.addEventListener('change', toggleManualDistance);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        showSpinner();

        try {
            const origin = document.getElementById('origin').value;
            const destination = document.getElementById('destination').value;
            const transport = document.querySelector('input[name="transport"]:checked')?.value;

            if (!transport) {
                showError('Selecione um modo de transporte.');
                hideSpinner();
                return;
            }

            let distance;

            if (manualCheckbox.checked) {
                distance = parseFloat(document.getElementById('distance').value);
                if (isNaN(distance)) {
                    showError('Por favor, insira uma distância válida.');
                    hideSpinner();
                    return;
                }
            } else {
                distance = await calculateDistance(origin, destination);
                document.getElementById('distance').value = distance;
            }

            const emission = calculateEmission(distance, transport);
            showResults(distance, emission, transport);
            showComparison(distance);
            showCarbonCredits(emission);
        } catch (error) {
            showError('Erro ao calcular: ' + error.message);
        } finally {
            hideSpinner();
        }
    });
});