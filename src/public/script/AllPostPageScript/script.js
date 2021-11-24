let imageModal = document.querySelector('#myModal');
let allImages = document.querySelectorAll('.card-image figure img');
let modalContent = document.querySelector('#img01');
let imageCloseButton = document.querySelector('#myModal .close');
let postCaption = document.querySelector('#caption');

allImages.forEach(element => {
    element.addEventListener('click', () => {
        imageModal.classList.add('is-active');
        modalContent.src = element.src;
        postCaption.innerHTML = element.alt;
    });
});

imageCloseButton.addEventListener('click', () => {
    imageModal.classList.remove('is-active');
});

const $timeBoxes = document.getElementsByClassName('created-date');

for (const timeBox of $timeBoxes) {
    const s= timeBox.childNodes[0].nodeValue;
    timeBox.childNodes[0].nodeValue=moment(new Date(s)).fromNow();
}