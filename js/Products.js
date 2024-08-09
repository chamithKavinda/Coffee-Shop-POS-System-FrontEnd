$(document).ready(function() {
    const $productRegisterForm = $("#productRegisterForm");
    const $productTableList = $("#product-table-list");
    const $productForm = $("#product-form");
    const $productButton = $("#product-submit");
    const $title = $("#title");
    let isProductUpdateMode = false;
    let currentProductId = null;

    // Set up event listener
    const openProductRegisterForm = () => {
        $productRegisterForm.show();
        $title.text("Register Product");
    };

    const closeProductRegisterForm = () => {
        $productRegisterForm.hide();
        $productForm[0].reset();
        $productButton.text("Submit");
        isProductUpdateMode = false;
        currentProductId = null;
    };

    $("#add-product").on("click", openProductRegisterForm);
    $("#productRegisterForm-close").on("click", closeProductRegisterForm);

    // Clear the text fields
    $("#product-submit").on("click", function() {
        $productRegisterForm.hide();
    });

    // Load items
    const LoadProductsIntoTable = async () => {
        await loadProductsFromBackend();
        $productTableList.empty();
        productDataList.forEach((product) => {
            console.log(product);
            addProductToTable(product, $productTableList);
        });
    };

    const loadProductsFromBackend = async () => {
        try {
            const response = await fetch("http://localhost:8080/Coffee_Shop_POS_JavaEE_Backend_war_exploded/product");
            if (!response.ok) {
                throw new Error(`HTTP error! : ${response.status}`);
            }
            const data = await response.json();
            productDataList = data;
        } catch (error) {
            console.error("Error fetching products: ", error);
        }
    };

    const addProductToTable = (product, table) => {
        const $row = $("<tr>");
        const keys = ["pro_id", "pro_name", "price", "category", "quantity"];
        keys.forEach((key) => {
            const $cell = $("<td>").text(product[key]);
            $row.append($cell);
        });

        // Create Update button
        const $updateCell = $("<td>");
        const $updateButton = $("<button>").text("Update").addClass("action-button");
        $updateButton.on("click", () => {
            openProductRegisterForm();
            fillFormWithProductData(product);
            $title.text("Update Product");
            isProductUpdateMode = true;
            currentProductId = product.pro_id;
            $productButton.text("Update");
        });
        $updateCell.append($updateButton);
        $row.append($updateCell);

        // Create Remove button
        const $removeCell = $("<td>");
        const $removeButton = $("<button>").text("Remove").addClass("action-button");
        $removeButton.on("click", async () => {
            console.log(`Remove product ${product.pro_id}`);
            try {
                const response = await fetch(`http://localhost:8080/Coffee_Shop_POS_JavaEE_Backend_war_exploded/product?pro_id=${product.pro_id}`, {
                    method: "DELETE",
                });
                if (response.ok) {
                    $row.remove();
                    productDataList = productDataList.filter((p) => p.pro_id !== product.pro_id);
                } else {
                    const errorText = await response.text();
                    console.error("Error removing product: ", errorText);
                }
            } catch (error) {
                console.error("Error removing product:", error);
            }
        });
        $removeCell.append($removeButton);
        $row.append($removeCell);

        // Append the row to the table
        table.append($row);
    };

    const fillFormWithProductData = (product) => {
        $("#productID").val(product.pro_id);
        $("#productName").val(product.pro_name);
        $("#price").val(product.price);
        $("#category").val(product.category);
        $("#quantity").val(product.quantity);
    };

    // Validation functions
    const validateProID = (pro_id) => /^P\d{3}$/.test(pro_id);
    const validateProName = (pro_name) => /^[a-zA-Z\s]+$/.test(pro_name);
    const validatePrice = (price) => /^[0-9]+(\.[0-9]{1,2})?$/.test(price) && parseFloat(price) > 0;
    const validateCategory = (category) => category.trim() !== "";
    const validateQuantity = (quantity) => /^[0-9]+$/.test(quantity) && parseInt(quantity, 10) > 0;

    // Handle form submit and update product
    $productForm.on("submit", async (event) => {
        event.preventDefault();

        // Get form data
        const pro_id = $("#productID").val();
        const pro_name = $("#productName").val();
        const price = $("#price").val();
        const category = $("#category").val();
        const quantity = $("#quantity").val();

        // Validate data
        if (!validateProID(pro_id)) {
            alert("Item ID must be in 'P000' format");
            return;
        }
        if (!validateProName(pro_name)) {
            alert("Name must contain only letters");
            return;
        }
        if (!validatePrice(price)) {
            alert("Price must be a valid positive number");
            return;
        }
        if (!validateCategory(category)) {
            alert("Category cannot be empty");
            return;
        }
        if (!validateQuantity(quantity)) {
            alert("Quantity must be a positive number");
            return;
        }

        const productData = {
            pro_id,
            pro_name,
            price,
            category,
            quantity,
        };

        try {
            let url = "http://localhost:8080/Coffee_Shop_POS_JavaEE_Backend_war_exploded/product";
            let method = isProductUpdateMode ? "PUT" : "POST";
            let successMessage = isProductUpdateMode ? "Product Updated Successfully" : "Product Added Successfully";

            if (isProductUpdateMode) {
                url += `?pro_id=${currentProductId}`;
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData),
            });

            if (response.ok) {
                alert(successMessage);
                await LoadProductsIntoTable();
                closeProductRegisterForm();
            } else {
                const errorText = await response.text();
                alert(`Process failed: ${errorText}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error processing product data");
        }
    });

    LoadProductsIntoTable();
});
