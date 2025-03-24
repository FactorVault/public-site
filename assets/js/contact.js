(function ($) {
  $(document).ready(function () {
    // Setup CSRF
    $.get("https://api.factorvault.com/api/v1/contact/csrf", function (data) {
      $("input[name='_csrf']").val(data.csrfToken);
    });

    // Validator functions
    function checkName() {
      if (!$("#name").val().trim()) {
        $("#nameError.error").remove();
        $("#name").after(
          "<p id='nameError' class='error validation-error'>Enter a valid name.</p>"
        );
        return false;
      } else {
        $("#nameError.error").remove();
        return true;
      }
    }

    function checkEmail() {
      const email = $("#email").val().trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if ((email && !emailPattern.test(email)) || !email) {
        $("#emailError.error").remove();
        $("#email").after(
          "<p id='emailError' class='error validation-error'>Enter a valid email address.</p>"
        );
        return false;
      } else {
        $("#emailError.error").remove();
        return true;
      }
    }

    function checkCategory() {
      if (!$("#category").val()) {
        $("#catError.error").remove();
        $("#category").after(
          "<p id='catError' class='error validation-error'>Please select a category.</p>"
        );
        return false;
      } else {
        $("#catError.error").remove();
        return true;
      }
    }

    function checkMessage() {
      if (!$("#message").val()) {
        $("#messageError.error").remove();
        $("#message").after(
          "<p id='messageError' class='error validation-error'>Please enter a message.</p>"
        );
        return false;
      } else {
        $("#messageError.error").remove();
        return true;
      }
    }

    // Event handlers
    $("#name").on("keyup blur", function () {
      checkName();
    });

    $("#email").on("keyup blur", function () {
      checkEmail();
    });

    $("#category").on("keyup blur", function () {
      checkCategory();
    });

    $("#message").on("keyup blur", function () {
      checkMessage();
    });

    // Submit handlers
    window.onSubmit = function () {
      $("#contact").submit();
    };

    $("#contact").on("submit", function (e) {
      e.preventDefault();

      var nameValid = checkName();
      var emailValid = checkEmail();
      var catValid = checkCategory();
      var messageValid = checkMessage();

      if (nameValid && emailValid && catValid && messageValid) {
        $("#contact").append(
          "<p id='progress' class='validation-progress'>Submitting...</p>"
        );

        var formData = {
          name: $("#name").val().trim(),
          email: $("#email").val().trim(),
          category: $("#category").val(),
          message: $("#message").val().trim(),
          recaptcha: grecaptcha.getResponse(),
          _csrf: $("input[name='_csrf']").val(),
        };

        $.ajax({
          url: "https://api.factorvault.com/api/v1/contact",
          type: "POST",
          data: JSON.stringify(formData),
          contentType: "application/json",
          dataType: "json",
          success: () => {
            $("#progress").remove();
            $("#contact").append(
              "<p id='success' class='validation-success'>Your message has been sent successfully!</p>"
            );
            $("#contact")[0].reset();
            setTimeout(() => {
              $("#success").remove();
            }, 2000);
          },
          error: () => {
            $("#progress").remove();
            $("#contact").append(
              "<p id='error' class='validation-error'>There was an error submitting the form. Please try again later.</p>"
            );
            setTimeout(() => {
              $("#error").remove();
            }, 3000);
          },
        });
      }
    });

    $("#cancel").on("click", function () {
      $(".error").remove();
      $("#contact")[0].reset();
    });
  });
})(jQuery);
