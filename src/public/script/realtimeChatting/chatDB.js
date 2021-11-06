const $messageForm = document.getElementById('message-form')
const $messageFormInput = $messageForm.querySelector('input')

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    if(!$messageFormInput.value){
        alert('You cannot send empty message')
        return
    }

    fetch($messageForm.action,{
        headers:{
            'Content-type':'application/json'
        },
        method:'post',
        body:JSON.stringify({
            message : $messageFormInput.value
        })
    })
})

// *changing time interpretation
const $timeBoxes = document.getElementsByClassName('time')

for (const timeBox of $timeBoxes) {
    const s= timeBox.childNodes[0].nodeValue;
    
    const b = s.split(/\D+/);
    timeBox.childNodes[0].nodeValue=moment(new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]))).format('h:mm a');
}
