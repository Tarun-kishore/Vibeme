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