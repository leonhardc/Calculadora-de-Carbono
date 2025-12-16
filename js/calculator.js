// calculator.js - Funções de cálculo
// Função para calcular a distância entre duas cidades usando API
async function calculateDistance(origin, destination) {
    // Extrair nome da cidade (remover UF)
    const originCity = origin.split(' - ')[0];
    const destCity = destination.split(' - ')[0];

    try {
        // Geocodificar origem
        const originResponse = await fetch(`${config.api.nominatim}${encodeURIComponent(originCity + ', Brazil')}`);
        const originData = await originResponse.json();
        if (!originData.length) throw new Error('Cidade de origem não encontrada');

        const originLat = parseFloat(originData[0].lat);
        const originLon = parseFloat(originData[0].lon);

        // Geocodificar destino
        const destResponse = await fetch(`${config.api.nominatim}${encodeURIComponent(destCity + ', Brazil')}`);
        const destData = await destResponse.json();
        if (!destData.length) throw new Error('Cidade de destino não encontrada');

        const destLat = parseFloat(destData[0].lat);
        const destLon = parseFloat(destData[0].lon);

        // Calcular distância usando fórmula de Haversine
        const distance = haversineDistance(originLat, originLon, destLat, destLon);
        return Math.round(distance); // em km
    } catch (error) {
        console.error('Erro ao calcular distância:', error);
        throw error;
    }
}

// Fórmula de Haversine para calcular distância entre dois pontos na Terra
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// Função para calcular emissão de CO2
function calculateEmission(distance, transport) {
    const factor = config.emissions[transport];
    return distance * factor;
}