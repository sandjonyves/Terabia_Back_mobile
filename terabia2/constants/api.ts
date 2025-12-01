import { Platform } from 'react-native';

const ANDROID_EMULATOR = '192.168.0.109';
const ANDROID_PHYSICAL_DEVICE = '192.168.0.109'; // ← ton IP actuelle
const IOS = 'localhost';

const host = 
  Platform.OS === 'android'
    ? (process.env.ANDROID_EMULATOR ? ANDROID_EMULATOR : ANDROID_PHYSICAL_DEVICE) // tu pourras switcher facilement
    : IOS;

export const API_BASE_URL = "http:192.168.0.109:3000/api"

// export const API_BASE_URL = __DEV__ 
//   ? `http://${Platform.OS === 'android' ? '192.168.0.109' : 'localhost'}:3000/api`
//   : 'https://ton-api-prod.com/api';