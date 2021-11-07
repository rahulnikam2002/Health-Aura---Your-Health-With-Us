const { verify } = require('jsonwebtoken');
require('dotenv').config()

exports.checkLogin = (req,res,next) => {
    const userToken = req.cookies.userToken;
    if(userToken){
        verify(userToken, process.env.SECRET_KEY, (err, decoded) => {
            if(err){
                next()
            }
            else{
                res.redirect('/')
            }
        })
    }
    else{
        next()
    }
}