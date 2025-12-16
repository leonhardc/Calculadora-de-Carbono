// ui.js - Interações da interface
function populateCities() {
    const cities = getCities();
    const datalist = document.getElementById('cities-list');
    datalist.innerHTML = '';
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        datalist.appendChild(option);
    });
}

function showResults(distance, emission, transport) {
    const estimatedTime = estimateTravelTime(distance, transport);
    const resultsDiv = document.getElementById('results-content');
    resultsDiv.innerHTML = `
        <div class="result-item">
            <h3>📍 Detalhes da Viagem</h3>
            <p><strong>Origem:</strong> ${document.getElementById('origin').value}</p>
            <p><strong>Destino:</strong> ${document.getElementById('destination').value}</p>
            <p><strong>Distância percorrida:</strong> ${distance} km (aproximada em linha reta)</p>
            <p><strong>Tempo estimado:</strong> ${estimatedTime}</p>
            <p><strong>Modo de transporte:</strong> ${getTransportName(transport)}</p>
        </div>
        <div class="result-item">
            <h3>🌿 Emissão de CO2</h3>
            <p><strong>Emissão estimada:</strong> ${emission.toFixed(2)} kg de CO2</p>
            <p class="eco-tip">Dica: Considere usar transporte sustentável para reduzir emissões!</p>
        </div>
    `;
    const resultsSection = document.getElementById('results');
    resultsSection.classList.remove('hidden');
    resultsSection.removeAttribute('hidden');
    resultsSection.classList.add('visible');
}

function estimateTravelTime(distance, transport) {
    const speeds = {
        bicycle: 15, // km/h
        car: 80,
        bus: 60,
        truck: 50
    };
    const speed = speeds[transport] || 50;
    const hours = distance / speed;
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return h > 0 ? `${h}h ${m}min` : `${m}min`;
}

function getTransportName(transport) {
    const names = {
        bicycle: 'Bicicleta',
        car: 'Carro',
        bus: 'Ônibus',
        truck: 'Caminhão'
    };
    return names[transport] || transport;
}

function showComparison(distance) {
    const comparisonDiv = document.getElementById('comparison-content');
    const transports = ['bicycle', 'car', 'bus', 'truck'];
    let comparisonHTML = '<div class="result-item"><h3>🔄 Comparação de Emissões e Tempos por Transporte</h3><ul>';

    transports.forEach(transport => {
        const emission = calculateEmission(distance, transport);
        const time = estimateTravelTime(distance, transport);
        const name = getTransportName(transport);
        const emoji = getTransportEmoji(transport);
        comparisonHTML += `<li>${emoji} ${name}: ${emission.toFixed(2)} kg CO2, ~${time}</li>`;
    });

    comparisonHTML += '</ul></div>';
    comparisonDiv.innerHTML = comparisonHTML;

    const comparisonSection = document.getElementById('comparison');
    comparisonSection.classList.remove('hidden');
    comparisonSection.removeAttribute('hidden');
    comparisonSection.classList.add('visible');
}

function getTransportEmoji(transport) {
    const emojis = {
        bicycle: '🚲',
        car: '🚗',
        bus: '🚌',
        truck: '🚚'
    };
    return emojis[transport] || '❓';
}

let originalBtnText = '';

function showSpinner() {
    const btn = document.getElementById('calculate-btn');
    originalBtnText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Calculando...';
    
    const spinner = document.createElement('div');
    spinner.id = 'loading-spinner';
    spinner.className = 'spinner';
    btn.appendChild(spinner);
}

function hideSpinner() {
    const btn = document.getElementById('calculate-btn');
    const spinner = document.getElementById('loading-spinner');
    if (spinner) spinner.remove();
    btn.disabled = false;
    btn.textContent = originalBtnText;
}

// Carbon credits UI
function showCarbonCredits(emissionKg) {
    const credits = emissionKg / config.carbonCredits.kgPerCredit;
    // Load price override if present
    const storedPrice = localStorage.getItem('carbonPriceBRL');
    if (storedPrice) {
        const parsed = parseFloat(storedPrice);
        if (!isNaN(parsed)) config.carbonCredits.pricePerCredit = parsed;
    }

    const cost = credits * config.carbonCredits.pricePerCredit;
    const costFormatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: config.carbonCredits.currency }).format(cost);

    const ccDiv = document.getElementById('carbon-credits-content');
    ccDiv.innerHTML = `
        <div class="result-item">
            <h3>💠 Créditos de Carbono</h3>
            <p><strong>Créditos necessários:</strong> ${credits.toFixed(3)} créditos (≈ ${emissionKg.toFixed(2)} kg CO₂)</p>
            <p><strong>Custo estimado:</strong> ${costFormatted}</p>
            <p><strong>O que são créditos de carbono?</strong> ${config.carbonCredits.explanation}</p>
            <div class="form-group" style="margin-top: var(--spacing-md);">
                <label for="carbon-price">Preço por crédito (BRL):</label>
                <input type="number" id="carbon-price" min="0" step="0.01" value="${config.carbonCredits.pricePerCredit}" />
                <small class="helper-text">Altere para simular diferentes custos de compensação.</small>
            </div>
        </div>
    `;

    const ccSection = document.getElementById('carbon-credits');
    ccSection.classList.remove('hidden');
    ccSection.removeAttribute('hidden');
    ccSection.classList.add('visible');

    // Bind change handler to override price
    const priceInput = document.getElementById('carbon-price');
    if (priceInput) {
        priceInput.addEventListener('change', () => {
            const newPrice = parseFloat(priceInput.value);
            if (!isNaN(newPrice) && newPrice >= 0) {
                localStorage.setItem('carbonPriceBRL', String(newPrice));
                config.carbonCredits.pricePerCredit = newPrice;
                // Re-render with updated price
                showCarbonCredits(emissionKg);
            }
        });
    }
}