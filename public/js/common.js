let userPage = document.querySelector('.MenuPage-userName')
userPage.addEventListener('click', () => {
    location.href = '/user';
})


function goBack(){
    history.go(-1)
}