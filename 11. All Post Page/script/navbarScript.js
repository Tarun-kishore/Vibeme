let accountDropdown = document.querySelector('.account-dropdown .user-image');
let dropdownMenu = document.querySelector('.nav-dropdown');

accountDropdown.addEventListener('click', () => {
    dropdownMenu.classList.toggle('is-active');
});