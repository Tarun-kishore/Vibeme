let closeButton = document.querySelector('.closing-button p');
let uploadButton = document.querySelector('.upload-photo-button');

closeButton.addEventListener('click', function() {
    document.querySelector('.overlay').classList.toggle('Invisible');
});

uploadButton.addEventListener('click', function() {
    document.querySelector('.overlay').classList.toggle('Invisible');
});