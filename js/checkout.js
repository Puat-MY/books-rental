var cart = localStorage.getItem("cart");
if(cart) cart = JSON.parse(cart);
else cart = [];

// Function to display cart items and calculate the total price
function displayCartItems() {

    if (cart.length === 0) {
        document.getElementById('cart-items-container').textContent = '<p>Your cart is empty.</p>';
        document.getElementById('total-price').textContent = '0.00';
    } else {
        let totalPrice = cart.length*20;
        const cartItemsContainer = document.getElementById('cart-items-container');
        cartItemsContainer.innerHTML = '';

        cart.forEach((item) => {
            const itemElement = document.createElement('div');
            itemElement.innerHTML = `<p>${item.name}</p>`;
            cartItemsContainer.appendChild(itemElement);
        });
        document.getElementById("cart-items-container").textContent = "You have " + cart.length + " items in cart.";
        document.getElementById('total-price').textContent = cart.length + " * RM20.00 = " + totalPrice.toFixed(2);
    }
}

// Function for reading cart array into rentedBooks array
function cartToRented() {
    var rentedBooks = localStorage.getItem("rentedBooks");
    if(rentedBooks) rentedBooks = JSON.parse(rentedBooks);
    else rentedBooks = [];

    cart.forEach(item => {
        rentedBooks.push(item);
    });

    localStorage.setItem("rentedBooks", JSON.stringify(rentedBooks));
    localStorage.removeItem("cart");
}

// Function to handle payment using credit card
function processCreditCardPayment() {
    // Show a success message when payment is successful
    alert('Payment successful! Thank you.');

    cartToRented();

    // Redirect back to index.html
    window.location.href = 'index.html';
}

// Function to generate a random QR code for Touch 'n Go payment
function generateRandomQRCode() {
    const qrCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return qrCode;
}

// Function to prompt Touch 'n Go payment
function promptTouchNGoPayment() {
    // Generate a random QR code
    const qrCode = generateRandomQRCode();

    // Display the generated QR code
    const qrCodeImage = document.getElementById('qrcode');
    qrCodeImage.src = `https://api.qrserver.com/v1/create-qr-code/?data=${qrCode}&size=200x200`;
    
    // Show the Touch 'n Go payment section
    document.getElementById('touchNGoPayment').style.display = 'block';

    // Hide the credit card form (if it's visible)
    document.getElementById('creditCardForm').style.display = 'none';
}

// Function to handle Touch 'n Go payment (simulate)
function completeTouchNGoPayment() {

    // Show a success message when payment is successful
    alert('Payment successful! Thank you.');

    cartToRented();

    // Redirect back to index.html
    window.location.href = 'index.html';
}

// Function to initialize the checkout page
function initializeCheckout() {
    displayCartItems();

    // Listen for payment method selection change
    const paymentMethodRadios = document.getElementsByName('paymentMethod');
    for (const radio of paymentMethodRadios) {
        radio.addEventListener('change', function () {
            const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
            if (selectedPaymentMethod === 'creditCard') {
                document.getElementById('creditCardForm').style.display = 'block';
                document.getElementById('touchNGoPayment').style.display = 'none';
            } else if (selectedPaymentMethod === 'touchNGo') {
                document.getElementById('touchNGoPayment').style.display = 'block';
                document.getElementById('creditCardForm').style.display = 'none';
            }
        });
    }
}

// Initialize the checkout page when the document is ready
document.addEventListener('DOMContentLoaded', function () {
    initializeCheckout();
});

//Exit back to cart.html
function goToCartPage() {
    // Redirect the user to the cart page (you can replace 'cart.html' with your cart page)
    window.location.href = 'cart.html';
}





