import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './config';
import { getDatabase } from 'firebase/database';

export const firebaseApp = initializeApp(firebaseConfig);
export const rtDb = getDatabase(firebaseApp);
