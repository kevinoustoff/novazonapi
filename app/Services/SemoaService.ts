import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'
import JWTService from './JWTService'
import { v4 as uuidv4 } from 'uuid';
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
            JWTService.loadJWT(response.data,'jwt.txt');

            return response.data.access_token;
        }
        catch(error){
            console.error('Error occured:', error)
            return 
        }
      
    }

    async authSemoaPro(){
        const formData = new URLSearchParams();
        formData.append('grant_type', Env.get('SEMOA_PRO_GRANT_TYPE'));
        formData.append('client_id', Env.get('SEMOA_PRO_CLIENT_ID'));
        formData.append('client_secret', Env.get('SEMOA_PRO_CLIENT_SECRET'));
        formData.append('username', Env.get('SEMOA_PRO_USERNAME'));
        formData.append('password', Env.get('SEMOA_PRO_PASSWORD'));
        formData.append('scopes', Env.get('SEMOA_PRO_SCOPE'));

        fetch(Env.get('SEMOA_PRO_APIURL')+'/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
          })
            .then(response => response.json())
            .then(data => {
              console.log('Token response:', data);
              JWTService.loadJWT(data,'jwtSemoa.txt');
              
            })
            .catch(error => {
              console.error('Error fetching token:', error);
            });

            return 'everyone' 
    }


    async moyensDePaiement(){
        let pay = []
        let url = `${Env.get('SEMOA_BASE_URL')}gateways`
        console.log(url)
        try{
            let token = await JWTService.readToken('jwt.txt')
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
            let token = await JWTService.readToken('jwt.txt')
            
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
            let token = await JWTService.readToken('jwt.txt')
            
            let response = await axios.post(url, data,{
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type':'application/json'
                },
            });
            pay = response.data

        } catch(error){
            let token=  await this.auth();
            console.log(error)
            
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

    async createOrderSemPro(data){
        let url = `${Env.get('SEMOA_PRO_APIURL')}orders/momo`
        
        try{
            let token = await JWTService.readToken('jwtSemoa.txt')
            let response = await axios.post(url,data,{
                headers:{
                    'Authorization': `Bearer ${token}`,
                    'Content-Type':'application/json',
                    'Request-Id': uuidv4() ,
                }
            })

            console.log(response)
            return response
        } catch(error){
            console.log(error)
        }

        
    }
}