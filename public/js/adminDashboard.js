const featuredImg = document.getElementById('featuredImg');
const multipleImgs = document.getElementById('multipleImgs');
const uploadedSuccessfullyFeaturedImg = document.querySelector('.uploadedSuccessfullyFeaturedImg');
const uploadedSuccessfullyMultipleImg = document.querySelector('.uploadedSuccessfullyMultipleImg');
const successMsgPopUp = document.querySelector('.successMsg');

featuredImg.addEventListener('change', () => {
    uploadedSuccessfullyFeaturedImg.style.display = 'block'
    successMsgPopUp.style.display = 'flex'
    setTimeout(() => {
        successMsgPopUp.style.display = 'none'
    }, 1000);
})

multipleImgs.addEventListener('change', () => {
    uploadedSuccessfullyMultipleImg.style.display = 'block'
    successMsgPopUp.style.display = 'flex'
    setTimeout(() => {
        successMsgPopUp.style.display = 'none'
    }, 1000);
})