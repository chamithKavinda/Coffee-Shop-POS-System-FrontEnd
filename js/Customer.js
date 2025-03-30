// $(document).ready(function() {
//     const $customerRegisterForm = $("#customerRegisterForm");
//     const $customerForm = $("#customer-form");
//     const $customerButton = $("#customer-submit");
//     const $customerTableList = $("#customer-table-list");
//     const $registerTitle = $("#registerTitle");
//     let isUpdateMode = false;
//     let currentCustomerContact = null;

//     const showToast = (message, type = "success") => {
//         const $toast = $("#toast");
//         $toast.removeClass("success error");
//         $toast.addClass(type);
//         $toast.text(message);
//         $toast.addClass("show");
//         setTimeout(() => {
//             $toast.removeClass("show");
//         }, 3000);
//     };

//     const openCustomerRegisterForm = () => {
//         $customerRegisterForm.show();
//         $registerTitle.text("Register Customer");
//     };

//     const closeCustomerRegisterForm = () => {
//         $customerRegisterForm.hide();
//         $customerForm[0].reset();
//         $customerButton.text("Submit");
//         isUpdateMode = false;
//         currentCustomerContact = null;
//     };

//     $("#add-customer").on("click", openCustomerRegisterForm);
//     $("#customerRegisterForm-close").on("click", closeCustomerRegisterForm);

//     $("#customer-submit").on("click", function() {
//         $customerRegisterForm.hide();
//     });

//     const loadCustomersIntoTable = async () => {
//         await loadCustomersDataFromBackend();
//         $customerTableList.empty();
//         customerDataList.forEach((customer) => {
//             addCustomerDataToTable(customer, $customerTableList);
//         });
//     };

//     const loadCustomersDataFromBackend = async () => {
//         try {
//             const response = await fetch("http://localhost:8080/Coffee_Shop_POS_JavaEE_Backend_war_exploded/customer");
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             const data = await response.json();
//             customerDataList = data;
//         } catch (error) {
//             console.error("Error fetching customers:", error);
//         }
//     };

//     const addCustomerDataToTable = (customer, table) => {
//         const $row = $("<tr>");
//         const nameList = ["custId", "custName", "custAddress", "custContact"];

//         nameList.forEach((key) => {
//             const $cell = $("<td>").text(customer[key]);
//             $row.append($cell);
//         });

//         const $updateCell = $("<td>");
//         const $updateButton = $("<button>").text("Update").addClass("action-button");
//         $updateButton.on("click", () => {
//             openCustomerRegisterForm();
//             fillFormCustomerData(customer);
//             $registerTitle.text("Update Customer");
//             isUpdateMode = true;
//             currentCustomerContact = customer.custContact;
//             $customerButton.text("Update");
//         });
//         $updateCell.append($updateButton);
//         $row.append($updateCell);

//         const $removeCell = $("<td>");
//         const $removeButton = $("<button>").text("Remove").addClass("action-button");
//         $removeButton.on("click", async () => {
//             const confirmation = confirm(`Are you sure you want to remove customer ${customer.custContact}?`);
//             if (confirmation) {
//                 try {
//                     const response = await fetch(`http://localhost:8080/Coffee_Shop_POS_JavaEE_Backend_war_exploded/customer?contact=${customer.custContact}`, {
//                         method: "DELETE",
//                     });

//                     if (response.ok) {
//                         $row.remove();
//                         customerDataList = customerDataList.filter((c) => c.custContact !== customer.custContact);
//                         showToast("Customer Deleted Successfully", "success");
//                     } else {
//                         const errorText = await response.text();
//                         showToast(`Error removing customer: ${errorText}`, "error");
//                     }
//                 } catch (error) {
//                     showToast("Error removing customer", "error");
//                 }
//             }
//         });
//         $removeCell.append($removeButton);
//         $row.append($removeCell);
//         table.append($row);
//     };

//     const fillFormCustomerData = (customer) => {
//         $("#customerID").val(customer.custId);
//         $("#customerName").val(customer.custName);
//         $("#customerAddress").val(customer.custAddress);
//         $("#customerNumber").val(customer.custContact);
//     };

//     const validatecustId = (custId) => /^C\d{3}$/.test(custId);
//     const validatecustName = (custName) => /^[a-zA-Z\s]+$/.test(custName);
//     const validatecustAddress = (custAddress) => custAddress.trim() !== "";
//     const validatecustContact = (custContact) => /^[0-9]{10}$/.test(custContact);

//     $customerForm.on("submit", async (event) => {
//         event.preventDefault();

//         const custId = $("#customerID").val();
//         const custName = $("#customerName").val();
//         const custAddress = $("#customerAddress").val();
//         const custContact = $("#customerNumber").val();

//         if (!validatecustId(custId)) {
//             showToast("Customer ID Format 'C000'", "error");
//             return;
//         }
//         if (!validatecustName(custName)) {
//             showToast("Name must contain only letters", "error");
//             return;
//         }
//         if (!validatecustAddress(custAddress)) {
//             showToast("Address cannot be empty", "error");
//             return;
//         }
//         if (!validatecustContact(custContact)) {
//             showToast("Contact must be 10 digits numbers", "error");
//             return;
//         }

//         const customerData = {
//             custId,
//             custName,
//             custAddress,
//             custContact,
//         };

//         try {
//             let url = "http://localhost:8080/Coffee_Shop_POS_JavaEE_Backend_war_exploded/customer";
//             let method = isUpdateMode ? "PUT" : "POST";
//             let successMessage = isUpdateMode ? "Customer Updated Successfully" : "Customer Added Successfully";

//             if (isUpdateMode) {
//                 url += `?custContact=${currentCustomerContact}`;
//             }

//             const response = await fetch(url, {
//                 method: method,
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(customerData),
//             });

//             if (response.ok) {
//                 showToast(successMessage, "success");
//                 await loadCustomersIntoTable();
//                 closeCustomerRegisterForm();
//             } else {
//                 const errorText = await response.text();
//                 showToast(`Failed! Try again: ${errorText}`, "error");
//             }
//         } catch (error) {
//             showToast("Error saving customer data", "error");
//         }
//     });

//     loadCustomersIntoTable();
// });


document.addEventListener("DOMContentLoaded", function() {
    const customerRegisterForm = document.getElementById("customerRegisterForm");
    const customerForm = document.getElementById("customer-form");
    const customerButton = document.getElementById("customer-submit");
    const customerTableList = document.getElementById("customer-table-list");
    const registerTitle = document.getElementById("registerTitle");
    let isUpdateMode = false;
    let currentCustomerContact = null;

    const showToast = (message, type = "success") => {
        const toast = document.getElementById("toast");
        toast.classList.remove("success", "error");
        toast.classList.add(type);
        toast.textContent = message;
        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    };

    const openCustomerRegisterForm = () => {
        customerRegisterForm.style.display = "block";
        registerTitle.textContent = "Register Customer";
    };

    const closeCustomerRegisterForm = () => {
        customerRegisterForm.style.display = "none";
        customerForm.reset();
        customerButton.textContent = "Submit";
        isUpdateMode = false;
        currentCustomerContact = null;
    };

    document.getElementById("add-customer").addEventListener("click", openCustomerRegisterForm);
    document.getElementById("customerRegisterForm-close").addEventListener("click", closeCustomerRegisterForm);

    customerButton.addEventListener("click", function() {
        customerRegisterForm.style.display = "none";
    });

    const loadCustomersIntoTable = async () => {
        await loadCustomersDataFromBackend();
        customerTableList.innerHTML = ""; // Clear the table
        customerDataList.forEach((customer) => {
            addCustomerDataToTable(customer, customerTableList);
        });
    };

    let customerDataList = []; // To hold the customer data fetched from backend

    const loadCustomersDataFromBackend = async () => {
        try {
            const response = await fetch("http://localhost:8080/Coffee_Shop_POS_JavaEE_Backend_war/customer");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            customerDataList = data;
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    };

    const addCustomerDataToTable = (customer, table) => {
        const row = document.createElement("tr");
        const nameList = ["custId", "custName", "custAddress", "custContact"];

        nameList.forEach((key) => {
            const cell = document.createElement("td");
            cell.textContent = customer[key];
            row.appendChild(cell);
        });

        const updateCell = document.createElement("td");
        const updateButton = document.createElement("button");
        updateButton.textContent = "Update";
        updateButton.classList.add("action-button");
        updateButton.addEventListener("click", () => {
            openCustomerRegisterForm();
            fillFormCustomerData(customer);
            registerTitle.textContent = "Update Customer";
            isUpdateMode = true;
            currentCustomerContact = customer.custContact;
            customerButton.textContent = "Update";
        });
        updateCell.appendChild(updateButton);
        row.appendChild(updateCell);

        const removeCell = document.createElement("td");
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.classList.add("action-button");
        removeButton.addEventListener("click", async () => {
            const confirmation = confirm(`Are you sure you want to remove customer ${customer.custContact}?`);
            if (confirmation) {
                try {
                    const response = await fetch(`http://localhost:8080/Coffee_Shop_POS_JavaEE_Backend_war/customer?contact=${customer.custContact}`, {
                        method: "DELETE",
                    });

                    if (response.ok) {
                        row.remove();
                        customerDataList = customerDataList.filter((c) => c.custContact !== customer.custContact);
                        showToast("Customer Deleted Successfully", "success");
                    } else {
                        const errorText = await response.text();
                        showToast(`Error removing customer: ${errorText}`, "error");
                    }
                } catch (error) {
                    showToast("Error removing customer", "error");
                }
            }
        });
        removeCell.appendChild(removeButton);
        row.appendChild(removeCell);
        table.appendChild(row);
    };

    const fillFormCustomerData = (customer) => {
        document.getElementById("customerID").value = customer.custId;
        document.getElementById("customerName").value = customer.custName;
        document.getElementById("customerAddress").value = customer.custAddress;
        document.getElementById("customerNumber").value = customer.custContact;
    };

    const validatecustId = (custId) => /^C\d{3}$/.test(custId);
    const validatecustName = (custName) => /^[a-zA-Z\s]+$/.test(custName);
    const validatecustAddress = (custAddress) => custAddress.trim() !== "";
    const validatecustContact = (custContact) => /^[0-9]{10}$/.test(custContact);

    customerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const custId = document.getElementById("customerID").value;
        const custName = document.getElementById("customerName").value;
        const custAddress = document.getElementById("customerAddress").value;
        const custContact = document.getElementById("customerNumber").value;

        if (!validatecustId(custId)) {
            showToast("Customer ID Format 'C000'", "error");
            return;
        }
        if (!validatecustName(custName)) {
            showToast("Name must contain only letters", "error");
            return;
        }
        if (!validatecustAddress(custAddress)) {
            showToast("Address cannot be empty", "error");
            return;
        }
        if (!validatecustContact(custContact)) {
            showToast("Contact must be 10 digits numbers", "error");
            return;
        }

        const customerData = {
            custId,
            custName,
            custAddress,
            custContact,
        };

        try {
            let url = "http://localhost:8080/Coffee_Shop_POS_JavaEE_Backend_war/customer";
            let method = isUpdateMode ? "PUT" : "POST";
            let successMessage = isUpdateMode ? "Customer Updated Successfully" : "Customer Added Successfully";

            if (isUpdateMode) {
                url += `?custContact=${currentCustomerContact}`;
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(customerData),
            });

            if (response.ok) {
                showToast(successMessage, "success");
                await loadCustomersIntoTable();
                closeCustomerRegisterForm();
            } else {
                const errorText = await response.text();
                showToast(`Failed! Try again: ${errorText}`, "error");
            }
        } catch (error) {
            showToast("Error saving customer data", "error");
        }
    });

    loadCustomersIntoTable();
});
