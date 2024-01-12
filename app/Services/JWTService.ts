
export default class JWTService{


    static async loadJWT(response,filePath){
        
        const fs = require('fs');
        // File path
       

        // Writing to a file
       await  fs.writeFile(filePath, response.access_token, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return;
        }
        console.log('File has been written successfully.');
        });

       
    }

    static async  readToken(){
        // write here code to read token in the file
        const fs = require('fs');
        try {
            const token = await fs.readFileSync('jwt.txt', 'utf8');
            return token;
        } catch (err) {
            console.error('Error reading token:', err);
            return null;
        }
    }



    
}