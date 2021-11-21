let deleteAccountButton = document.querySelector('.delete-account-box button');
let keepAccountButton = document.querySelector('.delete-account-confirmation-button .button1');
let deleteAccountBox = document.querySelector('.delete-account-box');

deleteAccountButton.addEventListener('click', function() {
    deleteAccountBox.classList.add('active');
    setTimeout(function() {
        document.querySelector('.overlay').classList.remove("Invisible");
    }, 100);
});

keepAccountButton.addEventListener('click', function() {
    deleteAccountBox.classList.remove('active');
    document.querySelector('.overlay').classList.add('Invisible'); 
});

