(function () {
  "use strict";

  var form = document.getElementById("contact-form");
  if (!form) return;

  var status = document.getElementById("form-status");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;

    var data = new FormData(form);
    var name = String(data.get("name") || "").trim();
    var email = String(data.get("email") || "").trim();
    var message = String(data.get("message") || "").trim();

    var subject = "Website inquiry from " + name;
    var body = [
      "Name: " + name,
      "Email: " + email,
      "",
      message
    ].join("\n");

    window.location.href = "mailto:tamim@tamimrupo.com?subject=" +
      encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

    if (status) {
      status.textContent = "Your email app should open with the message filled in. If it doesn't, email tamim@tamimrupo.com directly.";
      status.classList.add("is-visible");
    }
  });
})();
