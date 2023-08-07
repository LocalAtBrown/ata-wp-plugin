document.addEventListener("DOMContentLoaded", function () {

  function get_group_for_user() {
    const groupID = localStorage.getItem("group");
    document.body.id = "group-" + groupID.toLowerCase();

    if (localStorage.getItem("modalDisabled") === "disabled") {
      var body = document.querySelector("body");
      body.classList.add("newsletter-disabled");
    }

    // Define group
    const group = groupID;

    if (group === "A" && localStorage.getItem("modalDisabled") !== "disabled") {
      var modalShown = localStorage.setItem("modalShown", "true");
      displayModal();
    }

    if (group === "B" && localStorage.getItem("modalDisabled") !== "disabled") {
      function getScrollDepth() {
        var scrollHeight = document.documentElement.scrollHeight;
        var clientHeight = document.documentElement.clientHeight;
        var scrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop;
        var totalHeight = scrollHeight - clientHeight;
        var scrolled = (scrollTop / totalHeight) * 100;
        return Math.round(scrolled);
      }

      function scrollHandler() {
        var depth = getScrollDepth();
        console.log("Scroll depth:", depth + "%");
        var actionPerformed = false;

        if (
          depth >= 30 &&
          localStorage.getItem("modalDisabled") !== "disabled"
        ) {
          console.log("Scroll depth is 30% or greater. Performing action...");
          actionPerformed = true;
          window.removeEventListener("scroll", scrollHandler);
          var modalShown = localStorage.setItem("modalShown", "true");
          displayModal();
        }
      }

      window.addEventListener("scroll", scrollHandler);
    } else if (localStorage.getItem("modalDisabled") === "disabled") {
      console.log("disabled");
    }
}
get_group_for_user();
  function displayModal() {
    var modalContent = document.createElement("div");
    modalContent.className = "newsletter";

    var modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "modalNewsletter";

    var modalDialog = document.createElement("div");
    modalDialog.className = "modal-dialog";

    var modalContentInner = document.createElement("div");
    modalContentInner.className = "modal-content";
    modalContentInner.insertAdjacentHTML('beforeend', myScriptData.shortcodeContent);

    var modalClose = document.createElement("div");
    modalClose.className = "newsletter-cta-close";
    modalClose.id = "modalClose";

    var closeSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    closeSvg.setAttribute("width", "25");
    closeSvg.setAttribute("height", "25");
    closeSvg.setAttribute("viewBox", "0 0 25 25");
    closeSvg.setAttribute("fill", "none");
    closeSvg.className = "newsletter-cta-close-action";

    var circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circle.setAttribute("cx", "12.5");
    circle.setAttribute("cy", "12.5");
    circle.setAttribute("r", "12.5");
    circle.setAttribute("fill", "#1C1542");

    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      "M13.9691 12.0837L17.9073 8.14516C18.1976 7.85446 18.1976 7.38373 17.9073 7.09303C17.6162 6.80232 17.1451 6.80232 16.8549 7.09303L12.9167 11.0312L8.97845 7.09303C8.68746 6.80232 8.21717 6.80232 7.92602 7.09303C7.63576 7.38373 7.63576 7.85446 7.92602 8.14516L11.8642 12.0837L7.92602 16.022C7.63576 16.3123 7.63576 16.7833 7.92602 17.0745C8.07196 17.2195 8.26203 17.2923 8.45224 17.2923C8.64304 17.2923 8.83325 17.2197 8.97831 17.0745L12.9165 13.1362L16.8547 17.0745C16.9998 17.2195 17.1907 17.2923 17.3808 17.2923C17.571 17.2923 17.7611 17.2197 17.907 17.0745C18.1973 16.7833 18.1973 16.3123 17.907 16.022L13.9691 12.0837Z"
    );
    path.setAttribute("fill", "#F8F8FC");

    closeSvg.appendChild(circle);
    closeSvg.appendChild(path);
    modalClose.appendChild(closeSvg);

    modalContentInner.appendChild(modalClose);
    modalDialog.appendChild(modalContentInner);
    modal.appendChild(modalDialog);
    modalContent.appendChild(modal);

    var modal = jQuery(modalContent).dialog({
      modal: true,
      draggable: false,
      resizable: false,
      show: "fade",
      hide: "fade",
      width: 400,
      dialogClass: "modal-dialog-class",
      close: function (event, ui) {
        jQuery(this).dialog("destroy").remove();
        localStorage.setItem("modalShown", "true");
      },
    });

    var hideButton = document.getElementById("modalClose");
    hideButton.addEventListener("click", function () {
      modal.dialog("destroy").remove();
    });
    var disableButton = document.getElementById("disable");
    disableButton.addEventListener("click", function () {
      localStorage.setItem("modalDisabled", "disabled");
    });
  }
});
