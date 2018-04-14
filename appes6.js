class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {

  addBookToList(book) {
    const list = document.getElementById('book-list');
    // Create element 
    const row = document.createElement('tr');
    // Insert cols
    row.innerHTML = `
  <td>${book.title}</td>
  <td>${book.author}</td>
  <td>${book.isbn}</td>
  <td><a href="#" class="delete">X</a></td>
  `;
    list.appendChild(row);
  }

  showAlert(message, className) {
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

  deleteBook(target) {
    if (target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }
  }

  clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }

}

// Local Storage Class
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(function (book) {
      const ui = new UI;

      // Add book to UI
      ui.addBookToList(book);
    });
  }

  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    console.log(isbn);
    const books = Store.getBooks();

    books.forEach(function (book, index) {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

// DOM load event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Event Listeners for add book
document.getElementById('book-form').addEventListener('submit', function (e) {
  // Get form values
  const title = document.getElementById('title').value,
    author = document.getElementById('author').value,
    isbn = document.getElementById('isbn').value

  // Instantiate book
  const book = new Book(title, author, isbn);

  // Instantiate UI
  const ui = new UI();

  console.log(ui);

  // Validate 
  if (title === '' || author === '' || isbn === '') {

    // Error alert
    ui.showAlert("Please fill in all fields", 'error')

    // Validate fields - check if valid ISBN
  } else if (isValidISBN(isbn) === false) {

    // Error alert
    ui.showAlert("Please input a valid ISBN", 'error')
  } else {

    // Add book to list
    ui.addBookToList(book);

    // Add to LS
    // no need to instantiate store since its a static method
    Store.addBook(book);

    // Show success
    ui.showAlert('Book Added!', 'success');

    // Clear fields
    ui.clearFields();
  }

  e.preventDefault();
});


// Validate ISBN

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


// Event listener for delete
document.getElementById('book-list').addEventListener('click', function (e) {
  // Instantiate UI
  const ui = new UI();

  // Delete book
  ui.deleteBook(e.target);

  // Remove from LS
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent)

  // Show message
  ui.showAlert('Book removed', 'success');

  e.preventDefault();

})