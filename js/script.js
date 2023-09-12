// Function to set the href attribute for all elements with the "rent-now-link" class
function setRentNowLinks() {
    var rentNowLinks = document.querySelectorAll(".rent-now-link");
    for (var i = 0; i < rentNowLinks.length; i++) {
        rentNowLinks[i].setAttribute("href", "browse.html");
    }
}

// Function to store search value as cookie & redirects users to browse.html
function storeSearchCookie(event) {
    event.preventDefault(); // Prevent the default form submission

    var searchValue = document.getElementById("searchInput").value;
    // Set a cookie named "search" with the search value
    document.cookie = "search=" + searchValue + "; expires=Thu, 01 Jan 2025 00:00:00 UTC; path=/";

    // Redirect to browse.html
    window.location.href = "browse.html";
}

// Call the function when the page loads
window.addEventListener("load", setRentNowLinks);

document.getElementById("searchBooks").addEventListener("submit", storeSearchCookie);