import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'
import JWTService from './JWTService'

export default class SemoaService{
    private password;
    private client_id;
    private client_secret
    private username

    constructor(){
        this.password = Env.get('SEMOA_PASSWORD')
        this.client_id = Env.get('SEMOA_CLIENT_ID')
        this.client_secret = Env.get('SEMOA_CLIENT_SECRET')
        this.username = Env.get('SEMOA_USERNAME')
    }

    async auth() {
        let data = {
            password: this.password,
            client_id: this.client_id,
            client_secret: this.client_secret,
            username: this.username
        }
        try {
            //console.log('hello')
            let url = `${Env.get('SEMOA_BASE_URL')}auth`

            console.log(url)
            const response = await axios.post(url, data, {
                headers: {
                    'Content-Type': 'application/json', // Set appropriate headers
                },
            });
            // Assuming response.data contains JWT data
            JWTService.loadJWT(response.data);

            return response.data.access_token;
        }
        catch(error){
            console.error('Error occured:', error)
            return 
        }
      
    }


    async moyensDePaiement(){
        let pay = []
        let url = `${Env.get('SEMOA_BASE_URL')}gateways`
        console.log(url)
        try{
            let token = await JWTService.readToken()
            console.log('ligne 47:', token)
            let response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type':'application/json'
                },
            });
            pay = response.data

        } catch(error){
            let token=  await this.auth();
            
            
            
            const response = await axios.get(url, {
                 headers: {
                     'Authorization': `Bearer ${token}`,
                     'Content-Type':'application/json'
                 },
             });
            pay = response.data
            console.log(error)
        } finally{
            let token = await JWTService.readToken()
            
            const response = await axios.get(url, {
                 headers: {
                     'Authorization': `Bearer ${token}`,
                     'Content-Type':'application/json'
                 },
             });
            pay = response.data
        }
        console.log(pay)
        return pay
    }


    async createTransaction(data){
        let pay = []
        let url = `${Env.get('SEMOA_BASE_URL')}orders`
        
        try{
            let token = JWTService.readToken()
            
            let response = await axios.post(url, data,{
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type':'application/json'
                },
            });
            pay = response.data

        } catch(error){
            let token=  await this.auth();
            
            
            let response = await axios.post(url, data,{
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type':'application/json'
                },
            });
            pay = response.data
            console.log(error)
            console.log(error)
        } 
        
        return pay
    }
}