const goBackBtn = document.querySelector('.goBackBtn');
const emailIcon = document.getElementById('emailIcon');
const passwordIcon = document.getElementById('passwordIcon');
const userEmail = document.getElementById('userEmail');
const userPassword = document.getElementById('userPassword');

// go back
goBackBtn.addEventListener('click', () => {
    history.go(-1);
})

userEmail.addEventListener('focus', () => {
    userEmail.style.borderBottomColor = "var(--primary)";
})

userEmail.addEventListener('blur', () => {
    userEmail.style.borderBottomColor = "var(--grey-color)";

})

userPassword.addEventListener('focus', () => {
    userPassword.style.borderBottomColor = "var(--primary)";
})

userPassword.addEventListener('blur', () => {
    userPassword.style.borderBottomColor = "var(--grey-color)";
})


// userEmail.addEventListener('onkeydown', () => {
//     console.log(userEmail.value)
// })

function checkEmail(value){
    let val = value.includes('@')
    if(val){
        emailIcon.style.color = 'var(--primary)';
    }
    else{
        emailIcon.style.color = 'var(--grey-text-color)';
    }
}


const checkPassword = (value) => {
    if(value.length >= 5){
        console.log(value.length)
        passwordIcon.setAttribute("name", "lock-closed-outline");
        passwordIcon.style.color = 'var(--primary)';
    }
    else if(value.length <= 5){
        passwordIcon.setAttribute("name", "lock-open-outline");
        passwordIcon.style.color = 'var(--grey-text-color)';
    }
    else{
        passwordIcon.setAttribute("name", "lock-open-outline");
        passwordIcon.style.color = 'var(--grey-text-color)';
    }
}

