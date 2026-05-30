// ===== BASIC SHOP SYSTEM =====

let cart = [];

// Product Add to Cart
function addToCart(name, price, code) {
    cart.push({ name, price, code });
    alert(name + " added to cart!");
}

// Show Cart
function showCart() {
    let msg = "YOUR CART:\n\n";
    cart.forEach((item, index) => {
        msg += `${index + 1}. ${item.name} - ₹${item.price} (Code: ${item.code})\n`;
    });
    alert(msg);
}

// WhatsApp Order Function
function orderNow(productName, productCode, price) {

    let phone = "7678292592";

    let message = `NEW ORDER - Tanu Juely Shop

Product: ${productName}
Code: ${productCode}
Price: ₹${price}

Customer Details:
Name:
Mobile:
Address:
City:
Pincode:

Thank you!`;

    let url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
}

// Simple Search Filter
function searchProduct() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let products = document.querySelectorAll(".product");

    products.forEach(product => {
        let text = product.innerText.toLowerCase();
        if (text.includes(input)) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
      }
