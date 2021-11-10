const socket = io();

// *Elements
const $messageFormButton = $messageForm.querySelector('button')
const $messageBox = document.getElementById('message-box')

const temp = $messageForm.action.split('/')
const room = temp[temp.length - 1];
const user = document.getElementById('myName').innerText


socket.on('receiveMessage', ({ user, message, createdAt }) => {
    if ($messageBox.firstElementChild.tagName === 'H3') {
        $messageBox.innerHTML = ''
    }
    
    const html = ` <div>
    <p>
    ${user}
    <span>
    ${moment(createdAt).format('h:mm a')}
    </span>
    </p>
    <div>${message}</div>
    </div>`
    $messageBox.insertAdjacentHTML('beforeend', html)
})


$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    if (!$messageFormInput.value) {
        alert('You cannot send empty message')
        return
    }
    $messageFormButton.setAttribute('disabled', 'disabled')
    
    const message = $messageFormInput.value
    socket.emit('sendMessage', { message: $messageFormInput.value, user, room }, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if (error) {
            return alert("Message should not contain Profanity")
        }
        
        if ($messageBox.firstElementChild.tagName === 'H3') {
            $messageBox.innerHTML = ''
        }
        const html = ` <div>
        <p>
        ${user} . YOU
        <span>
        ${moment(new Date().getTime()).format('h:mm a')}
        </span>
        </p>
        <div>${message}</div>
        </div>`
        $messageBox.insertAdjacentHTML('beforeend', html)
            
        })
    })
    
    
    socket.emit('join', { room }, (error) => {
        if (error) {
            alert(error)
            location.href = '/message/viewAll'
    }
})