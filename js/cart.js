// cart.js

// Initialize an empty cart as an array to store cart items
let cart = [];

// Function to add an item to the cart
function addToCart(productName, price) {
    // Check if the user is logged in
    const userEmail = localStorage.getItem('userEmail');

    if (!userEmail) {
        // If not logged in, prompt the user to log in
        alert('Please sign in to add items to your cart.');
        // Redirect the user to the login page (you can replace 'signin.html' with your login page)
        window.location.href = 'signin.html';
        return; // Exit the function to prevent adding to the cart
    }

    const item = {
        name: productName,
        price: price,
    };

    // Get the existing cart data from localStorage or initialize an empty array
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Add the new item to the cart
    cart.push(item);

    // Store the updated cart data back in localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    alert(`${productName} has been successfully added to your cart.`);

    // Optionally, you can update the cart display
    updateCartDisplay();
}


// Function to update the cart display
function updateCartDisplay() {
    // Retrieve the cart data from localStorage
    const cart = JSON.parse(localStorage.getItem('cart'));

    // Display the "Your cart is empty." message if the cart is empty
    const cartItemsContainer = document.getElementById('cart-items-container');
    if (!cart || cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cartItemsContainer.innerHTML = ''; // Clear the "Your cart is empty." message

        // Calculate the total price of items in the cart
        const totalPrice = cart.reduce((total, item) => total + item.price, 0);

        // Display cart items and update cart summary
        const cartList = document.getElementById('cart-list');
        const cartSummary = document.getElementById('cart-summary');
        cartList.innerHTML = ''; // Clear the cart list

        cart.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            listItem.innerHTML = `
                ${item.name} - $${item.price}
                <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Remove</button>
            `;
            cartList.appendChild(listItem);
        });

        cartSummary.innerHTML = `
            <p>Total Price: $${totalPrice.toFixed(2)}</p>
            <p>Total Items: ${cart.length}</p>
        `;
    }
}

// Function to remove an item from the cart
function removeFromCart(index) {
    // Retrieve the cart data from localStorage
    const cart = JSON.parse(localStorage.getItem('cart'));

    // Remove the item at the specified index
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
    }

    // Store the updated cart data back in localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update the cart display
    updateCartDisplay();

    // Check if the cart is empty after removal
    if (!cart || cart.length === 0) {
        // Redirect to index.html
        window.location.href = 'index.html';
    }
}



