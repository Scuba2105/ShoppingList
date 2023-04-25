// Initialise available shopping items.
let availableItems = [];

// Initialise shopping list to add items.
const shoppingList = [];

// Request the available items data from the main process
async function getData() {
    
    // Retreive the available items data and store in array
    const data = await window.electronAPI.sendData();
    availableItems.push(...data);

    // Filter the available items data for weekly purchased items and add to the shopping list 
    const weeklyItems = availableItems.filter((item) => {
        return item.frequency == 'Weekly';
    });
    shoppingList.push(...weeklyItems);
    console.log(shoppingList);
}

getData();

// Get the search box element and search icon.
const searchBox = document.querySelector('.search-container input');
const searchIcon = document.querySelector('.search');
const selectedItem = document.querySelector('.item');
const addToList = document.querySelector('.select_button');
const searchList = document.querySelector('.search-list');

// Change the cursor to pointer when mouse is over the button
addToList.addEventListener('mouseover', hoverPointer);

function hoverPointer() {
    this.style.cursor = 'pointer';
};

// Add current selected item to the current shopping list. 
addToList.addEventListener('click', () => {
    const selection = selectedItem.textContent;
    const itemNames = shoppingList.map((item) => {
        return item.name;
    })
    if (!itemNames.includes(selection)) {
        shoppingList.push(selection);
    }
    else {
        alert('This item has already been purchased');
    }
});

// Update the selection list base on search input
searchBox.addEventListener('keyup', updateSearchList)

function updateSearchList() {
    const searchInput = this.value;
    console.log(searchInput.length)
    if (searchInput.length > 0) {
        searchList.style.opacity = 1;
    } 
    const itemNames = availableItems.map((item) => {
        return item.name;
    });
    const regex = new RegExp(`${searchInput}`, 'ig');
    const matchedItems = itemNames.filter((item) => {
        return regex.test(item);
    });
    const searchListEntries = matchedItems.map((item) => {
        return `<li>${item}<li>`;
    }).join('');
    searchList.innerHTML = searchListEntries;
};



