// const jwt = require("jsonwebtoken");
// require('dotenv/config');
// const token = process.env.API_TEST_TOKEN;
// const key = process.env.API_SECRET_KEY;


export const VerifyToken2 = (req: any, res: any, next: any) => {
     // get herder value
     const bearerHeader = req.headers['authorization'];
     // check if it is undefined
     if(typeof bearerHeader !== 'undefined') {
         const bearer = bearerHeader.split(' ');
         const bearerToken = bearer[1];
         req.token = bearerToken;
         next();
     }
     else { 
         res.sendStatus(403);
     }

    //  jwt.verify(token, key, (err, authData) => {
    //     console.log('error', err, 'token log', authData);

    //     console.log('token log ID', authData.user.username);
    
    // });
}
