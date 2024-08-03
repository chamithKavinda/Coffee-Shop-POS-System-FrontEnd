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

//submit btn implementation
document.getElementById("productRegisterForm").addEventListener("submit",(event) =>{
    event.preventDefault();

    const id = document.getElementById("productID").value;
    const name = document.getElementById("productName").value;
    const price = document.getElementById("price").value;
    const category = document.getElementById("category").value;
    const quantity = document.getElementById("quantity").value;

    const productRegisterForm = {
        pro_id:id,
        pro_name: name,
        price: price,
        category: category,
        quantity:quantity,
    };



    //create JSON
    const productJSON = JSON.stringify(productRegisterForm)
 

    //Introduce AJAX - Native
    const http = new XMLHttpRequest()

    http.onreadystatechange = ()=>{
            if(http.status == 200){
                var responseTextJSON = JSON.stringify(http.responseText)
                console.log(responseTextJSON)
            }else{
                console.error("Failed");
                console.error("Status" + http.status)
                console.error("Ready Status"+http.readyState)
            }    
    }

    http.open("POST","http://localhost:8080/Coffee_Shop_POS_JavaEE_Backend_war_exploded/product",true)

    http.setRequestHeader("Content-Type","application/json")
    http.send(productJSON)
    console.log(productJSON)
});