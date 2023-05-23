const { DateTime } = require("luxon");
const path = require('path');
const fs = require('fs');

function getCurrentItemData(__dirname) {
    const allData = fs.readFileSync(path.join(__dirname, 'data', 'shopping_items.json'))
    const currentData = fs.readFileSync(path.join(__dirname, 'data', 'current_data.json'))
    const allDataArray = JSON.parse(allData);
    const currentDataObject = JSON.parse(currentData);
    const currentTimeStamp = DateTime.now().ts;
    const endDateTimeStamp = currentDataObject.endTimeStamp;
    console.log(currentTimeStamp, endDateTimeStamp);
    let dataObject;
    if (currentTimeStamp < endDateTimeStamp) {
        dataObject = {allData: allDataArray, currentData: currentDataObject.shoppingListData};
    }
    else {
        dataObject = {allData: allDataArray};
    }

    return dataObject
}

function generateItemArray(list) {
    const shoppingList = JSON.parse(list);
    const itemArray = [];
    const itemCategories = ['Fresh Produce','Dairy','Grains & Cereals','Baking','Frozen','Oils & Seasoning',
    'Snacks, Spreads & Drink','Cleaning & Household'];
    itemCategories.forEach((itemCategory) => {
      const categoryItems = shoppingList.filter((item) => {
        return item.category == itemCategory;
      })
      const classAtt = itemCategory.toLowerCase().replace(/\s/g, '-').replace('&', '').replace(',','').replace('--', '-');
      categoryObject = {category: itemCategory, classAttribute: classAtt, items: categoryItems};
      itemArray.push(categoryObject);
    });

    return itemArray;
};

function getEndDate() {
    // Monday is 1 through to Sunday which is 7. 
    const currentDate = DateTime.now();
    const dayOfWeek = currentDate.weekday;
    let daysElapsed;
    if (dayOfWeek == 1) {
        daysElapsed = 6;
    }
    else {
        daysElapsed = dayOfWeek - 2;
    }
    const daysToEnd = 6 - daysElapsed;
    const dateEnd = currentDate.plus({days: daysToEnd});
    return dateEnd;
}

module.exports = {getEndDate, generateItemArray, getCurrentItemData};