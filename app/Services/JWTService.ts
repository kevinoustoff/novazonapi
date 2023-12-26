
export default class JWTService{


    static loadJWT(response){
        
        const fs = require('fs');
        // File path
        const filePath = 'jwt.txt';

        // Writing to a file
        fs.writeFile(filePath, response.access_token, (err) => {
        if (err) {
            //console.error('Error writing to file:', err);
            return;
        }
        //console.log('File has been written successfully.');
        });
    }

    static readToken(){
        // write here code to read token in the file
        const fs = require('fs');
        try {
            const token = fs.readFileSync('jwt.txt', 'utf8');
            return token;
        } catch (err) {
            console.error('Error reading token:', err);
            return null;
        }
    }

    
}