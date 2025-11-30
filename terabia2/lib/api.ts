// src/services/api.ts
import { API_BASE_URL } from '../constants/api';
import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // AJOUT CRUCIAL

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// LOGS (garde-les, ils sont parfaits)
console.log('API_BASE_URL configurée →', API_BASE_URL);
console.log('Plateforme détectée →', Platform.OS);

// INTERCEPTEUR QUI AJOUTE LE TOKEN (C'EST ÇA QUI MANQUAIT !!!)
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      // ou 'token', 'jwt', selon ce que tu as sauvegardé au login

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn("Impossible de lire le token depuis AsyncStorage", error);
    }

    // Tes logs existants (garde-les)
    console.log('REQUÊTE ENVOYÉE →');
    console.log('   Méthode :', config.method?.toUpperCase());
    console.log('   URL complète :', config.baseURL + config.url);
    console.log('   Headers Authorization :', config.headers.Authorization ? 'Présent' : 'Absent');
    console.log('   Données envoyées :', config.data);
    console.log('------------------------------------------------');

    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponse (garde tout, c'est parfait)
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
      console.error('Status HTTP :', error.response.status);
      console.error('Données d’erreur du serveur :', error.response.data);
    } else if (error.request) {
      console.error('AUCUNE RÉPONSE du serveur (Network Error)');
    } else {
      console.error('Erreur inconnue :', error.message);
    }
    console.error('====================================================');
    return Promise.reject(error);
  }
);

export default api;