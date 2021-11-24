
const $passwordAlert = document.querySelector('#passAlert')
const $form = document.querySelector('#changePassword')
const $password = document.querySelector('#password')
const $confirmPassword = document.querySelector('#confirmPassword')

$form.addEventListener('submit',(e)=>{
    $passwordAlert.innerHTML = ''
    
    if($password.value.length < 8){
        $passwordAlert.innerHTML = '<div class="form-error" style="color:red;">Password should be atleast 8 characters long</div>'
        e.preventDefault()
    }
    
    if($password.value !== $confirmPassword.value){
        $passwordAlert.innerHTML = '<div class="form-error" style="color:red;">Password and confirm password should have same value</div>'
        e.preventDefault()
    }

})