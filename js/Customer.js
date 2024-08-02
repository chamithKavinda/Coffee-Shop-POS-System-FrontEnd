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

//Clear the text fields
document.getElementById("customer-submit").addEventListener("click", function(){
    document.getElementById("customer-form").style.display = "none";
});

//submit btn implementation
document.getElementById("customerRegisterForm").addEventListener("submit",(event) =>{
    event.preventDefault();

    const id = document.getElementById("customerID").value;
    const name = document.getElementById("customerName").value;
    const address = document.getElementById("customerAddress").value;
    const contact = document.getElementById("customerNumber").value;

    const customerRegisterForm = {
        custId:id,
        custName: name,
        custAddress: address,
        custContact: contact,
    };

    // console.log(customerRegisterForm);

    //create JSON
    const customerJSON = JSON.stringify(customerRegisterForm)
    // console.log(customerJSON)

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

    http.open("POST","http://localhost:8080/Coffee_Shop_POS_JavaEE_Backend_war_exploded/customer",true)

    http.setRequestHeader("Content-Type","application/json")
    http.send(customerJSON)
    console.log(customerJSON)
});