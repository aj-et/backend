const form = document.querySelector('#inventory-form')
form.addEventListener('change', () => {
    const updateBtn = document.querySelector('#inventory-btn')
    updateBtn.removeAttribute('disabled')
})