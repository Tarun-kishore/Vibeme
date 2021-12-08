let imageModal = document.querySelector('#createPostModal');
let imageCloseButton = document.querySelector('#createPostModal .close');

imageCloseButton.addEventListener('click', () => {
    imageModal.classList.remove('is-active');
});