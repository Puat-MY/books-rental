var rentedBooks = localStorage.getItem("rentedBooks");
if(rentedBooks) rentedBooks = JSON.parse(rentedBooks);
else rentedBooks = [];
var cart = localStorage.getItem("cart");
if(cart) cart = JSON.parse(cart);
else cart = [];

// Function to set the href attribute for all elements with the "rent-now-link" class
function setRentNowLinks() {
    var rentNowLinks = document.querySelectorAll(".rent-now-link");
    for (var i = 0; i < rentNowLinks.length; i++) {
        rentNowLinks[i].setAttribute("href", "browse.html");
    }
}

// Function to store search value to sessionStorage & redirects users to browse.html
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

                var buttonLink = $('<button onclick="addToCart(event)">').attr('value', JSON.stringify(book)).text("Add to Cart");
                var isInCart= cart.some(function (bookJSON) {
                    var temp = JSON.parse(bookJSON);
                    return temp.key === book.key;
                });
                if(isInCart) buttonLink.addClass("btn btn-secondary");
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

function addToCart(event) {
    event.preventDefault();
    // Check if the user is logged in
    const userEmail = localStorage.getItem('userEmail');

    if (!userEmail) {
        // If not logged in, prompt the user to log in
        alert('Please sign in to add items to your cart.');
        // Redirect the user to the login page (you can replace 'signin.html' with your login page)
        window.location.href = 'signin.html';
        return; // Exit the function to prevent adding to the cart
    }

    // Get the existing cart data from localStorage or initialize an empty array
    var book = event.target.value;
    var isInCart = cart.some(function (bookJSON) {
        return bookJSON === book;
    });

    if (isInCart) {
        alert("You have already rented this book.");
    } else {
        // Add the new item to the cart
        cart.push(book);

        // Store the updated cart data back in localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        event.target.className = "btn btn-secondary";

        book = JSON.parse(book);
        alert(`${book.title} has been successfully added to your cart.`);
    }

}

// Function triggered on submission of rent request
function rentInit(event) {
    event.preventDefault();

    // Allow rent book only after login
    var email = localStorage.getItem("userEmail");
    if(!email) {
        alert("You are not signed in yet! Please sign in to rent books!");
        return;
    }
    
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

// Function for printing rented books
function printRentedBooks() {

    var outputTable = document.getElementById("historyTable");

    if(!outputTable) return; // Check if historyTable exists in current page. End (return) function if not found.

    var headers = ["Title", "Author", "Action"];
    outputTable.innerHTML = ""; // Clear the previous content

    if (rentedBooks.length === 0) {
        outputTable.innerHTML = "You haven't rented any books yet.";
    } else {
        outputTable.appendChild(createTable(headers, rentedBooks));
    }
}

//Written by Phua
//contact.html
// Handle form submission
function submitContactForm(event) {
    event.preventDefault();

    var contactForm = document.getElementById("contactForm");

    if(!contactForm) return;

    alert("Thank you for your message! We will get back to you soon.");

    // Clear the form fields
    document.write(contactForm.innerHTML);
};

function returnBook(event) {
    event.preventDefault();
    var outputTable = document.getElementById("historyTable");
    var headers = ["Title", "Author", "Action"];
    rentedBooks.splice(rentedBooks.indexOf(event.target.value), 1);
    outputTable.innerHTML = "";
    outputTable.appendChild(createTable(headers, rentedBooks));
    localStorage.setItem("rentedBooks", JSON.stringify(rentedBooks));
}

function updateNavigation() {
    const signinNav = document.getElementById('signin-nav');
    const rentedBooksNav = document.getElementById('rented-books-nav'); 
    const logoutNav = document.getElementById('logout-nav');
    const cartBtn = document.getElementById("cart-nav");
    const userEmail = localStorage.getItem('userEmail');

    if (userEmail) {
        // Replace "Sign In" with the user's email and show "Logout" link
        signinNav.innerHTML = ``;
        logoutNav.style.display = 'block';
        rentedBooksNav.style.display = 'block';
        cartBtn.style.display = "block";
        
    } else {
        // If not logged in, show "Sign In" link and hide "Logout" link
        signinNav.innerHTML = `<a class="nav-link" href="signin.html">Sign In</a>`;
        logoutNav.style.display = 'none';
        rentedBooksNav.style.display = 'none';
    }
}

// Setup logout functionality when user clicks "Logout" in header bar
document.addEventListener('DOMContentLoaded', function () {
    const logoutLink = document.getElementById('logout-link');

    logoutLink.addEventListener('click', () => {
        // Remove the user's email from local storage
        localStorage.clear();
        sessionStorage.clear();
        // Redirect the user to the login page (you can replace 'signin.html' with your login page)
        window.location.href = 'signin.html';
    });
});

// Execute these lines when page loads
window.addEventListener("load", setRentNowLinks);
window.addEventListener("load", printRentedBooks);
window.addEventListener("load", updateNavigation);

var searchBar = document.getElementById("searchBar");
if(searchBar)
    document.getElementById("searchBar").addEventListener("submit", storeSearchSessionStorage);

var contactForm = document.getElementById("contactForm");
if(contactForm)
    document.getElementById("contactForm").addEventListener("submit", submitContactForm);