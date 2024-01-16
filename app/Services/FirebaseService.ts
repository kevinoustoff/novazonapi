import Env from '@ioc:Adonis/Core/Env';
import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
// import { getMessaging } from "firebase/messaging/sw";
import { getMessaging } from "firebase/messaging";
import admin from 'firebase-admin'

export default class FirebaseService {

  constructor() {
  }
  static generateRandomTopic() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
  
    // Generate 4 random letters
    const randomLetters = Array.from({ length: 4 }, () => letters[Math.floor(Math.random() * letters.length)]);
  
    // Generate 4 random numbers
    const randomNumbers1 = Array.from({ length: 4 }, () => numbers[Math.floor(Math.random() * numbers.length)]);
  
    // Generate another set of 4 random numbers
    const randomNumbers2 = Array.from({ length: 4 }, () => numbers[Math.floor(Math.random() * numbers.length)]);
  
    // Combine the generated characters
    const topicName = randomLetters.join('') + randomNumbers1.join('') + randomNumbers2.join('');
  
    return topicName;
  }
  

  static Params() {
    return {
      apiKey: Env.get('FIREBASE_KEY'),
      projectId: Env.get('FIREBASE_PROJECT_ID'),
      storageBucket: Env.get('FIREBASE_STORAGE_BUCKET'),
      appId: Env.get('FIREBASE_APP_ID'),
      messagingSenderId: Env.get('FIREBASE_MESSAGING_SENDER_ID')
    };
  }

  static firebaseApp() {
    console.log(this.Params())
    const firebaseConfig = this.Params();

    return initializeApp(firebaseConfig);
  }

  static fireAdmin(){
    return admin.initializeApp({
        credential: admin.credential.cert(this.Params()),
        databaseURL: "https://nova-b6a7f-default-rtdb.europe-west1.firebasedatabase.app"
      })
  }

  static connector() {
    const db = getFirestore(this.firebaseApp());

    return db;
  }

  static messaging() {
    const firebaseApp = this.firebaseApp();
    const messaging = getMessaging(firebaseApp);

    return messaging;
  }

  static sendMessageSocket(message, topic) {
    
    var admin = require("firebase-admin");

    var serviceAccount = require("./nova.json");

    admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://nova-b6a7f-default-rtdb.europe-west1.firebasedatabase.app"
    });

    topic = 'news';

    // Create a message payload
    const payload = {
    data: message
    };

    // Send the message to the topic
    admin.messaging().sendToTopic(topic, payload)
    .then((response) => {
        console.log('Successfully sent message:', response);
    })
    .catch((error) => {
        console.error('Error sending message:', error);
    });
        

  }
}
