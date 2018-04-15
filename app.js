// Book constructor
function Book(title, author, isbn, pubdate) {
  this.title = title;
  this.author = author;
  this.isbn = isbn;
  this.pubdate = pubdate;ds
}

// UI Constructor
function UI() {}

// Add Book To List
UI.prototype.addBookToList = function (book) {
  const list = document.getElementById('book-list');
  // Create element 
  const row = document.createElement('tr');
  // Insert cols
  row.innerHTML = `
  <td>${book.title}</td>
  <td>${book.author}</td>
  <td>${book.isbn}</td>
  <td>${book.pubdate}</td>
  <td><a href="#" class="delete">X</a></td>
  `;
  list.appendChild(row);
}

// Show alert
UI.prototype.showAlert = function (message, className) {
  // Create a div
  const div = document.createElement('div');
  // Add classes
  div.className = `alert ${className}`;
  // Add text
  div.appendChild(document.createTextNode(message));
  // Get parent
  const container = document.querySelector('.container');
  const form = document.querySelector('#book-form');
  // Insert alert
  // Insert div before form
  container.insertBefore(div, form);
  // Timeout after 3 sec
  setTimeout(function () {
    document.querySelector(".alert").remove()
  }, 3000);
}

// Delete book
UI.prototype.deleteBook = function (target) {
  if (target.className === 'delete') {
    target.parentElement.parentElement.remove();
  }
}

// Clear fields
UI.prototype.clearFields = function () {
  document.getElementById('title').value = '';
  document.getElementById('author').value = '';
  document.getElementById('isbn').value = '';
  document.getElementById('pubdate').value = '';
}

// Event Listeners for add book
document.getElementById('book-form').addEventListener('submit', function (e) {
  // Get form values
  const title = document.getElementById('title').value,
    author = document.getElementById('author').value,
    isbn = document.getElementById('isbn').value,
    pubdate = document.getElementById('pubdate').value

  // Instantiate book
  const book = new Book(title, author, isbn, pubdate);

  // Instantiate UI
  const ui = new UI();
  console.log(ui);

  // Validate fields - check if all filled
  if (title === '' || author === '' || isbn === '') {

    // Error alert
    ui.showAlert("Please fill in all fields", 'error')

    // Validate fields - check if valid ISBN
  } else if (isValidISBN(isbn) === false) {
    // Error alert
    ui.showAlert("Please input a valid ISBN", 'error')

  } else if (isValidDate(pubdate,msg) === false) {
    ui.showAlert(msg, 'error')

  } else {    
    // Add book to list
    ui.addBookToList(book);

    // Show success
    ui.showAlert('Book Added!', 'success');

    // Clear fields
    ui.clearFields();
  }

  e.preventDefault();
});

// Vaidate ISBN
function isValidISBN(isbn) {
  console.log("Validating ISBN...");
  isbn = isbn.replace(/[^\dX]/gi, '');
  if (isbn.length == 10) {
    let chars = isbn.split('');
    if (chars[9].toUpperCase() == 'X') {
      chars[9] = 10;
    }
    let sum = 0;
    for (let i = 0; i < chars.length; i++) {
      sum += ((10 - i) * parseInt(chars[i]));
    }
    return (sum % 11 == 0);
  } else if (isbn.length == 13) {
    let chars = isbn.split('');
    let sum = 0;
    for (let i = 0; i < chars.length; i++) {
      if (i % 2 == 0) {
        sum += parseInt(chars[i]);
      } else {
        sum += parseInt(chars[i]) * 3;
      }
    }
    return (sum % 10 == 0);
  } else {
    return false;
  }
}

// Validate publication date
let msg;
function isValidDate(pubdate) {  
  console.log("Validating date ...",pubdate, typeof pubdate);
  let text = /^[0-9]+$/;
  if (pubdate != 0) {
      if ((pubdate != "") && (!text.test(pubdate))) {
          msg = "Please only the year in numeric digits.";
          return msg, false;
      }

      if (pubdate.length < 1) {
          msg = "Year is not proper. Please check";
          return msg, false;
      }
      let current_year=new Date().getFullYear();
      if((pubdate < 0) || (pubdate > current_year + 1))
          {
          msg = "That seems a bit far off in the future. Try again?";
          return msg, false;
          }
      return true;
  }
}

// Event listener for delete
document.getElementById('book-list').addEventListener('click', function (e) {
  // Instantiate UI
  const ui = new UI();
  ui.deleteBook(e.target);

  // Show message
  ui.showAlert('Book removed', 'success');

  e.preventDefault();

})