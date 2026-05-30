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
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const auth = firebase.auth();

// Check Login Status
auth.onAuthStateChanged((user) => {
    if (user && user.email === "riyasharma.official342@gmail.com") {
        document.getElementById("login-box").classList.add("hidden");
        document.getElementById("dashboard").classList.remove("hidden");
        loadOrders(); // Orders load karein
    } else {
        document.getElementById("login-box").classList.remove("hidden");
        document.getElementById("dashboard").classList.add("hidden");
    }
});

// Admin Login Function
function loginAdmin() {
    const pass = document.getElementById("admin-password").value;
    const email = "riyasharma.official342@gmail.com";

    auth.signInWithEmailAndPassword(email, pass)
        .catch(error => alert("Login Failed: " + error.message));
}

// Admin Logout Function
function logoutAdmin() {
    auth.signOut();
}

// Add Product to Firebase Firestore
function addProduct(e) {
    e.preventDefault();

    const newProduct = {
        name: document.getElementById("prod-name").value,
        price: document.getElementById("prod-price").value,
        category: document.getElementById("prod-category").value,
        image: document.getElementById("prod-image").value,
        badge: document.getElementById("prod-badge").value,
        stock: document.getElementById("prod-stock").value,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    db.collection("products").add(newProduct)
        .then(() => {
            alert("Product successfully added Meesho/Flipkart style!");
            document.getElementById("product-form").reset();
        })
        .catch(err => alert("Error adding product: " + err.message));
}

// Load Orders in Admin Panel
function loadOrders() {
    db.collection("orders").orderBy("timestamp", "desc").onSnapshot(snapshot => {
        const list = document.getElementById("orders-list");
        list.innerHTML = "";

        if(snapshot.empty) {
            list.innerHTML = "<p>No orders yet.</p>";
            return;
        }

        snapshot.forEach(doc => {
            const order = doc.data();
            list.innerHTML += `
                <div class="order-card">
                    <h4>Product: ${order.productName} (₹${order.price})</h4>
                    <p><strong>Customer:</strong> ${order.customerName} (${order.phone})</p>
                    <p><strong>Address:</strong> ${order.address}, ${order.city} - ${order.pincode}</p>
                    <p><strong>Size:</strong> ${order.size}</p>
                    <p><strong>Status:</strong> 
                        <select class="status-select" onchange="updateStatus('${doc.id}', this.value)">
                            <option value="New Order" ${order.status === 'New Order' ? 'selected' : ''}>New Order</option>
                            <option value="Confirmed" ${order.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                            <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                            <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                            <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                    </p>
                </div>
            `;
        });
    });
}

// Update Order Status
function updateStatus(orderId, newStatus) {
    db.collection("orders").document(orderId).update({
        status: newStatus
    }).then(() => alert("Order Status Updated!"));
}
