const customerRegisterForm = document.getElementById("customerRegisterForm");

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