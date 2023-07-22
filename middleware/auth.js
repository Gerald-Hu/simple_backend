const jwt = require('jsonwebtoken');
const config_default = require('../config/config_default');

module.exports = (req, res, next)=> {
    next();

    // When a simple auth is needed, uncomment the code below.

    // try{
    //     if(req.body.token === undefined){
    //         res.status(403).send("No access.");
    //         return;
    //     }else{
    //         const token = req.body.token;
    //         try{
    //             jwt.verify(token, config_default.secret);
    //             next(); 
    //         }catch(err){
    //             res.status(403).send("No access.");
    //             return;
    //         }
    //     }
    // }catch(err){
    //     next(err)
    // }
}