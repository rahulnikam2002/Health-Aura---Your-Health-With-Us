

exports.loginPage = (req,res) => {
    res.render('login.hbs', {title: 'HealthAura - Login'})
}

exports.registerPage = (req,res) => {
    res.render('register.hbs', {title: 'HealthAura - Join the family'})
}


// Registration
exports.registerUser = (req,res) => {
    const { userName, userEmail, userPassword } = req.body;
    res.send({ userName: userName, userEmail:userEmail, userPassword: userPassword })
}