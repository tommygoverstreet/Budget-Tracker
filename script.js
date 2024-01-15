const bal = document.querySelector('.balance');
const balance = document.getElementById('balance');
const money_plus = document.getElementById('my-income');
const money_minus = document.getElementById('my-expense');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const addNew = document.getElementById('addNew');
const addNewForm = document.getElementById('addNewForm');
const close = document.getElementById('close');
const d = new Date();
const day = d.getDate();
const month = d.getMonth() + 1;
const year = d.getFullYear();

const currentDate = `${month}/${day}/${year}`;

addNew.addEventListener('click', () => {
 if (addNewForm.classList.contains('hide')) {
  addNewForm.classList.remove('hide');
 } else {
  addNewForm.classList.add('hide');
 }
});

close.addEventListener('click', () => {
 addNewForm.classList.add('hide');
});

// const dummyTransactions = [
//   { id: 1, text: 'Flower', amount: -20 },
//   { id: 2, text: 'Salary', amount: 300 },
//   { id: 3, text: 'Book', amount: -10 },
//   { id: 4, text: 'Camera', amount: 150 }
// ];

const localStorageTransactions = JSON.parse(
 localStorage.getItem('transactions')
);

let transactions =
 localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Add transaction
function addTransaction(e) {
 e.preventDefault();

 if (text.value.trim() === '' || amount.value.trim() === '') {
  alert('Please add a text and amount');
 } else {
  const transaction = {
   id: generateID(),
   text: text.value,
   amount: +amount.value
  };

  transactions.push(transaction);
  addTransactionDOM(transaction);
  updateValues();
  updateLocalStorage();
  text.value = '';
  amount.value = '';
 }
}

// Generate random ID
function generateID() {
 return Math.floor(Math.random() * 100000000);
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
 // Get sign
 const sign = transaction.amount < 0 ? '-' : '+';

 const item = document.createElement('tr');

 // Add class based on value
 item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

 item.innerHTML = `
    <td>${currentDate}</td><td>${transaction.text}</td> <td>${sign}${Math.abs(
  transaction.amount
 )}</td> 
  <td class="btn"><button class="delete-btn btn" onclick="removeTransaction(${transaction.id})">
  <i class="fa fa-trash"></i>
  </button></td>
`;

 list.appendChild(item);
}

// Update the balance, income and expense
function updateValues() {
 const amounts = transactions.map(transaction => transaction.amount);

 const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

 const income = amounts
  .filter(item => item > 0)
  .reduce((acc, item) => (acc += item), 0)
  .toFixed(2);

 const expense = (
  amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
  -1
 ).toFixed(2);

 balance.innerText = `$${total}`;
 money_plus.innerText = `$${income}`;
 money_minus.innerText = `$${expense}`;

 if (total < 0) {
  bal.style.color = 'rgb(225,125,125)';
 } else {
  bal.style.color = 'rgb(125,225,125)';
 }
}

// Remove transaction by ID
function removeTransaction(id) {
 transactions = transactions.filter(transaction => transaction.id !== id);

 updateLocalStorage();

 init();
}

// Update local storage transactions
function updateLocalStorage() {
 localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Init app
function init() {
 list.innerHTML = '';

 transactions.forEach(addTransactionDOM);
 updateValues();
}

init();

form.addEventListener('submit', addTransaction);
