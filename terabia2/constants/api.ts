import { Platform } from 'react-native';

const ANDROID_EMULATOR = '10.0.2.2';
const ANDROID_PHYSICAL_DEVICE = '192.168.0.110'; // ← ton IP actuelle
const IOS = 'localhost';

const host = 
  Platform.OS === 'android'
    ? (process.env.ANDROID_EMULATOR ? ANDROID_EMULATOR : ANDROID_PHYSICAL_DEVICE) // tu pourras switcher facilement
    : IOS;

export const API_BASE_URL = __DEV__ 
  ? `http://${Platform.OS === 'android' ? '192.168.0.110' : 'localhost'}:3000/api`
  : 'https://ton-api-prod.com/api';