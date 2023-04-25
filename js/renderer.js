// Initialise available shopping items.
let availableItems = [];

// Initialise shopping list to add items.
const shoppingList = [];

// Request the data from the main process
async function getData() {
    const data = await window.electronAPI.sendData();
    availableItems.push(...data);
    const weeklyItems = availableItems.filter((item) => {
        return item.frequency == 'Weekly';
    });
    shoppingList.push(...weeklyItems);
    console.log(shoppingList);
}

getData();

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


