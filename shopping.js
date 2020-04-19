const shoppingForm = document.querySelector('.shopping');
const shoppingList = document.querySelector('.list');

let items = [];
/*
 * target is the element that triggered the event (e.g., the user clicked on)
 * currentTarget is the element that the event listener is attached to.
 * They are used for getting data out
*/

function handleSubmit(e) {
    e.preventDefault();
    const name = e.target.item.value;
    const item = {
        name,
        id: Date.now(),
        complete: false,
    };
    items.push(item);
    console.log(`There are ${items.length} items now`);
    // clearing the form
    e.target.reset();
    // fire off a custom event that will tell anyone else who cares that the items have been updated!
    shoppingList.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function displayItems() {
    const html = items.map(item => `
        <li class="shopping-item">
            <input value="${item.id}" type="checkbox" ${item.complete && 'checked'}>
            <span class="itemName">${item.name}</span>
            <button value="${item.id}">&times;</button>
        </li>`)
        .join('');
    shoppingList.innerHTML = html;
}

function mirrorToLocalStorage() {
    localStorage.setItem('items', JSON.stringify(items));
}

function deleteItem(id) {
    items = items.filter(item => item.id !== id);
    shoppingList.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function markAsCompleted(id) {
    const itemRef = items.find(item => item.id === id);
    itemRef.complete = true;
    shoppingList.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function restoreFromLocalStorage() {
    console.log('Restoring from local storage');
    const tempItemList = JSON.parse(localStorage.getItem('items'));
    if(tempItemList.length) {
        items.push(...tempItemList);
        shoppingList.dispatchEvent(new CustomEvent('itemsUpdated'));
    }
}

shoppingForm.addEventListener('submit', handleSubmit);
shoppingList.addEventListener('itemsUpdated', displayItems);
shoppingList.addEventListener('itemsUpdated', mirrorToLocalStorage);
shoppingList.addEventListener('click', function(event) {
    const id = parseInt(event.target.value);
    if(event.target.matches('button')){
        deleteItem(id)
    }
    if(event.target.matches('input[type="checkbox"]')) {
        markAsCompleted(id);
    }
});

restoreFromLocalStorage();
