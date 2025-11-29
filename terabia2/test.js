import api from "./lib/api";
// console.log(api);

export const testConnection = async () => {
  try {
    console.log('TEST DE CONNEXION EN COURS...');
    const response = await api.get('/'); // ou '/api/test' ou '/' si tu as une route racine
    console.log('Connexion OK !', response.data);
  } catch (err) {
    console.log('Échec du test de connexion → voir logs ci-dessus');
  }
};

testConnection();