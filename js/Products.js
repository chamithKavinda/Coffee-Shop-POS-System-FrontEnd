const productRegisterForm = document.getElementById("productRegisterForm");

//set up event listener
const openProductRegisterForm = () => {
    productRegisterForm.style.display = "block";
}

const closeProductRegisterForm = () => {
    productRegisterForm.style.display = "none";
}

document
  .getElementById("add-product")
  .addEventListener("click", openProductRegisterForm);

  document
  .getElementById("productRegisterForm-close")
  .addEventListener("click", closeProductRegisterForm);