const form = document.querySelector('#edit-inventory-form')
form.addEventListener('change', () => {
    const updateBtn = document.querySelector('#edit-inventory-btn')
    updateBtn.removeAttribute('disabled')
})