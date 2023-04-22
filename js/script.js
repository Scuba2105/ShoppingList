// Initialise shopping list to add items.
const shoppingList = [];

// Get the search box element and search icon.
const searchBox = document.querySelector('.search-back input');
const searchIcon = document.querySelector('.search');
const selectedItem = document.querySelector('.item');
const addToList = document.querySelector('.select_button');

// Change the cursor to pointer when mouse is over the button
addToList.addEventListener('mouseover', hoverPointer);

function hoverPointer() {
    this.style.cursor = 'pointer';
};

// Add current selected item to the current shopping list. 
addToList.addEventListener('click', () => {
    const selection = selectedItem.textContent;
    if (!shoppingList.includes(selection)) {
        shoppingList.push(selection);
    }
    console.log(shoppingList);
});

// Update the selection list base on search input
searchBox.addEventListener('keyup', updateSearchList)

function updateSearchList() {
    const searchInput = this.value;
};


