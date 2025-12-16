// routes-data.js - Dados de rotas e cidades
let cities = [];

// Função para buscar todas as cidades do Brasil via API IBGE
async function loadCities() {
    try {
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios');
        const data = await response.json();
        cities = data.map(municipio => {
            const uf = municipio.microrregiao?.mesorregiao?.UF?.sigla || 'BR';
            return `${municipio.nome} - ${uf}`;
        });
        console.log(`${cities.length} cidades carregadas.`);
    } catch (error) {
        console.error('Erro ao carregar cidades:', error);
        // Fallback para lista pequena
        cities = [
            'São Paulo - SP', 'Rio de Janeiro - RJ', 'Belo Horizonte - MG', 'Salvador - BA', 'Brasília - DF',
            'Curitiba - PR', 'Porto Alegre - RS', 'Recife - PE', 'Fortaleza - CE', 'Manaus - AM',
            'Belém - PA', 'Goiânia - GO', 'Guarulhos - SP', 'Campinas - SP', 'São Luís - MA'
        ];
    }
}

// Função para obter cidades (chame loadCities primeiro)
function getCities() {
    return cities;
}