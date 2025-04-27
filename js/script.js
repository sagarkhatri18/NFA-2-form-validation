const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

function calculatePasswordStrength(password) {
  let score = 0;

  if (password.length >= 8) score += 20;
  if (/[a-z]/.test(password)) score += 20;
  if (/[A-Z]/.test(password)) score += 20;
  if (/\d/.test(password)) score += 20;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 20;

  return score;
}

function toggleBorderValidation(id, active = true) {
  $(`#${id}`).toggleClass("border-red-600", active);
}

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

const validators = {
  fullName: (value) =>
    value.length >= 3 ? "" : "Full Name must be at least 3 characters.",
  email: (value) =>
    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
      ? ""
      : "Invalid email format.",
  password: (value) => {
    if (!passwordRegex.test(value)) {
      return "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.";
    }
    return "";
  },
  confirmPassword: (value) =>
    value === $("#password").val() ? "" : "Passwords do not match.",
};

function validateField(id) {
  const value = $(`#${id}`).val();
  const message = validators[id] ? validators[id](value) : "";

  if (id === "password") {
    const strengthValue = calculatePasswordStrength(value);
    const strengthClass =
      strengthValue < 60
        ? "bg-red-600"
        : strengthValue > 90
        ? "bg-green-600"
        : "bg-orange-600";
    const strengthText =
      strengthValue < 60 ? "Weak" : strengthValue > 90 ? "Strong" : "Medium";

    $("#passwordStrength")
      .show()
      .removeClass("bg-red-600 bg-orange-600 bg-green-600")
      .addClass(strengthClass)
      .text(`Strength: ${strengthText} (${strengthValue}%)`);
  }

  if (message) {
    $(`#${id}Error`).text(message).show();
    return false;
  } else {
    $(`#${id}Error`).hide();
    return true;
  }
}

$(function () {
  $("#passwordStrength").hide();
  $("#registrationForm input").on("input", function () {
    validateField(this.id);
  });

  $("#registrationForm").on("submit", function (e) {
    e.preventDefault();
    let isValid = true;

    $("#registrationForm input").each(function () {
      if (!validateField(this.id)) isValid = false;
    });
    if (isValid) {
      const name = $("#fullName").val();
      const email = $("#email").val();
      const newsletter = $("#newsletter").is(":checked")
        ? "Subscribed"
        : "Not Subscribed";
      $("#successMessage")
        .html(
          `Thanks <strong>${name}</strong>!<br>Email: ${email}<br>${newsletter}`
        )
        .removeClass("hidden");
      $("#registrationForm").hide();
    }
  });
});
