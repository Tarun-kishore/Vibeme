
const editReply = function(form,event){
    event.preventDefault()
    const replyId = form.attributes.id.value
    
    const $button = form.childNodes[1]

    $button.setAttribute('disabled','disabled')
    
    const ele =form.parentElement.parentElement
    const $form = document.createElement('form')
    $form.setAttribute('method','post')
    $form.setAttribute('action',`/post/comment/reply/edit/${replyId}?_method=put`)
    $form.innerHTML = `<textarea name="comment" required> </textarea> <button type="submit">edit</button>`
    ele.appendChild($form)
}
