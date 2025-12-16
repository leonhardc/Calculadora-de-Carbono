// config.js - Configurações da aplicação
const config = {
    api: {
        nominatim: 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q='
    },
    emissions: {
        car: 0.12, // kg CO2 per km
        bus: 0.08,
        bicycle: 0,
        truck: 0.25
    },
    carbonCredits: {
        kgPerCredit: 1000, // 1 crédito = 1 tonelada (1000 kg)
        pricePerCredit: 50, // preço estimado por crédito em BRL
        currency: 'BRL',
        explanation: 'Créditos de carbono são certificados que representam a redução de uma tonelada de CO2. Podem ser comprados para compensar emissões, financiando projetos de energia limpa, reflorestamento e eficiência energética.'
    }
};