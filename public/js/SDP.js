const goBack = document.querySelector('.goBack');

goBack.addEventListener('click', () => {
    history.go(-1);
});