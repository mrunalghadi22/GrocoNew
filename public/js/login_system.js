function loginSystem(formType) {
  const form = document.getElementById(
    formType === "login" ? "loginForm" : "signupForm"
  );

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    let data = {};

    if (formType === "login") {
      data = {
        email: formData.get("email"),
        password: formData.get("password"),
      };

      fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((response) => {
          if (response.status === "success" || response.success === true) {
            localStorage.setItem("loginMessage", response.message);
            window.location.href = "/"; // Redirect to Node home route
          } else {
            showPopup("Failed", response.message, "error");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          showPopup("Error", "Something went wrong during login.", "error");
        });
    } else {
      // --- SIGNUP FORM VALIDATION ---
      const firstName = formData.get("first-name").trim();
      const lastName = formData.get("last-name").trim();
      const email = formData.get("email").trim();
      const password = formData.get("password");

      const nameRegex = /^[A-Za-z]+$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}$/;

      if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
        return showPopup("Error", "Names must contain only letters.", "error");
      }
      if (!emailRegex.test(email)) {
        return showPopup(
          "Error",
          "Please enter a valid email address.",
          "error"
        );
      }
      if (!passwordRegex.test(password)) {
        return showPopup(
          "Error",
          "Password must be at least 6 chars, with 1 uppercase, 1 lowercase, and 1 special character.",
          "error"
        );
      }

      data = {
        "first-name": firstName,
        "last-name": lastName,
        email: email,
        password: password,
      };

      // Changed from registration.php to standard Express route
      fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((response) => {
          if (response.status === "success" || response.success === true) {
            showPopup(
              "Success",
              response.message || "Registration successful!",
              "success"
            );
            setTimeout(() => {
              window.location.href = "/login";
            }, 2000);
          } else {
            showPopup("Error", response.message, "error");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          showPopup(
            "Error",
            "Something went wrong during registration.",
            "error"
          );
        });
    }
  });
}


if (document.getElementById("loginForm")) {
  loginSystem("login");
} else if (document.getElementById("signupForm")) {
  loginSystem("signup");
}

const togglePasswordIcons = document.querySelectorAll(".toggle-password");

if (togglePasswordIcons) {
  togglePasswordIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
     
      const input = icon.previousElementSibling;
      const type =
        input.getAttribute("type") === "password" ? "text" : "password";
      input.setAttribute("type", type);

      icon.classList.toggle("uil-eye");
      icon.classList.toggle("uil-eye-slash");
    });
  });
}

function forgotPass() {
  window.location.href = "/forgot-password"; 
}

const forgot_pass_form = document.querySelector(".forgot-password-form");

if (forgot_pass_form) {
  forgot_pass_form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = this.email.value;

    try {
      
      const response = await fetch("/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `email=${encodeURIComponent(email)}`,
      });

      const text = await response.text();
      const result = JSON.parse(text);

      if (result.success) {
        showPopup("Success", `${result.message}: ${result.code}`, "success");
        setTimeout(() => {
          window.location.href = result.redirect;
        }, 3000);
      } else {
        showPopup("Error", result.message, "error");
      }
    } catch (error) {
      showPopup("Error", "Something went wrong. Please try again.", "error");
      console.error(error);
    }
  });
}


const resendBtn = document.querySelector(".resend-link");
if (resendBtn) {
  resendBtn.addEventListener("click", async function (e) {
    try {
      
      const response = await fetch("/resend-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const result = await response.json();

      if (result.success) {
        alert(
          "New code sent to your email.\nCode (for testing): " + result.code
        );
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      alert("Something went wrong");
    }
  });
}

const verify_token_form = document.querySelector("#verifyForm");

if (verify_token_form) {
  verify_token_form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const inputs = verify_token_form.querySelectorAll("input[type='text']");
    let code = "";

    const formData = new URLSearchParams();

    inputs.forEach((input, index) => {
      const digit = input.value.trim();
      code += digit;
      formData.append(`digit${index + 1}`, digit);
    });

    if (code.length !== 4 || isNaN(code)) {
      showPopup("Error", "Please enter a valid 4-digit code.", "error");
      return;
    }

    try {
      
      const response = await fetch("/verify-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      const result = await response.json();

      if (result.success) {
        showPopup("Success", result.message, "success");
        setTimeout(() => {
          window.location.href = result.redirect;
        }, 1500);
      } else {
        showPopup("Error", result.message, "error");
      }
    } catch (error) {
      showPopup("Error", "Something went wrong. Please try again.", "error");
      console.error(error);
    }
  });
}

const reset_pass_form = document.querySelector(".update-password-form");

if (reset_pass_form) {
  reset_pass_form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const pass = this.password.value.trim();
    const c_pass = this.c_password.value.trim();

   
    if (!pass || !c_pass) {
      showPopup("Error", "Please fill both fields", "error");
      return;
    }

    try {
     
      const response = await fetch("/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `password=${encodeURIComponent(
          pass
        )}&c_password=${encodeURIComponent(c_pass)}`,
      });

      const result = await response.json();

     
      if (result.success) {
        showPopup("Success", result.message, "success");
        setTimeout(() => {
          window.location.href = result.redirect; 
        }, 2000);
      } else {
        showPopup("Error", result.message, "error");
      }
    } catch (error) {
      console.error("Request failed", error);
      showPopup("Error", "An error occurred. Please try again.", "error"); 
    }
  });
}
