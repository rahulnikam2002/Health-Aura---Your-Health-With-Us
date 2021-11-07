

exports.adminDashboard = (req,res) => {
    res.render('dashboard.hbs', {title: 'Dashboard | HealthAura'});
}