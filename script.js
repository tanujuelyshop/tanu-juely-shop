// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHnLupt5wKGvBXxwH8xW8CktMGiPtm7_g",
  authDomain: "tanu-juely-shop.firebaseapp.com",
  projectId: "tanu-juely-shop",
  storageBucket: "tanu-juely-shop.firebasestorage.app",
  messagingSenderId: "871557002619",
  appId: "1:871557002619:web:4394cd9eca8ca068cef9de",
  measurementId: "G-Y42N0N6F0W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let allProducts = [];
let currentProduct = null;

// Firebase se Products fetch karna
db.collection("products").onSnapshot((snapshot) => {
    allProducts = [];
    snapshot.forEach((doc) => {
        allProducts.push({ id: doc.id, ...doc.data() });
    });
    renderProducts(allProducts);
});

// Products ko screen par dikhana
function renderProducts(products) {
    const container = document.getElementById("product-container");
    container.innerHTML = "";
    
    products.forEach(prod => {
        container.innerHTML += `
            <div class="product-card">
                <img src="${prod.image || 'https://via.placeholder.com/150'}" alt="${prod.name}">
                <span class="badge">${prod.badge || 'New'}</span>
                <h3>${prod.name}</h3>
                <p class="price">₹${prod.price}</p>
                <p class="stock">${prod.stock === 'In Stock' ? '🟢 In Stock' : '🔴 Out of Stock'}</p>
                <button onclick="openOrderModal('${prod.id}')" ${prod.stock !== 'In Stock' ? 'disabled' : ''}>Order Now</button>
            </div>
        `;
    });
}

// Order Form Open Karna
function openOrderModal(productId) {
    currentProduct = allProducts.find(p => p.id === productId);
    document.getElementById("order-modal").style.display = "block";
}

function closeOrderModal() {
    document.getElementById("order-modal").style.display = "none";
}

// Order Submit karna (Database + WhatsApp)
function submitOrder(e) {
    e.preventDefault();

    const orderData = {
        productName: currentProduct.name,
        price: currentProduct.price,
        customerName: document.getElementById("cust-name").value,
        phone: document.getElementById("cust-phone").value,
        address: document.getElementById("cust-address").value,
        city: document.getElementById("cust-city").value,
        pincode: document.getElementById("cust-pincode").value,
        size: document.getElementById("cust-size").value,
        status: "New Order",
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    // 1. Database me save karein (Option B)
    db.collection("orders").add(orderData).then(() => {
        // 2. WhatsApp par redirect karein
        const whatsappNumber = "7678292592";
        const message = `NEW ORDER - Tanu Juely Shop\n\nProduct: ${orderData.productName}\nPrice: ₹${orderData.price}\n\nName: ${orderData.customerName}\nMobile: ${orderData.phone}\nAddress: ${orderData.address}, ${orderData.city} - ${orderData.pincode}\nSize: ${orderData.size}`;
        
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
        
        closeOrderModal();
        document.getElementById("order-form").reset();
    });
}

// Language Switcher Function (Basic Demo)
function switchLanguage() {
    const lang = document.getElementById("lang-switch").value;
    if(lang === "hi") {
        document.getElementById("search-bar").placeholder = "सामान खोजें...";
        document.getElementById("form-title").innerText = "ऑर्डर की जानकारी";
    } else {
        document.getElementById("search-bar").placeholder = "Search products...";
        document.getElementById("form-title").innerText = "Checkout Details";
    }
}

// Search Function
function searchProducts() {
    const query = document.getElementById("search-bar").value.toLowerCase();
    const filtered = allProducts.filter(p => p.name.toLowerCase().includes(query));
    renderProducts(filtered);
}
