const hospitalSearchPage = document.querySelector('.searchPage-hospital');
const homeSearchbarSection = document.querySelector('.searchbarSection');
const closeSearchSection = document.querySelector('.cancelBtn-searchPage');


homeSearchbarSection.addEventListener('click', () => {
    hospitalSearchPage.style.display = 'block';
})


closeSearchSection.addEventListener('click', () => {
    hospitalSearchPage.style.display = 'none';
})


//  Menu Consts
const menuIcon = document.querySelector('.menuIcon');
let mobileMenu = document.querySelector('.mobileMenu');
let mobileMenuCloseIcon = document.querySelector('.mobileMenuCloseIcon');


menuIcon.addEventListener('click', () => {
    mobileMenu.style.display = "block";
})

mobileMenuCloseIcon.addEventListener('click', () => {
    mobileMenu.style.display = "none";
})