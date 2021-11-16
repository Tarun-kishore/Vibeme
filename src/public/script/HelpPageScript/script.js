// selected list text and their heading
let accordion = document.querySelector('.accordion-list');
let items = accordion.querySelectorAll('li');
let questions = accordion.querySelectorAll('.accordion-title');

// now on each li title, adding event listener to hear click
questions.forEach(question => question.addEventListener('click', toggleAccordion));

// now we get the li which is being clicked so we open it and remove others li 
function toggleAccordion(){
    thisItem = this.parentNode;
    items.forEach(item => {
        if (thisItem == item){
            thisItem.classList.toggle('open');
            return;
        }
        item.classList.remove('open');
        item.classList.toggle('Invisible');
    });
}