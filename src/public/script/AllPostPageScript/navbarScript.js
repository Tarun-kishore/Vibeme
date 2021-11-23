let accountDropdown = document.querySelector('.account-dropdown .user-image');
let dropdownMenu = document.querySelector('.nav-dropdown');
let hamburgerIcon = document.querySelector('.navbar-mobile .navbar-burger');
let mobileDropdownMenu = document.querySelector('.navbar-mobile .navbar-mobile-menu');

accountDropdown.addEventListener('click', () => {
    dropdownMenu.classList.toggle('is-active');
});

hamburgerIcon.addEventListener('click', () => {
    hamburgerIcon.classList.toggle('is-active');
    mobileDropdownMenu.classList.toggle('is-active');
});