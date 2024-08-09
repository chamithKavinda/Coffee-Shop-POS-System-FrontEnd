// $(document).ready(function() {
//     let orderIdElement = $("#order-id");
//     let selectCustomerElement = $("#customerDropDown");
//     let dateElement = $("#current-date");
//     let orderProductElement = $("#order-items");
//     let subTotalElement = $("#sub-total");
//     let discountElement = $("#discount");
//     let totalElement = $("#total");
//     let cashElement = $("#cash");
//     let balanceElement = $("#balance");

//     // Set date
//     let date = new Date();
//     let options = { day: "numeric", month: "long", year: "numeric" };
//     let formatDate = date.toLocaleDateString("en-US", options);
//     dateElement.text(formatDate);

//     // Load Customer Contacts
//     async function popCustomerDropdown() {
//         try {
//             const response = await fetch("http://localhost:8080/Coffee_Shop_POS_JavaEE_Backend_war_exploded/customer");
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             const data = await response.json();
//             customerList = data;
//         } catch (error) {
//             console.error("Error fetching customers:", error);
//         }

//         const customerSelect = selectCustomerElement;
//         customerSelect.empty();

//         let defaultOption = $("<option>").val("").text("Select Customer");
//         customerSelect.append(defaultOption);

//         customerList.forEach((customer) => {
//             let option = $("<option>").val(customer.custContact).text(customer.custContact);
//             customerSelect.append(option);
//         });
//     }

//     // Load Items
//     async function popOrderItems() {
//         try {
//             const response = await fetch("http://localhost:8080/Coffee_Shop_POS_JavaEE_Backend_war_exploded/product");
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             const data = await response.json();
//             productList = data;
//         } catch (error) {
//             console.error("Error fetching products:", error);
//         }

//         const orderProductContainer = orderProductElement;
//         orderProductContainer.empty();

//         productList.forEach((product) => {
//             const productCard = $("<div>").addClass("product-card").attr("data-pro_id", product.product.pro_id);

//             const productName = $("<h4>").addClass("product-name").text(product.product.pro_name);

//             const productInfo = $("<div>").addClass("product-info");

//             const productPrice = $("<h2>").addClass("product-price").text(`Rs${product.product.price}`);

//             const productCount = $("<span>").addClass("product-count").text(`${product.product.quantity} Products`).attr("data-quantity", product.product.quantity);

//             productInfo.append(productPrice, productCount);
//             productCard.append(productName, productInfo);
//             orderProductContainer.append(productCard);

//             productCard.on("click", () => addProductToCart(product.product, productCount));
//         });
//     }

//     // Load Order ID
//     async function loadOrderId() {
//         try {
//             const response = await fetch("http://localhost:8080/Coffee_Shop_POS_JavaEE_Backend_war_exploded/orders");
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const data = await response.json();
//             orderIdElement.text("Order ID: " + data.orderId);
//         } catch (error) {
//             console.error("Error fetching orderId", error);
//         }
//     }

//     // Add event listener
//     selectCustomerElement.on("change", function() {
//         let selectedCustomerContact = $(this).val();
//         let selectedCustomer = customerList.find((customer) => customer.custContact === selectedCustomerContact);
//         if (selectedCustomer) {
//             $("#name-holder").text("Name: " + selectedCustomer.name);
//         }
//     });

//     function addProductToCart(product, productCountElement) {
//         const productCount = parseInt(productCountElement.data("quantity"), 10);

//         if (productCount <= 0) {
//             alert(`Item ${product.productName} is out of stock.`);
//             return;
//         }

//         const existingProduct = cart.find((cartProduct) => cartProduct.pro_id === product.pro_id);
//         if (existingProduct) {
//             existingProduct.quantity += 1;
//         } else {
//             cart.push({ ...product, quantity: 1 });
//         }

//         productCountElement.data("quantity", productCount - 1).text(`${productCount - 1} Products`);

//         updateCartDisplay();
//     }

//     function removeProductFromCart(pro_id) {
//         const productIndex = cart.findIndex((cartProduct) => cartProduct.pro_id === pro_id);
//         if (productIndex === -1) return;

//         const product = cart[productIndex];
//         const productCountElement = $(`.product-card[data-pro_id='${pro_id}'] .product-count`);

//         const currentQty = parseInt(productCountElement.data("quantity"), 10);
//         productCountElement.data("quantity", currentQty + product.quantity).text(`${currentQty + product.quantity} Products`);

//         cart.splice(productIndex, 1);

//         updateCartDisplay();
//     }

//     function updateCartDisplay() {
//         const cartProductContainer = $("#cart-items");
//         cartProductContainer.empty();
//         let subTotal = 0;

//         cart.forEach((cartProduct) => {
//             const cartProductDiv = $("<div>").addClass("cart-product");

//             const cartProductName = $("<p>").addClass("cart-product-name").text(`${cartProduct.pro_name} x ${cartProduct.quantity}`);

//             const productTotalPrice = cartProduct.price * cartProduct.quantity;
//             const cartProductPrice = $("<p>").text(`Rs${productTotalPrice.toFixed(2)}`);

//             const removeButton = $("<button>").text("❌").addClass("remove-button-cart").on("click", () => removeProductFromCart(cartProduct.pro_id));

//             subTotal += productTotalPrice;

//             cartProductDiv.append(cartProductName, cartProductPrice, removeButton);
//             cartProductContainer.append(cartProductDiv);
//         });

//         const discount = parseFloat(discountElement.val()) || 0;
//         const cash = parseFloat(cashElement.val()) || 0;
//         const total = subTotal - discount;
//         const balance = cash - total;

//         subTotalElement.text(`Rs${subTotal.toFixed(2)}`);
//         totalElement.text(`Rs${total.toFixed(2)}`);
//         balanceElement.text(`Rs${balance.toFixed(2)}`);
//     }

//     // Add event listeners for update cart
//     cashElement.on("input", updateCartDisplay);
//     discountElement.on("input", updateCartDisplay);

//     $("#purchase").on("click", purchase);

//     async function purchase() {
//         const orderId = orderIdElement.text().slice(10);
//         const cashInput = cashElement.val();
//         const customer = selectCustomerElement.val();
//         const balance = parseFloat(balanceElement.text().slice(2));
//         const subTotal = parseFloat(subTotalElement.text().slice(2));
//         const discount = parseFloat(discountElement.val()) || 0;
//         const total = parseFloat(totalElement.text().slice(2));
//         const cash = parseFloat(cashElement.val()) || 0;

//         if (customer === "") {
//             alert("Customer Contact required");
//             return;
//         }

//         if (cart.length === 0) {
//             alert("No products in the cart");
//             return;
//         }

//         if (!cashInput) {
//             alert("Cash input is required");
//             return;
//         }

//         if (balance < 0) {
//             alert("Invalid cash provided");
//             return;
//         }

//         const orderDetails = {
//             // Add the necessary order details here
//         };

//         try {
//             const response = await fetch("http://localhost:8080/Coffee_Shop_POS_JavaEE_Backend_war_exploded/orders", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(orderDetails),
//             });

//             if (response.ok) {
//                 const result = await response.text();
//                 alert(result);
//                 resetOrder();
//             } else {
//                 const errorText = await response.text();
//                 alert(`Operation failed: ${errorText}`);
//             }
//         } catch (error) {
//             console.error("Error:", error);
//             alert("Error processing order data");
//         }
//     }

//     function resetOrder() {
//         loadOrderId();

//         cart.length = 0;
//         cashElement.val("");
//         discountElement.val("");
//         updateCartDisplay();
//     }

//     popCustomerDropdown();
//     popOrderItems();
// });


let orderIdElement = document.getElementById("order-id");
let selectCustomerElement = document.getElementById("customerDropDown");
let dateElement = document.getElementById("current-date");
let orderProductElement = document.getElementById("order-items");
let subTotalElement = document.getElementById("sub-total");
let discountElement = document.getElementById("discount");
let totalElement = document.getElementById("total");
let cashElement = document.getElementById("cash");
let balanceElement = document.getElementById("balance");


//set date
let date = new Date();
let options = { day:"numeric", month:"long", year: "numeric"};
let formatDate = date.toLocaleDateString("en-US",options);
dateElement.textContent = formatDate;

//load Customer Contacts
async function popCustomerDropdown(){
    //Getting data form Backend
    try{
        const response = await fetch("http://localhost:8080/Coffee_Shop_POS_JavaEE_Backend_war_exploded/customer");
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        customerList = data;
    }catch (error){
        console.error("Error fetching customers:", error);
    }

    const customerSelect = selectCustomerElement;
    customerSelect.innerHTML = "";

    let defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "Select Customer";
    customerSelect.appendChild(defaultOption);

    //Add the customer option
    customerList.forEach((customer) => {
        let option = document.createElement("option");
        option.value = customer.custContact;
        option.text = customer.custContact;
        customerSelect.appendChild(option);
    });
}


//Load Items
async function popOrderItems(){
    try{
        const response = await fetch("http://localhost:8080/Coffee_Shop_POS_JavaEE_Backend_war_exploded/product");
        if(!response.ok){
            throw new Error(`HTTP error! status : ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        productList = data;
    }catch(error){
        console.error("Error fetching customers:", error);
    }

    const orderProductContainer = orderProductElement;
    orderProductContainer.innerHTML = "";

    productList.forEach((product) => {
        
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        productCard.dataset.pro_id = product.pro_id;

        const productName = document.createElement("h4");
        productName.className = "product-name";
        productName.textContent = product.pro_name;
    
        const productInfo = document.createElement("div");
        productInfo.className = "product-info";
    
        const productPrice = document.createElement("h2");
        productPrice.className = "product-price";
        productPrice.textContent = `Rs${product.price}`;
    
        const productCount = document.createElement("span");
        productCount.className = "product-count";
        productCount.textContent = `${product.quantity} Products`;
        productCount.dataset.quantity = product.quantity;
    
        // Append the price and count to the product info div
        productInfo.appendChild(productPrice);
        productInfo.appendChild(productCount);
    
        // Append the product name and product info to the product card
        productCard.appendChild(productName);
        productCard.appendChild(productInfo);
    
        // Finally, append the product card to the main container (not shown in your code)
        orderProductContainer.appendChild(productCard);
    
        productCard.addEventListener("click", () => addProductToCart(product , productCount));
    });    
}

async function loadOrderId() {
    try{
        const response = await fetch("http://localhost:8080/Coffee_Shop_POS_JavaEE_Backend_war_exploded/orders");
    
        if(!response.ok){
            throw new Error(`HTTP error1 status: ${response.status}`);
        }

        const data = await response.json();
        orderIdElement.textContent = "Order ID : " + data;
    }catch(error){
        console.error("Error fetching orderId",error);
    }
}

//Add an Event listener
selectCustomerElement.addEventListener("change",function(){
    let selectedCustomerContact = this.value;
    let selectedCustomer = customerList.find(
        (customer) => customer.custContact === selectedCustomerContact
    );
    if(selectedCustomer){
        document.getElementById("name-holder").textContent = "Name: ";
    }
});


function addProductToCart(product,productCountElement){

    const productCount = parseInt(productCountElement.dataset.quantity,10);

    if(productCount <=0){
        alert(`Item ${product.productName} is out of stock.`);
        return;
    }

    const existingProduct = cart.find((cartProduct) => cartProduct.pro_id === product.pro_id);
    if(existingProduct){
        existingProduct.quantity += 1;
    }else{
        cart.push({...product,quantity: 1});
    }

    productCountElement.dataset.quantity = productCount -1;
    productCountElement.textContent = `${productCount - 1} Products`

    updatCartDisplay();
}

function removeProductFromCart(pro_id){
    const productIndex = cart.findIndex((cartProduct) => cartProduct.pro_id === pro_id);
    if(productIndex === -1) return;

    const product = cart[productIndex];

    console.log(pro_id);
    const productCountElement = document.querySelector(`.product-card[data-pro_id='${pro_id}'] .product-count`);

    const currentQty = parseInt(productCountElement.dataset.quantity,10);
    productCountElement.dataset.quantity = currentQty + product.quantity;
    productCountElement.textContent = `${currentQty + product.quantity} Products`;

    cart.splice(productIndex,1);

    updatCartDisplay();
}

function updatCartDisplay(){
    const cartProductContainer = document.getElementById("cart-items");
    cartProductContainer.innerHTML = "";
    let subTotal = 0;

    cart.forEach((cartProduct) => {
        const cartProductDiv = document.createElement("div");
        cartProductDiv.className = "cart-product";

        const cartProductName = document.createElement("p");
        cartProductName.className = "cart-product-name";
        cartProductName.textContent = `${cartProduct.pro_name} x ${cartProduct.quantity}`;

        const cartProductPrice = document.createElement("p");
        const productTotalPrice = cartProduct.price * cartProduct.quantity;
        

        cartProductPrice.textContent = `RS${productTotalPrice.toFixed(2)}`;

        
        const removeButton = document.createElement("button");
        removeButton.textContent = "❌";
        removeButton.className = "remove-button-cart";
        removeButton.addEventListener("click" , () =>
            removeProductFromCart(cartProduct.pro_id)
        );

        subTotal += productTotalPrice;

    

        cartProductDiv.appendChild(cartProductName);
        cartProductDiv.appendChild(cartProductPrice);
        cartProductDiv.appendChild(removeButton);
        cartProductContainer.appendChild(cartProductDiv);
    });

    console.log(subTotal);
    console.log(parseFloat(discountElement.value));
    console.log(parseFloat(cashElement.value));
    

    const discount = parseFloat(discountElement.value) || 0;
    const cash = parseFloat(cashElement.value) || 0;
    const total = subTotal - discount;
    const balance = cash - total;


    subTotalElement.textContent = `Rs${subTotal.toFixed(2)}`;
    totalElement.textContent = `Rs${total.toFixed(2)}`;
    balanceElement.textContent = `Rs${balance.toFixed(2)}`;
}

//add event listener for update cart
document.getElementById("cash").addEventListener("input",updatCartDisplay);

document
    .getElementById("discount")
    .addEventListener("input",updatCartDisplay);

document.getElementById("purchase").addEventListener("click",purchase);

async function purchase(){
    const orderId = orderIdElement.textContent.slice(10);
    const cashInput = cashElement.value;
    const customer = customElements.value;
    const balance = parseFloat(balanceElement.textContent.slice(2));
    const subTotal = parseFloat(subTotalElement.textContent.slice(2));
    const discount = parseFloat(discountElement.value) || 0;
    const total = parseFloat(totalElement.textContent.slice(2));
    const cash = parseFloat(cashElement.value) || 0;

    if(customer===""){
        alert("Customer Contact required");
        return;
    }

    if(cart.length === 0){
        alert("No products in the cart");
        return;
    }

    if(!cashInput){
        alert("Cash input is required");
        return;
    }

    if(balance < 0){
        alert("Invalid cash provided");
        return;
    }

    const orderDetails = {
        order_id: orderId,
        dateAndTime: "2024-08-05T22:00:00",
        contact: customer ,
        orderDetails: cart
    };

    try{
        const response = await fetch("http://localhost:8080/Coffee_Shop_POS_JavaEE_Backend_war_exploded/orders",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderDetails),
        });

        if(response.ok){
            const result = await response.text();
            alert("Purchase successful! " + result);
            resetOrder();
        }else{
            const errorText = await response.text();
            alert(`Operation failed: ${errorText}`);
        }
    }catch(error){
        console.error("Error:",error);
        alert("Error processing order data");
    }
}

function resetOrder(){
    loadOrderId();

    cart.length = 0;
    cashElement.value = "";
    discountElement.value = "";
    updatCartDisplay();

}

popCustomerDropdown();
popOrderItems();

loadOrderId();


