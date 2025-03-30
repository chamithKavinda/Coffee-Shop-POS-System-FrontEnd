$(document).ready(function() {
    const $productRegisterForm = $("#productRegisterForm");
    const $productTableList = $("#product-table-list");
    const $productForm = $("#product-form");
    const $productButton = $("#product-submit");
    const $title = $("#title");
    let isProductUpdateMode = false;
    let currentProductId = null;

    // Toast notification function
    const showToast = (message, type = "success") => {
        const $toast = $("#toast");
        $toast.removeClass("success error");
        $toast.addClass(type);
        $toast.text(message);
        $toast.addClass("show");
        setTimeout(() => {
            $toast.removeClass("show");
        }, 3000);
    };

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

    // Load items
    const LoadProductsIntoTable = async () => {
        await loadProductsFromBackend();
        $productTableList.empty();
        productDataList.forEach((product) => {
            addProductToTable(product, $productTableList);
        });
    };

    const loadProductsFromBackend = async () => {
        try {
            const response = await fetch("http://localhost:8080/Coffee_Shop_POS_JavaEE_Backend_war/product");
            if (!response.ok) {
                throw new Error(`HTTP error! : ${response.status}`);
            }
            const data = await response.json();
            productDataList = data;
        } catch (error) {
            showToast("Error fetching products", "error");
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
            if (confirm(`Are you sure you want to remove product ${product.pro_id}?`)) {
                try {
                    const response = await fetch(`http://localhost:8080/Coffee_Shop_POS_JavaEE_Backend_war/product?pro_id=${product.pro_id}`, {
                        method: "DELETE",
                    });
                    if (response.ok) {
                        $row.remove();
                        productDataList = productDataList.filter((p) => p.pro_id !== product.pro_id);
                        showToast("Product Deleted Successfully", "success");
                    } else {
                        const errorText = await response.text();
                        showToast(`Error removing product: ${errorText}`, "error");
                    }
                } catch (error) {
                    showToast("Error removing product", "error");
                }
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
            showToast("Item ID must be in 'P000' format", "error");
            return;
        }
        if (!validateProName(pro_name)) {
            showToast("Name must contain only letters", "error");
            return;
        }
        if (!validatePrice(price)) {
            showToast("Price must be a valid positive number", "error");
            return;
        }
        if (!validateCategory(category)) {
            showToast("Category cannot be empty", "error");
            return;
        }
        if (!validateQuantity(quantity)) {
            showToast("Quantity must be a positive number", "error");
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
            let url = "http://localhost:8080/Coffee_Shop_POS_JavaEE_Backend_war/product";
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
                showToast(successMessage, "success");
                await LoadProductsIntoTable();
                closeProductRegisterForm();
            } else {
                const errorText = await response.text();
                showToast(`Process failed: ${errorText}`, "error");
            }
        } catch (error) {
            showToast("Error processing product data", "error");
        }
    });

    LoadProductsIntoTable();
});
