const hospitalSearchPage = document.querySelector('.searchPage-hospital');
const homeSearchbarSection = document.querySelector('.searchbarSection');
const closeSearchSection = document.querySelector('.cancelBtn-searchPage');
const normalSearchInputHCP = document.querySelector('.HSP-normalSearch');
const userLocationSelector = document.querySelector('.userLocationDetector');
const showLoading = document.querySelector('.showLoading');
let loglat = document.querySelector('.loglat');
let searchiconAllHospitalPage = document.querySelector('.search-icon');
let goToHospital = document.querySelector('.goToHospital');

// Menu Consts
let menuIcon = document.querySelector('.menuIcon');
let mobileMenu = document.querySelector('.mobileMenu');
let mobileMenuCloseIcon = document.querySelector('.mobileMenuCloseIcon');


menuIcon.addEventListener('click', () => {
    mobileMenu.style.display = "block";
})

mobileMenuCloseIcon.addEventListener('click', () => {
    mobileMenu.style.display = "none";
})

// loglat.value = 'Helllooo'

homeSearchbarSection.addEventListener('click', () => {
    hospitalSearchPage.style.display = 'block';
    normalSearchInputHCP.click();
})


closeSearchSection.addEventListener('click', () => {
    hospitalSearchPage.style.display = 'none';
})

// goToHospital.addEventListener('click', () => {
//     location.href = '/'
// })


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
                location.href = `/search?city=${cityArray[i]}`
            }
        }

    })
}
