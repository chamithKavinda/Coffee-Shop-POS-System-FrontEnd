$(document).ready(function() {
    const $customerRegisterForm = $("#customerRegisterForm");
    const $customerForm = $("#customer-form");
    const $customerButton = $("#customer-submit");
    const $customerTableList = $("#customer-table-list");
    const $registerTitle = $("#registerTitle");
    let isUpdateMode = false;
    let currentCustomerContact = null;

    const openCustomerRegisterForm = () => {
        $customerRegisterForm.show();
        $registerTitle.text("Register Customer");
    };

    const closeCustomerRegisterForm = () => {
        $customerRegisterForm.hide();
        $customerForm[0].reset();
        $customerButton.text("Submit");
        isUpdateMode = false;
        currentCustomerContact = null;
    };

    $("#add-customer").on("click", openCustomerRegisterForm);
    $("#customerRegisterForm-close").on("click", closeCustomerRegisterForm);

    $("#customer-submit").on("click", function() {
        $customerRegisterForm.hide();
    });

    const loadCustomersIntoTable = async () => {
        await loadCustomersDataFromBackend();
        $customerTableList.empty();
        customerDataList.forEach((customer) => {
            addCustomerDataToTable(customer, $customerTableList);
        });
    };

    const loadCustomersDataFromBackend = async () => {
        try {
            const response = await fetch("http://localhost:8080/Coffee_Shop_POS_JavaEE_Backend_war_exploded/customer");
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
        const $row = $("<tr>");
        const nameList = ["custId", "custName", "custAddress", "custContact"];

        nameList.forEach((key) => {
            const $cell = $("<td>").text(customer[key]);
            $row.append($cell);
        });

        const $updateCell = $("<td>");
        const $updateButton = $("<button>").text("Update").addClass("action-button");
        $updateButton.on("click", () => {
            openCustomerRegisterForm();
            fillFormCustomerData(customer);
            $registerTitle.text("Update Customer");
            isUpdateMode = true;
            currentCustomerContact = customer.custContact;
            $customerButton.text("Update");
        });
        $updateCell.append($updateButton);
        $row.append($updateCell);

        const $removeCell = $("<td>");
        const $removeButton = $("<button>").text("Remove").addClass("action-button");
        $removeButton.on("click", async () => {
            console.log(`Remove customer ${customer.custContact}`);
            try {
                const response = await fetch(`http://localhost:8080/Coffee_Shop_POS_JavaEE_Backend_war_exploded/customer?contact=${customer.custContact}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    $row.remove();
                    customerDataList = customerDataList.filter((c) => c.custContact !== customer.custContact);
                } else {
                    const errorText = await response.text();
                    console.error("Error removing customer:", errorText);
                }
            } catch (error) {
                console.error("Error removing customer:", error);
            }
        });
        $removeCell.append($removeButton);
        $row.append($removeCell);
        table.append($row);
    };

    const fillFormCustomerData = (customer) => {
        $("#customerID").val(customer.custId);
        $("#customerName").val(customer.custName);
        $("#customerAddress").val(customer.custAddress);
        $("#customerNumber").val(customer.custContact);
    };

    const validatecustId = (custId) => /^C\d{3}$/.test(custId);
    const validatecustName = (custName) => /^[a-zA-Z\s]+$/.test(custName);
    const validatecustAddress = (custAddress) => custAddress.trim() !== "";
    const validatecustContact = (custContact) => /^[0-9]{10}$/.test(custContact);

    $customerForm.on("submit", async (event) => {
        event.preventDefault();

        const custId = $("#customerID").val();
        const custName = $("#customerName").val();
        const custAddress = $("#customerAddress").val();
        const custContact = $("#customerNumber").val();

        if (!validatecustId(custId)) {
            alert("Customer ID Format 'C000'");
            return;
        }
        if (!validatecustName(custName)) {
            alert("Name must contain only letters");
            return;
        }
        if (!validatecustAddress(custAddress)) {
            alert("Address cannot be empty");
            return;
        }
        if (!validatecustContact(custContact)) {
            alert("Contact must be 10 digits numbers");
            return;
        }

        const customerData = {
            custId,
            custName,
            custAddress,
            custContact,
        };

        try {
            let url = "http://localhost:8080/Coffee_Shop_POS_JavaEE_Backend_war_exploded/customer";
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
                alert(successMessage);
                await loadCustomersIntoTable();
                closeCustomerRegisterForm();
            } else {
                const errorText = await response.text();
                alert(`Failed! Try again: ${errorText}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error saving customer data");
        }
    });

    loadCustomersIntoTable();
});


