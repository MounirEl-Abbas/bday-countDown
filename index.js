const responseText = document.getElementById('action-response')
const inputField = document.querySelector('input')
const submitBtn = document.querySelector('button[type=submit]')
const groceryItem = document.querySelector('.grocery-items')
const clearBtn = document.getElementById('clear-items')


// Event Listeners
window.addEventListener('DOMContentLoaded', beginApp)
clearBtn.addEventListener('click', clearItems)

function beginApp(){
  submitBtn.addEventListener('click', insertItem)
  submitBtn.textContent = 'Submit'
  }


// Get value from input field, when Submit is clicked
function getInput(){
  let userInput = inputField.value
  return userInput
}

/**********************
 * INPUT MANIPULATION
 ***********************/
// Capitalize first letter of value
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Insert input value into: grocery-items.innerHTML
function insertItem(){
  item = capitalizeFirstLetter(getInput())
  checkInputLength()
  myGroceryList.push(item)
  groceryItem.innerHTML += `
  <div class="item">
    <p>${item}</p>
    <div class="item-btns">
      <i class="fa fa-edit"></i>
      <i class="fa fa-trash-o"></i>
    </div>
  </div>`
  itemAddedSuccess()
  clearBtnToggle()
  clearInputField()
  // Create edit/delete buttons based on icons in <i> tags, above
  queryEditBtn()
  queryDeleteBtn()
  // Adds items to local Storage
  updateStorage()
}

/****************** 
Edit item logic 
*******************/
// Create Edit button
function queryEditBtn(){
  const editBtn = document.getElementsByClassName('fa fa-edit')

  for(let i = 0; i < editBtn.length; i++){
    editBtn[i].addEventListener('click', editItem)
  }
}


// Once edit icon on element is clicked
function editItem(e){
  // Remove submit-btn functionality
  submitBtn.removeEventListener('click', insertItem)
  // Find element being edited
  let targetItem = e.target.parentElement.parentElement
  let targetItemText = String(targetItem.children[0].textContent)
  
  inputField.value = targetItemText 
  
  // Create submit button replacement (Edit button)
  submitBtn.id = "edit-btn"
  const submitBtnReplace = document.getElementById('edit-btn')
  submitBtnReplace.textContent = 'Edit'
  
  submitBtnReplace.addEventListener('click', editContent)
  
  // Replace targeted text with new text
  function editContent(){
    targetItem.children[0].textContent = capitalizeFirstLetter(inputField.value)
    itemEditedSuccess()
    // Pass new values to storage
    storageEditItem(targetItemText, inputField.value)
    
    // Restore app functionality (exit edit-mode)
    clearInputField()
    submitBtnReplace.removeEventListener('click', editContent)
    beginApp()
  }
  }
  
/****************** 
Delete item logic 
*******************/
// Creates DeleteBtn (After an item is inserted with insertItem())
function queryDeleteBtn(){
  const deleteBtn = document.getElementsByClassName('fa fa-trash-o')

  for(let i = 0; i < deleteBtn.length; i++){
    deleteBtn[i].addEventListener('click', deleteItem)
  }
}

// Delete grandparent (entire item) of delete-icon selected
function deleteItem(e){
  e.target.parentElement.parentElement.remove()
  itemDeletedSuccess()

  // Delete item from local Storage
  let targetItem = e.target.parentElement.parentElement
  let targetItemText = String(targetItem.children[0].textContent)
  storageRemoveItem(targetItemText)


  // Remove Clear-button if no more items after deletion
  if(groceryItem.childElementCount == 0){
  clearItems()
  }  
}

/*************************
Local Storage Logic
*************************/
let myGroceryList = []
const savedItemsLocalStorage = JSON.parse(localStorage.getItem('myGroceryList'))

// Check local storage, if items found, add items to Grocery array
if(savedItemsLocalStorage) {
  myGroceryList = savedItemsLocalStorage
  console.log(myGroceryList)
  populateApp()
}

// Populate grocery App from local storage
function populateApp(){
  for (let i = 0; i < myGroceryList.length; i++){
    console.log()
     groceryItem.innerHTML += `
  <div class="item">
    <p>${myGroceryList[i]}</p>
    <div class="item-btns">
      <i class="fa fa-edit"></i>
      <i class="fa fa-trash-o"></i>
    </div>
  </div>`
  clearBtnToggle()
  queryEditBtn()
  queryDeleteBtn()
  }
}

function updateStorage(){
  localStorage.setItem('myGroceryList', JSON.stringify(myGroceryList))
}

function storageEditItem(itemNameBefore, itemNameAfter){
  storageItemIndex = myGroceryList.indexOf(itemNameBefore)
  myGroceryList[storageItemIndex] = itemNameAfter
  updateStorage()

}

function storageRemoveItem(itemName){
  for (let i = 0; i < myGroceryList.length; i++){
  }
  removeItemIndex = myGroceryList.indexOf(itemName)
  myGroceryList.splice(removeItemIndex, 1)
  updateStorage()
  
}


/***************************
  Response text function
****************************/
const responses = [
  'Please Enter Value',
  'Item Added To The List',
  'Value Changed',
  'Item Removed',
  'Empty List'
]
//If input-field value is empty and submit is clicked
function checkInputLength(){
  if(inputField.value == ''){
    responseText.style.color = '#721c24'
    responseText.style.backgroundColor = '#f8d7da'
    clearActionResponse()
    throw new Error(responseText.textContent = responses[0])
  }
  
}
// When item is added
function itemAddedSuccess(){
  responseText.textContent = responses[1]
    responseText.style.color = '#155724'
    responseText.style.backgroundColor = '#d4edda'
    clearActionResponse()
}

// When item is edited
function itemEditedSuccess(){
  responseText.textContent = responses[2]
    responseText.style.color = '#155724'
    responseText.style.backgroundColor = '#d4edda'
    clearActionResponse()
}

// When item is deleted
function itemDeletedSuccess(){
  responseText.textContent = responses[3]
    responseText.style.color = '#721c24'
    responseText.style.backgroundColor = '#f8d7da'
    clearActionResponse()
}

// When clear all
function itemClearAllSuccess(){
  responseText.textContent = responses[4]
    responseText.style.color = '#721c24'
    responseText.style.backgroundColor = '#f8d7da'
    clearActionResponse()
}


/***********************************
          CLEAR LOGIC
***********************************/
// Clear items Button show/hide
function clearBtnToggle(){
  if(groceryItem.innerHTML == ''){
      clearBtn.style.display = 'none'
  }else{
      clearBtn.style.display = 'block'
  }
}

// Clear input field
function clearInputField(){
  inputField.value = ''
}

// Clear ALL Items
function clearItems(){
  itemClearAllSuccess()
  groceryItem.innerHTML = ''
  clearBtnToggle()
  myGroceryList = []
  localStorage.clear()
}

// Clear action-response 
function clearActionResponse(){
  setTimeout(function(){
    responseText.textContent = ''
  },1000)
}


