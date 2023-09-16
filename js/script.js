
// Function to set the href attribute for all elements with the "rent-now-link" class
function setRentNowLinks() {
    var rentNowLinks = document.querySelectorAll(".rent-now-link");
    for (var i = 0; i < rentNowLinks.length; i++) {
        rentNowLinks[i].setAttribute("href", "browse.html");
    }
}

// Function to store search value as cookie & redirects users to browse.html
function storeSearchSessionStorage(event) {
    event.preventDefault(); // Prevent the default form submission

    var searchValue = document.getElementById("searchInput").value;

    // Store search term to session storage
    sessionStorage.setItem("search", searchValue);

    // Redirect to browse.html
    window.location.href = "browse.html";
}

// Function to GET query results from OpenLibrary
$(document).ready(function() {

    // Query to search for books
    var query = sessionStorage.getItem("search");

    // Define the API endpoint URL
    var apiUrl = "https://openlibrary.org/search.json?q=" + query + "&sorts=title";

    // Make a GET request to the Open Library API
    $.ajax({
        url: apiUrl,
        method: 'GET',
        success: function(response) {
            // Create the table structure
            var table = $('<table>').addClass('table table-striped');
            var thead = $('<thead>').appendTo(table);
            var tbody = $('<tbody>').appendTo(table);

            // Create table headers
            var headers = ['Title', 'Author', 'First Published', 'Action'];
            var headerRow = $('<tr>').appendTo(thead);
            headers.forEach(function(header) {
                $('<th>').text(header).appendTo(headerRow);
            });

            // Populate the table with API response
            response.docs.forEach(function(book) {
                var row = $('<tr>').appendTo(tbody);

                var titleCell = $('<td>').appendTo(row);
                var titleLink = $('<a>').attr('href', 'https://openlibrary.org' + book.key).text(book.title);
                if (book.title && book.key) {
                    titleCell.append(titleLink);
                } else {
                    titleCell.text('N/A');
                }
                $('<td>').text(book.author_name ? book.author_name.join(', ') : 'N/A').appendTo(row);
                $('<td>').text(book.first_publish_year || 'N/A').appendTo(row);

                var buttonLink = $('<button onclick="rentInit(event)">').attr('value', JSON.stringify(book)).text("Rent");
                var isAlreadyRented = rentedBooks.some(function (bookJSON) {
                    var arrBook = JSON.parse(bookJSON);
                    return arrBook.key === book.key;
                });
                if(isAlreadyRented) buttonLink.addClass("btn btn-secondary");
                else buttonLink.addClass("btn btn-primary");
                $('<td>').appendTo(row).append(buttonLink);
            });
            // Display response in table form
            $('#searchOutput').html(table);
        },
        error: function(xhr, status, error) {
            // Handle errors
            console.error('Error:', error);
        }
    });

});

// Function triggered on submission of rent request
function rentInit(event) {
    event.preventDefault();
    
    // Parse the selected book from the button's value
    var selectedBook = event.target.value;

    // Check if the selected book is already in the rentedBooks array
    var isAlreadyRented = rentedBooks.some(function (bookJSON) {
        var book = bookJSON;
        return book === selectedBook;
    });

    if (isAlreadyRented) {
        alert("You have already rented this book.");
    } else {
        alert("You have successfully rented this book!");
        rentedBooks.push(event.target.value); // Store book into rental history
        localStorage.setItem("rentedBooks", JSON.stringify(rentedBooks));
        event.target.className = "btn btn-secondary"
    }
}

function createTable(header, array) {
    var table = document.createElement("table");
    table.className = "table table-striped";

    // Create table header
    var thead = document.createElement("thead");
    var headerRow = document.createElement("tr");
    for(var i in header) {
        var temp = document.createElement("th");
        temp.textContent = header[i];
        headerRow.appendChild(temp);
    }
    thead.appendChild(headerRow);

    // Sort array in ascending order of title
    array.sort((a, b) => {
        a = JSON.parse(a);
        b = JSON.parse(b);
        if(a.title.toLowerCase() > b.title.toLowerCase()) return 1;
        else if (a.title.toLowerCase() == b.title.toLowerCase()) return 0;
        else return -1;
    });

    var tbody = document.createElement("tbody");
    array.forEach(function (bookJSON) {
        var book = JSON.parse(bookJSON);
        var row = document.createElement("tr");

        var titleCell = document.createElement("td");
        titleCell.textContent = book.title || "N/A";

        var authorCell = document.createElement("td");
        authorCell.textContent = book.author_name ? book.author_name.join(', ') : 'N/A';

        var returnBtn = document.createElement("button");
        returnBtn.innerHTML = "Return";
        returnBtn.className = "btn btn-primary";
        returnBtn.value = bookJSON;
        returnBtn.addEventListener("click", returnBook);
        var returnBtnCell = document.createElement("td");
        returnBtnCell.appendChild(returnBtn);
        row.appendChild(titleCell);
        row.appendChild(authorCell);
        row.appendChild(returnBtnCell);
        tbody.appendChild(row);
    });

    // Create table
    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
}

// Function to display rented books
function displayRentedBooks() {
    const rentedBooksContainer = document.getElementById('historyTable');

     // Clear the contents of the rentedBooksContainer
     rentedBooksContainer.innerHTML = '';

    // Get rented books from local storage as objects
    const rentedBooks = JSON.parse(localStorage.getItem('rentedBooks')) || [];

    if (rentedBooks.length === 0) {
        rentedBooksContainer.innerHTML = '<p>You have no rented books yet.</p>';
    } else {
        // Create an HTML table to display rented books
        const table = document.createElement('table');
        table.className = 'table table-striped';

        // Create table headers
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        ['Title', 'Author', 'Action'].forEach(function (header) {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        // Create table body
        const tbody = document.createElement('tbody');

        rentedBooks.forEach(function (book) { // Loop through objects directly
            // Create a row for each rented book
            const row = document.createElement('tr');

            const titleCell = document.createElement('td');
            titleCell.textContent = book.name || 'N/A'; // Access 'name' property

            const authorCell = document.createElement('td');
            authorCell.textContent = book.author || 'N/A'; // You can access 'author' property if it exists

            const returnBtn = document.createElement('button');
            returnBtn.innerHTML = 'Return';
            returnBtn.className = 'btn btn-primary';
            returnBtn.value = JSON.stringify(book); // Store the object as JSON string
            returnBtn.addEventListener('click', returnBook);

            const returnBtnCell = document.createElement('td');
            returnBtnCell.appendChild(returnBtn);

            row.appendChild(titleCell);
            row.appendChild(authorCell);
            row.appendChild(returnBtnCell);

            tbody.appendChild(row);
        });

        // Append the header and body to the table
        table.appendChild(thead);
        table.appendChild(tbody);

        // Append the table to the container
        rentedBooksContainer.appendChild(table);
    }
}



// Function to handle returning a rented book
function returnBook(event) {
    event.preventDefault();

    // Get the selected book from the button's value
    const selectedBook = JSON.parse(event.target.value);

    // Get the rentedBooks from localStorage
    const rentedBooks = JSON.parse(localStorage.getItem('rentedBooks')) || [];

    // Check if the selected book matches any rented book in the array
    const indexToRemove = rentedBooks.findIndex(function (book) {
        return book.name === selectedBook.name && book.author === selectedBook.author;
    });

    if (indexToRemove !== -1) {
        // Remove the selected book from rentedBooks array
        rentedBooks.splice(indexToRemove, 1);

        // Update the rentedBooks array in local storage
        localStorage.setItem('rentedBooks', JSON.stringify(rentedBooks));

        // Refresh the rented books display
        displayRentedBooks();
    } else {
        alert('This book is not currently rented.');
    }
}




// Execute these lines when page loads
window.addEventListener("load", setRentNowLinks);

var searchBar = document.getElementById("searchBar");
if(searchBar)
    document.getElementById("searchBar").addEventListener("submit", storeSearchSessionStorage);

var contactForm = document.getElementById("contactForm");
if(contactForm)
    document.getElementById("contactForm").addEventListener("submit", submitContactForm);

function updateNavigation() {
    const signinNav = document.getElementById('signin-nav');
    const rentedBooksNav = document.getElementById('rented-books-nav'); 
    const cartNav = document.getElementById('cart-nav')
    const logoutNav = document.getElementById('logout-nav'); // New element
    const userEmail = localStorage.getItem('userEmail');

    if (userEmail) {
        // Replace "Sign In" with the user's email and show "Logout" link
        signinNav.innerHTML = ``;
        logoutNav.style.display = 'block';
        rentedBooksNav.style.display = 'block';
        cartNav.style.display = 'block';
    } else {
        // If not logged in, show "Sign In" link and hide "Logout" link
        signinNav.innerHTML = `<a class="nav-link" href="signin.html">Sign In</a>`;
        logoutNav.style.display = 'none';
        rentedBooksNav.style.display = 'none';
        cartNav.style.display = 'none';
    }
}


