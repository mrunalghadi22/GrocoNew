document.addEventListener("DOMContentLoaded", () => {
  initializeMenuItems();
  const savedPage = sessionStorage.getItem("currentPage");
  loadPage("personal_info");
});

function initializeMenuItems() {
  document.querySelectorAll(".menu-item").forEach((item) => {
    console.log(item);
    item.addEventListener("click", handleMenuItemClick);
  });
}


function handleMenuItemClick(event) {
  const page = this.getAttribute("data-page");
  loadPage(page);
  setActive(this);
}


function setActive(element) {
  document
    .querySelectorAll(".menu-item")
    .forEach((item) => item.classList.remove("active"));
  if (element) element.classList.add("active");
}


function loadPage(pageName) {
  sessionStorage.setItem("currentPage", pageName);
  console.log("Loading partial view:", pageName);

  if (pageName === "logout") {
    window.location.href = "/logout";
    return;
  }

  fetch(`/profile/${pageName}`)
    .then((response) => {
      if (!response.ok) throw new Error("Page not found");
      return response.text(); 
    })
    .then((data) => {
      const contentDiv = document.getElementById("content");
      contentDiv.innerHTML = data;
      sessionStorage.setItem("currentPage", pageName);

      if (pageName === "personal_info") {
        initUserProfile();
      }
      if (pageName === "manage_address") {
        if (typeof loadAddressList === "function") loadAddressList();
      }

      
      const activeItem = document.querySelector(
        `.menu-item[data-page="${pageName}"]`
      );
      if (activeItem) setActive(activeItem);
    })
    .catch((error) => {
      document.getElementById("content").innerHTML =
        "<p>Error loading page.</p>";
      console.error(error);
    });
}


function initUserProfile() {
  const updateBtn = document.querySelector(".update-profile");
  const saveBtn = document.querySelector(".save-profile");
  const inputs = document.querySelectorAll(".user-profile-form input");

  if (!updateBtn || !saveBtn) return; 

  updateBtn.addEventListener("click", (e) => {
    e.preventDefault();
    enableEditing(inputs, updateBtn, saveBtn);
  });

  saveBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const form = document.querySelector(".user-profile-form");

    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

   
    fetch("/profile/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          showPopup("Profile Updated!", result.message, "success");
          disableEditing(inputs, updateBtn, saveBtn);
        } else {
          showPopup("Error!", result.message, "error");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showPopup("Error!", "Something went wrong. Please try again.", "error");
      });
  });

  function enableEditing(inputs, updateBtn, saveBtn) {
    inputs.forEach((input) => input.removeAttribute("disabled"));
    saveBtn.classList.remove("hide");
    updateBtn.classList.add("hide");
  }

  function disableEditing(inputs, updateBtn, saveBtn) {
    inputs.forEach((input) => input.setAttribute("disabled", true));
    saveBtn.classList.add("hide");
    updateBtn.classList.remove("hide");
  }
}


function handleAddress(action) {
  const form = document.querySelector(".addressForm");
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);


  const url =
    action === "save" ? "/profile/address/add" : `/profile/address/update`;
    console.log(action)
    console.log(url)

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        showPopup("Success!", "Address saved successfully.", "success");

        loadPage("manage_address");
      } else {
        showPopup("Error!", result.message, "error");
      }
    })
    .catch((error) => {
      console.error("Error saving address:", error);
      showPopup("Error!", "Failed to save address.", "error");
    });
}


function editAddress(addressId) {

  fetch(`/profile/address/get/${addressId}`)
      .then(response => response.json())
      .then(result => {
          if (result.success) {
              showForm('add-address-btn', true, result.address);
          } else {
              showPopup("Error!", "Could not load address details.", "error");
          }
      })
      .catch(error => console.error("Error fetching address:", error));
}


function showForm(className, isEdit = false, addressData = null) {
  const btn = document.querySelector(`.${className}`);
  const addressForm = document.querySelector(".address-form");
  const addressList = document.querySelector(".saved-address");
  const formTitle = document.querySelector(".form-title");
  const saveAdd = document.querySelector(".action-butns .save-address");
  const updateAdd = document.querySelector(".action-butns .update-address");

  formTitle.textContent = isEdit ? "Edit Address" : "Add A New Address";
  document.querySelector(".user-address").insertBefore(addressForm, addressList);

  addressForm.style.display = "block";
  btn.style.display = "none";
  if (addressList) addressList.style.display = "none"; // Hide list while editing

  if (isEdit && addressData) {
  
      document.getElementById("u-name").value = addressData.user_name; 
      document.getElementById("m-num").value = addressData.phn_num; 
      document.getElementById("pin-code").value = addressData.pin_code;
      document.getElementById("locality").value = addressData.locality;
      document.getElementById("addressline1").value = addressData.street_address;
      document.getElementById("city").value = addressData.city;
      document.getElementById("state").value = addressData.state;

      saveAdd.style.display = "none";
      updateAdd.style.display = "block";

      const addressType = addressData.address_type.trim().toLowerCase();
      document.getElementsByName("address-type").forEach((radio) => {
          if (radio.value.toLowerCase() === addressType) radio.checked = true;
      });

      let addressIdInput = document.getElementById("address-id");
      if (!addressIdInput) {
          addressIdInput = document.createElement("input");
          addressIdInput.type = "hidden";
          addressIdInput.name = "address_id";
          addressIdInput.id = "address-id";
          document.querySelector(".addressForm").appendChild(addressIdInput);
      }
 
      addressIdInput.value = addressData._id; 
  } else {
      document.querySelector(".addressForm").reset();
      const addressIdInput = document.getElementById("address-id");
      saveAdd.style.display = "block";
      updateAdd.style.display = "none";
      if (addressIdInput) addressIdInput.remove();
  }
}


function deleteAddress(addressId) {

  if (!confirm("Are you sure you want to delete this address?")) {
      return; 
  }


  fetch(`/profile/address/delete/${addressId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.json())
  .then(result => {
      if (result.success) {
          showPopup("Deleted!", "Address has been removed.", "success");
          
      
          loadPage("manage_address"); 
      } else {
          showPopup("Error!", result.message, "error");
      }
  })
  .catch(error => {
      console.error("Error deleting address:", error);
      showPopup("Error!", "Failed to delete address.", "error");
  });
}
