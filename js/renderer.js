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
    
    if (searchInput.length > 0) {
        searchList.style.opacity = 1;
    } 
    else {
        searchList.style.opacity = 0;
    }
    const regex = new RegExp(`${searchInput}`, 'ig');
    const matchedItems = availableItems.filter((item) => {
        return item.name.includes(searchInput);
    });
    const searchListTitle = `<li class="list-titles"><span>Item Name</span><span>Frequency</span></li>`;
    const searchListEntries = matchedItems.map((item) => {
        return `<li class="listItem1"><span>${item.name}</span><span>${item.frequency}</span></li>`;
    }).join('');
     
    searchList.innerHTML = searchListTitle + searchListEntries;
};



