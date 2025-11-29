// src/services/api.ts
import { API_BASE_URL } from '../constants/api';
import axios from 'axios';
import { Platform } from 'react-native';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 secondes max (très utile pour voir les timeouts)
});

// LOG #1 : Afficher l'URL exacte utilisée au démarrage
console.log('API_BASE_URL configurée →', API_BASE_URL);
console.log('Plateforme détectée →', Platform.OS);
console.log('Environnement →', __DEV__ ? 'DEVELOPPEMENT' : 'PRODUCTION');

// Intercepteur de requête → on voit TOUT ce qui part
api.interceptors.request.use(
  (config) => {
    console.log('REQUÊTE ENVOYÉE →');
    console.log('   Méthode :', config.method?.toUpperCase());
    console.log('   URL complète :', config.baseURL + config.url);
    console.log('   Headers Authorization :', config.headers.Authorization ? 'Présent' : 'Absent');
    console.log('   Données envoyées :', config.data);
    console.log('------------------------------------------------');

    return config;
  },
  (error) => {
    console.error('ERREUR AVANT ENVOI de la requête →', error);
    return Promise.reject(error);
  }
);

// Intercepteur de réponse → on voit le succès OU l’échec précis
api.interceptors.response.use(
  (response) => {
    console.log('RÉPONSE REÇUE →', response.status, response.config.url);
    console.log('   Données reçues :', response.data);
    console.log('====================================================');
    return response;
  },
  (error) => {
    console.error('ERREUR RÉSEAU / SERVEUR →');

    if (error.code === 'ECONNABORTED') {
      console.error('Timeout ! Le serveur n’a pas répondu en 10 secondes');
    }

    if (error.response) {
      // Le serveur a répondu avec un code d'erreur (404, 500, etc.)
      console.error('Status HTTP :', error.response.status);
      console.error('Données d’erreur du serveur :', error.response.data);
    } else if (error.request) {
      // Pas de réponse du tout → problème de connexion
      console.error('AUCUNE RÉPONSE du serveur (Network Error)');
      console.error('   URL tentée :', error.config?.baseURL + error.config?.url);
      console.error('   Cela signifie généralement :');
      console.error('   → Mauvaise IP / port');
      console.error('   → Serveur non démarré ou n’écoute pas sur 0.0.0.0');
      console.error('   → Pare-feu / antivirus bloque le port 3000');
    } else {
      console.error('Erreur inconnue :', error.message);
    }

    console.error('====================================================');
    return Promise.reject(error);
  }
);

export default api;