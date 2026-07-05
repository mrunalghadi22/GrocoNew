
async function loadContent(routeUrl, element) {
  
  document
    .querySelectorAll(".menu-items .item")
    .forEach((el) => el.classList.remove("active"));
  if (element) element.classList.add("active");

 
  if (element) {
    document.getElementById("page-title").innerText = element.innerText;
  }

  try {
    
    document.getElementById("content-area").innerHTML =
      '<p style="text-align:center;">Loading data...</p>';

    const response = await fetch(routeUrl);
    const htmlContent = await response.text();

    document.getElementById("content-area").innerHTML = htmlContent;

    
    attachDynamicListeners();
  } catch (error) {
    console.error("Error loading content:", error);
    document.getElementById("content-area").innerHTML =
      '<p style="color:red; text-align:center;">Failed to load content.</p>';
  }
}


window.onload = () => {
  loadContent(
    "/admin/api/orders",
    document.querySelector('[data-menu="orders"]')
  );
};

function attachDynamicListeners() {
  document.querySelectorAll(".status-dropdown").forEach((select) => {
    select.addEventListener("change", async function () {
      let orderId = this.getAttribute("data-id");
      let status = this.value;

      try {
        const response = await fetch("/admin/orders/update-status", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: orderId, status: status }),
        });
        const data = await response.json();
        if (data.success) {
          alert(data.message);
        } else {
          alert("Error: " + data.message);
        }
      } catch (error) {
        alert("Failed to update status.");
      }
    });
  });
}




async function openEditForm(productId) {
  try {

    closeEditForm();


    const editBtn = document.querySelector(`.edit-btn[data-id="${productId}"]`);
    const originalRow = editBtn.closest("tr");


    originalRow.style.display = "none";


    const editRow = document.createElement("tr");
    editRow.id = "inline-edit-row";
    editRow.dataset.originalId = productId; 

  
    const editCell = document.createElement("td");
    editCell.colSpan = 9;
    editCell.style.padding = "20px";
    editCell.style.backgroundColor = "#f9f9faf0"; 

    
    const formContainer = document.getElementById("editForm");
    formContainer.style.display = "block";
    editCell.appendChild(formContainer);
    editRow.appendChild(editCell);

   
    originalRow.parentNode.insertBefore(editRow, originalRow.nextSibling);

    const response = await fetch(`/admin/api/products/${productId}`);
    const product = await response.json();

    document.getElementById("product_id").value = product._id;
    document.getElementById("name").value = product.name;
    document.getElementById("price").value = product.price;
    document.getElementById("discount").value = product.discount || 0;
    document.getElementById("stock").value = product.stock;
    document.getElementById("description").value = product.description;
    document.getElementById("keywords").value = product.keywords;

    document.getElementById('preview1').src = product.images[0] || "";

    if (document.getElementById("category"))
      document.getElementById("category").value = product.category_id || "";
    if (document.getElementById("status"))
      document.getElementById("status").value = product.status || "active";
  } catch (error) {
    console.error("Error fetching product:", error);
    alert("Could not load product details.");
    closeEditForm();
  }
}


function closeEditForm() {
  const editRow = document.getElementById("inline-edit-row");
  if (editRow) {
    const formContainer = document.getElementById("editForm");
    formContainer.style.display = "none";


    document.getElementById("content-area").appendChild(formContainer);


    const productId = editRow.dataset.originalId;
    const originalBtn = document.querySelector(
      `.edit-btn[data-id="${productId}"]`
    );
    if (originalBtn) {
      originalBtn.closest("tr").style.display = "";
    }

  
    editRow.remove();
  }
}

async function deleteProduct(productId) {
  if (confirm("Are you sure you want to delete this product?")) {
    try {
      const response = await fetch(`/admin/api/products/${productId}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.success) {
        alert("Product deleted!");
       
        loadContent(
          "/admin/api/products",
          document.querySelector('[data-menu="productList"]')
        );
      } else {
        alert("Failed to delete product.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
}


function previewImage(event, previewId) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        const img = document.getElementById(previewId);
        img.src = reader.result;
        img.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  }