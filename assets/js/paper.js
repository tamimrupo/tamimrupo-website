(function () {
  "use strict";

  var yearNodes = document.querySelectorAll("[data-year]");
  var year = String(new Date().getFullYear());
  yearNodes.forEach(function (node) {
    node.textContent = year;
  });

  var timeNodes = document.querySelectorAll("[data-dhaka-time]");
  if (timeNodes.length) {
    var formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Dhaka",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });

    var updateTime = function () {
      var time = formatter.format(new Date());
      timeNodes.forEach(function (node) {
        node.textContent = time;
      });
    };

    updateTime();
    window.setInterval(updateTime, 30000);
  }
})();
