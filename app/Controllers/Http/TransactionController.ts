
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import FirebaseService from 'App/Services/FirebaseService'
import { doc, collection ,updateDoc,addDoc, query,where,getDocs} from 'firebase/firestore'

import SemoaService from 'App/Services/SemoaService'
import SemoaServiceTransac from 'App/Interfaces/SemoaCreateTransac';
import jsonwebtoken from'jsonwebtoken';

export default class TransactionController {
    public async index() {
        let semoa = new SemoaService();

        semoa.auth()
        // let data = {
        //     username:"demo",
        //     password:"1TFzh8<3KJQr",
        //     client_id: "cashpay",
        //     client_secret: "HpuNOm3sDOkAvd8v3UCIxiBu68634BBs"
        // }
        // JWTService.loadJWT();
        // const connector = FirebaseService.connector();
    
        // const collectionRef = await collection(connector,'Relais');
        //   let frelais = [];
         
        //   const q = query(collectionRef, orderBy('createdAt', 'asc'));
    
        //   await getDocs(q)
        //   .then(async (querySnapshot) => {
        //     querySnapshot.forEach(async (doci) => {
        //       let timestamp = doci._document.createTime.timestamp 
        //       frelais.push(doci.data())
        //     });
            
        //   })
        //   .catch((error) => {
        //     let data = {erreur:'erreur'}
        //     frelais.push(data);
            
        //   });
      // const remoteServerResponse =  await axios.post('https://sandbox.semoa-payments.com/api/auth', data, {
      //   headers: {
      //     'Content-Type': 'application/json', // Set appropriate headers
      //   },
      // });
      // JWTService.loadJWT()
      // return frelais
      
      return {"status": "ok"}
    }

    public async moyensPaiements(){
      let semoa = new SemoaService();

      let moyensPaieme =  await semoa.moyensDePaiement()

      return moyensPaieme
    }

    public async sendPayment(ctx: HttpContextContract)
    {
      /*
      {
        "command_id": "COM-XXXXXXXXXXXXXX"
        "amount": 200,
        "description": "Test environnement Sandbox",
        "client": {
          "lastname": "LAKIGNAN",
          "firstname": "Sonia Sika",
          "phone": "+22890112783"
        } 
      }

      {
        "command_id": "COM-XXXXXXXXXXXXXX"
        "amount": 200,
        "description": "Test environnement Sandbox",
        "client_lastname": "LAKIGNAN"
        "client_firstname": "Sonia Sika"
        "client_phone": "+22890112783"
      }
      
      */
      let data = ctx.request.all()
       

        const connector = FirebaseService.connector();
    
        const collectionRef = await collection(connector,'Transactions');
        let dataSend ;

        dataSend = {
          merchant_reference :  data.command_id,
          amount : data.amount,
          gateway_id : data.gateway_id,
          callback_url: Env.get('NOVAZON_API')+'/transactions/callback',
          client : {
            firstname : data.client_firstname,
            lastname:   data.client_lastname,
            phone:      data.client_phone
          }
        }

        let res = await addDoc(collectionRef, data)

        let semoa = new SemoaService();

        let sem;

       sem = await semoa.createTransaction(
          dataSend
        );
        let semoaAns = <SemoaServiceTransac>sem
        
        const transacRef = doc(connector, "Transactions", res.id);

        console.log('semoaAns',semoaAns)

        updateDoc(transacRef,{
          bill_url: semoaAns.bill_url,
          payment_reference: semoaAns.merchant_reference,
          payment_methods: semoaAns.payments_method,
          code: semoaAns.code,
          payment_order_reference: semoaAns.order_reference
        })
              
        return {
                "message": "Transaction ok",
                "payment_link": semoaAns.bill_url,
                "payment_action": semoaAns.payments_method[0].action,
                "payment_method": semoaAns.payments_method[0].method,
                "payment_order_reference": semoaAns.order_reference
              }
    }


    public async callback(ctx: HttpContextContract){
      const connector = FirebaseService.connector();
      let data = ctx.request.all()
      let transaction 
      // const collectionRef = await collection(connector,'Transactions');
      
      
      jsonwebtoken.verify(data.token,
      Env.get('SEMOA_API_KEY') , async(err, decoded) => {
        if (err) {
          console.error('Error decoding token:', err);

        } else {
         // console.log('Decoded token:', decoded);
          const collectionRef =  query(collection(connector,'Transactions'),
          where('command_id','>=',decoded.merchant_reference),
        );

      const querySnapshot = await getDocs(collectionRef)

      querySnapshot.forEach((doc) => {
         transaction = doc.data()
         transaction.id = doc.id
      });
      console.log(transaction)
      const transacRef = doc(connector, "Transactions", transaction.id);
          
          console.log('decodedd',decoded.state)
         await updateDoc(transacRef,{
          state: decoded.state
        })
        }
      })

      
      
      return {message: "success"}
        
      

    }




}