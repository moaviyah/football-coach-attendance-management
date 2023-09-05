import { initializeApp } from 'firebase/app';
import {initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyBxd0EFDe8_eZrP88kE5GknIouST25Ma_s",
    authDomain: "footylink-aec3d.firebaseapp.com",
    projectId: "footylink-aec3d",
    storageBucket: "footylink-aec3d.appspot.com",
    messagingSenderId: "344969260245",
    appId: "1:344969260245:web:d35384df06a42ebeba065c"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
})
export default {app, auth};
