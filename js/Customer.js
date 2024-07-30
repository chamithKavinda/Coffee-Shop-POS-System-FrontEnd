const customerRegisterForm = document.getElementById("customerRegisterForm");
const customerForm = document.getElementById("customer-form");

//set up event listener
const openCustomerRegisterForm = () => {
    customerRegisterForm.style.display = "block";
}

const closeCustomerRegisterForm = () => {
    customerRegisterForm.style.display = "none";
}

document
  .getElementById("add-customer")
  .addEventListener("click", openCustomerRegisterForm);

  document
  .getElementById("customerRegisterForm-close")
  .addEventListener("click", closeCustomerRegisterForm);