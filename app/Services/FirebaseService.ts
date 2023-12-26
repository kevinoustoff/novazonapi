import Env from '@ioc:Adonis/Core/Env'
import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore'; 

export default class FirebaseService{

    constructor(){
        
    }


    static connector(){

        const firebaseConfig = {
            apiKey: Env.get('FIREBASE_KEY'),
            projectId: Env.get('FIREBASE_PROJECT_ID'),
            storageBucket: Env.get('FIREBASE_STORAGE_BUCKET'),
            appId: Env.get('FIREBASE_APP_ID')
          };
          
          const firebaseApp = initializeApp(firebaseConfig);
          
          const db = getFirestore(firebaseApp);
          
        return db
    }

}