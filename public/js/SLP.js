const searchIcon = document.querySelector('.search-icon')
const hospitalSearchPage = document.querySelector('.searchPage-hospital');
const homeSearchbarSection = document.querySelector('.searchbarSection');
const closeSearchSection = document.querySelector('.cancelBtn-searchPage');
const normalSearchInputHCP = document.querySelector('.HSP-normalSearch');
const userLocationSelector = document.querySelector('.userLocationDetector');
const showLoading = document.querySelector('.showLoading');
let loglat = document.querySelector('.loglat');

// Menu Consts
let menuIcon = document.querySelector('.menu-icon');
let mobileMenu = document.querySelector('.mobileMenu');
let mobileMenuCloseIcon = document.querySelector('.mobileMenuCloseIcon');


menuIcon.addEventListener('click', () => {
    mobileMenu.style.display = "block";
})

mobileMenuCloseIcon.addEventListener('click', () => {
    mobileMenu.style.display = "none";
})


searchIcon.addEventListener('click', () => {
    hospitalSearchPage.style.display = 'block';
})


closeSearchSection.addEventListener('click', () => {
    hospitalSearchPage.style.display = 'none';
})





userLocationSelector.addEventListener('click', getUserLocation);

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        console.log('Your GPS is not working properly, try to search manually');
    }
}


function showPosition(position) {
    console.log(position)
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    console.log(latitude + " " + longitude)
    showLoading.style.display = 'block';
    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=3d818e2f6cb740bf806481641efeb578`).then(res => res.json()).then(results => {
        let usersCurrentLocation = results.results[0].components;
        let { town, suburb } = usersCurrentLocation;

        let cityArray = [`${town}`, `${suburb}`];
        console.log(cityArray)
        showLoading.style.display = 'none';

        for (i = 0; i < cityArray.length; i++) {
            if (cityArray[i] != 'undefined') {
                loglat.value = cityArray[i];
            }
        }

    })
}
