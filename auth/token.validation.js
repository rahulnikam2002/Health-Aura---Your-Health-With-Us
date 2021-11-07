const { verify } = require('jsonwebtoken');
require('dotenv').config()

exports.tokenValidation = (req,res,next) => {
    const userToken = req.cookies.userToken;
    if(userToken){
        verify(userToken, process.env.SECRET_KEY, (err, decoded) => {
            if(err){
                res.redirect('/auth/login/')
            }
            else{
                next()
            }
        })
    }
    else{
        res.redirect('/v1/auth/login/')
    }
}