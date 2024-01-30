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

  static async sendMessageSocket(message, topic)  {
    
    var admin = require("firebase-admin");
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          "type": Env.get("FIREBASE_SERVICE_TYPE"),
          "project_id": Env.get("FIREBASE_PROJECT_ID"),
          "private_key_id": Env.get("FIREBASE_PRIVATE_KEY_ID"),
          "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCmuAuz6C0gCOSU\n9hAA8pfXm+3wg8aFj7tPTBde6e/X8T3U07yjoDW6eAtmpgiIAeL7751+bqyC5DxZ\nn9R4QP3AZMvVFE4hMryn+lwC0PPKLOOfrlyp4sUSsDBQS3zAbsnh915fg6GNLDMZ\niCCfKi/GrzSo3B7AngGVm3G3JNBEyyEr61kWOHHTTWxaaAqMDWb3WcpqcVZZBblL\nG5CwqRSgzTy9Njepiq6J/e9g5icjXfIZi/mQhbQ9tw9oqw8k7x6Y6UynIuPRglcw\nJjuJCq6VHvT2ySxPLQyvqSsaaM+imr+MJleLXWp63O/P455qZnII306qSVvvZluL\nunl9rGPXAgMBAAECggEALaMr8O+Ziq9kgzJoZxoBXtAcbj5kVaNmzuoxa5X2RdKP\n7naXqOLuUkESPeMtaq25iOWq4zVAnAQGUTJjYxfHXqc49Pc9+/B7nC/4h/zS/4ES\nPl/olcix0c/RKenAGJ07PlQMzXCnBJIY2uBcrbVKpsTHUYIQGQInxOBsXIoDSREw\nekWBG/nO66bBy16DnAbzzLF+9odt1d/5R5sa/ls2YOo/5xzdr8SVxkYzh0fDv4TM\nEMfskEGHGJ+B+Cvv/WoYJas9mnc+h0dVZWS/IkzcVyGP7a2h8XPPCPBBlZXDKC8b\nRM6uvN8qz8R2rONYUECu/c2c/AQ6UXMXB+dYiOyVIQKBgQDd54NoeNkYahRMGT1L\nrFJpJmMxGyc+wrMyUs2dMmmXNKiB24y+Mi4gy2h69qXc83MLPNehUZBupvnYTeh+\nRgjoIv8K6nNrWWsRxPOtGW4vD8lMSyRx3QFFhFKKVyDoXJ3Xvi87y/9aiF85Bph0\nhuSRruSl7NUNkB/Gy54Syr0/BQKBgQDAVdgNXIvFyJQW65nWEaNc+OZzS25VCvdi\nRierx+fc6f55rXsOxrnpxbgTeTdI/62MMqpzabzUbWBstNi11rULmPhsPJZ0qncY\n8Zabzlzf0ECcLlUbuM9cIp2Klv8siipKjX68JXRxHHRgEFQNAywKROiGeCSXH8iZ\nuw3W+ET2KwKBgHr8zK1DhXdtm9BNkNZ3LLnQp9tYpFi5ip4SnJlKjpFagyZt68Si\nhURx2HeGaolaeOG6l/x1+2oIq6MCEyChamBWvSpspQnTZm9TzIac+J+mzTe20f01\ns3W3EBRSlA+U/XrMkts+hknEGZq+mBLFjLtdxqZb6/13atVAl1zs9xSNAoGAerwN\nA/HDq/HkNoAgCg/1XJXkkTxYauJ1nPvBwwftOPcFEeaXeYVtC/XFEoAuvGGUALww\nMzgNbM1jU9tP0zHxFDaIiKFdLZO+Lme0QTa944EESeXzH56ejF/2goL60RRWCn8i\nmbOZC7kptkeVKzyT9PWmIHE4gEui+h74pO6HK0MCgYEAq4XYirAYfVKCW/CHywmU\nm8i/2banQCLj+CbrLfis6REgg9GAG7X+Sa1phArxWVouiIfnqYw+R3ZZodhBMqkH\n42AeLEMjripJb/N7B02P1nPdRR4XVMyyGMvzER1m3kvIRhRuws7pqCh/ZAir5U3O\nVgti+qzrFCzAGUYdUU3AYIU=\n-----END PRIVATE KEY-----\n",
          "client_email": Env.get("FIREBASE_CLIENT_EMAIL"),
          "client_id": Env.get("FIREBASE_CLIENT_ID"),
          "auth_uri": Env.get("FIREBASE_AUTH_URI"),
          "token_uri": Env.get("FIREBASE_TOKEN_URI"),
          "auth_provider_x509_cert_url": Env.get("FIREBASE_AUTH_PROVIDER_X509_CERT_URL"),
          "client_x509_cert_url": Env.get("FIREBASE_CLIENT_X509_CERT_URL"),
          "universe_domain": Env.get("GOOGLE_UNIVERSE_DOMAIN")
        }
        ),
        databaseURL: "https://nova-b6a7f-default-rtdb.europe-west1.firebasedatabase.app"
        });
    }
    // Create a message payload
    const payload = {
    data: message
    };

    // Send the message to the topic
    await admin.messaging().sendToTopic(topic, payload)
    .then((response) => {
        console.log('Successfully sent message:', response);
    })
    .catch((error) => {
        console.error('Error sending message:', error);
    });
        

  }
}
