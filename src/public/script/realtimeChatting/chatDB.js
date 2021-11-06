const $messageForm = document.getElementById('message-form')
const $messageBox = $messageForm.querySelector('input')


$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()


    fetch($messageForm.action,{
        headers:{
            'Content-type':'application/json'
        },
        method:'post',
        body:JSON.stringify({
            message : $messageBox.value
        })
    })
})