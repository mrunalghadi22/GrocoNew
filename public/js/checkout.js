document.addEventListener("DOMContentLoaded", () => {
  const defaultAddressRadio = document.querySelector(
    'input[name="saved_address"]:checked'
  );

  if (defaultAddressRadio) {
    displaySelectedAddress(defaultAddressRadio);
  }
});

function displaySelectedAddress(selected) {
  let address = selected.closest(".address");

  let addressInfo = address.querySelector(".address-info");

  if (addressInfo) {
    let name = addressInfo.querySelector(".name")?.innerText || "";
    let addressLine =
      addressInfo.querySelector(".address-line")?.innerText || "";
    let locality = addressInfo.querySelector(".locality")?.innerText || "";
    let city = addressInfo.querySelector(".city")?.innerText || "";
    let state = addressInfo.querySelector(".state")?.innerText || "";
    let pincode = addressInfo.querySelector(".pincode")?.innerText || "";

    let selectedAddress = document.querySelector(
      ".selected-address .full-address"
    );
    selectedAddress.innerHTML = `
        <span class='name'>${name}</span>,
        <span class='address-line'>${addressLine}</span>,
        <span class='locality'>${locality}</span>,
        <span class='city'>${city}</span>,
        <span class='state'>${state}</span> -
        <span class='pincode'>${pincode}</span>
      `;

    document.querySelector(".select-address").style.display = "none";
    document.querySelector(".change-address-btn").style.display = "block";
  } else {
    console.log("Address not found");
  }
}

function changeAddress() {
  document.querySelector(".change-address-btn").style.display = "none";
  document.querySelector(".selected-address .full-address").innerHTML = "";

  let radios = document.querySelectorAll("input[name='saved_address']");
  radios.forEach((radio) => (radio.checked = false));

  document.querySelector(".select-address").style.display = "block";
}

function showForm(event, className, isEdit = false, addressData = null) {
  if (event) event.preventDefault();

  const addressForm = document.querySelector(".address-form");
  const selectAddressList = document.querySelector(
    ".select-address > .addresses"
  );
  const addBtn = document.querySelector(".add-address-btn");
  const formTitle = document.querySelector(".form-title");
  const saveBtn = document.querySelector(".action-butns .save-address");
  const updateBtn = document.querySelector(".action-butns .update-address");

  
  if (selectAddressList) selectAddressList.style.display = "none";
  if (addBtn) addBtn.style.display = "none";

 
  addressForm.style.display = "block";
  formTitle.textContent = isEdit ? "Edit Address" : "Add A New Address";

  if (isEdit && addressData) {
   
    document.getElementById("u-name").value = addressData.user_name;
    document.getElementById("m-num").value = addressData.phn_num;
    document.getElementById("pin-code").value = addressData.pin_code;
    document.getElementById("locality").value = addressData.locality;
    document.getElementById("addressline1").value = addressData.street_address;
    document.getElementById("city").value = addressData.city;
    document.getElementById("state").value = addressData.state;

    let addressIdInput = document.getElementById("address-id");
    if (addressIdInput) addressIdInput.value = addressData._id;

    const addressType = addressData.address_type.trim().toLowerCase();
    document.getElementsByName("address-type").forEach((radio) => {
      if (radio.value.toLowerCase() === addressType) radio.checked = true;
    });

    saveBtn.style.display = "none";
    updateBtn.style.display = "block";
  } else {

    let addressIdInput = document.getElementById("address-id");
    if (addressIdInput) addressIdInput.value = "";

    saveBtn.style.display = "block";
    updateBtn.style.display = "none";
  }
}

function hideForm(className) {
  document.querySelector(".address-form").style.display = "none";
  document.querySelector(".select-address > .addresses").style.display =
    "block";
  document.querySelector(".add-address-btn").style.display = "flex";
}

async function handleAddress(action) {
  const form = document.querySelector(".addressForm");

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }


  const url =
    action === "save" ? "/profile/address/add" : "/profile/address/update";


  const formData = {
    "user-name": document.getElementById("u-name").value,
    "mob-num": document.getElementById("m-num").value,
    pincode: document.getElementById("pin-code").value,
    locality: document.getElementById("locality").value,
    addressline1: document.getElementById("addressline1").value,
    city: document.getElementById("city").value,
    state: document.getElementById("state").value,
    "address-type": document.querySelector('input[name="address-type"]:checked')
      .value,
    address_id: document.getElementById("address-id").value,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (result.success) {
      showPopup("Success", result.message, "success");
      window.location.reload();
    } else {
      showPopup("Error", result.message, "error");
      // alert(result.message || "Failed to save address.");
    }
  } catch (error) {
    console.error("Error saving address:", error);
    alert("A network error occurred. Please try again.");
  }
}

async function processPayment(totalAmount) {
  const selectedAddressRadio = document.querySelector(
    'input[name="saved_address"]:checked'
  );
  if (!selectedAddressRadio) {
    alert("Please select a delivery address first!");
    return;
  }
  const addressId = selectedAddressRadio.value;

  const paymentMethodRadio = document.querySelector(
    'input[name="payment"]:checked'
  );
  if (!paymentMethodRadio) {
    // alert("Please select a payment method!");
    showPopup("Error", "Please select a payment method!", "error");
    return;
  }
  const paymentMethod = paymentMethodRadio.value;


  if (paymentMethod === "cod") {
    try {
      
      const response = await fetch("/payment/cod-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId: addressId,
          totalAmount: document
            .getElementById("totalAmount")
            .innerText.replace("₹ ", ""),
          totalItems: document.getElementById("total_items").value,
          cartItems: window.checkoutItems, 
        }),
      });

      const data = await response.json();

      if (data.success) {
        showPopup("Success", "Order Placed Successfully!", "success");
        window.location.href = "/"; 
      } else {
        showPopup("Error", "Failed to place COD order.", "error");
      }
    } catch (err) {
      console.error("COD Checkout Error:", err);
      showPopup("Error", "Something went wrong saving your order.", "error");
    }

    return;
  }

  try {
    const response = await fetch("/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: totalAmount }),
    });

    const orderData = await response.json();

    if (!orderData.success) {
     
      showPopup("Error", "Failed to initiate payment.", "error");
      return;
    }

    
    const options = {
      key: orderData.key_id,
      amount: orderData.amount,
      currency: "INR",
      name: "Groco E-Commerce",
      order_id: orderData.order_id,

     
      handler: async function (response) {
        console.log("Razorpay Success! Sending to backend for verification...");

        try {
          const verifyRes = await fetch("/payment/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,

              addressId: document.querySelector(
                'input[name="saved_address"]:checked'
              ).value,
              totalAmount: document
                .getElementById("totalAmount")
                .innerText.replace("₹ ", ""),
              totalItems: document.getElementById("total_items").value,

              cartItems: window.checkoutItems,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            // alert("Order Placed Successfully!");
            showPopup("Success", "Order Placed Successfully!", "success");
            window.location.href = "/";
          } else {
            // alert("Payment verification failed! " + verifyData.message);
            showPopup("Error", "Payment verification failed!", "error");
          }
        } catch (err) {
          console.error("Verification Error", err);
          // alert("Something went wrong saving the order to the database.");
          showPopup(
            "Error",
            "Something went wrong saving the order to the database.",
            "error"
          );
        }
      },

      theme: { color: "#28a745" },
    };

    
    const rzp = new Razorpay(options);

    rzp.on("payment.failed", function (response) {
      // alert("Payment Failed! Reason: " + response.error.description);
      showPopup("Error", "Payment Failed!", "error");
    });

    rzp.open();
  } catch (error) {
    console.error("Payment Gateway Error:", error);
    alert("Something went wrong connecting to the payment gateway.");
  }
}
