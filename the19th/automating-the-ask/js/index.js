/**
 * Gets group assignment (A, B, C or null) from LocalStorage
 */
function getGroupFromLocalStorage() {
  var group = localStorage.getItem("group");
  return group;
}

/**
 * Validates group assignment (A, B or C)
 */
function checkGroupIsValid(group) {
  return ["A", "B", "C"].indexOf(group) >= 0;
}

/**
 * Gets Snowplow user ID from cookie set by Snowplow
 */
async function getSnowplowUserId() {
  var cookiePattern =
    /_sp_id\.[A-Za-z\d]+=([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12})\./g;

  var delay = function (ms) {
    return new Promise((_) => setTimeout(_, ms));
  };

  var DELAY_MS = 250;
  var WAIT_MS = 30000;
  var ITERATIONS = WAIT_MS / DELAY_MS;

  for (var i = 0; i < ITERATIONS; i++) {
    var matches = cookiePattern.exec(document.cookie);

    // If no matches, try again after DELAY_MS ms
    if (matches === null || matches[1] === undefined) {
      console.log(i);
      await delay(DELAY_MS);
      continue;
    }

    console.log(`Found Snowplow UserID after ${i * DELAY_MS}ms`);
    return matches[1];
  }

  console.warn(
    "Can't seem to grab Snowplow user ID. Did you enable third-party cookies?"
  );
}

/**
 * Executes CTA appearance logic depending on group assignment and modal status
 */
function executeGroupLogic(group) {
  document.body.id = "group-" + group.toLowerCase();

  if (localStorage.getItem("modalDisabled") === "disabled") {
    var body = document.querySelector("body");
    body.classList.add("newsletter-disabled");
  }

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

      if (depth >= 30 && localStorage.getItem("modalDisabled") !== "disabled") {
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

/**
 * Helper function to display the modal CTA
 */
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
  modalContentInner.insertAdjacentHTML(
    "beforeend",
    myScriptData.shortcodeContent
  );

  var modalClose = document.createElement("div");
  modalClose.className = "newsletter-cta-close";
  modalClose.id = "modalClose";

  var closeSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  closeSvg.setAttribute("width", "25");
  closeSvg.setAttribute("height", "25");
  closeSvg.setAttribute("viewBox", "0 0 25 25");
  closeSvg.setAttribute("fill", "none");
  closeSvg.className = "newsletter-cta-close-action";

  var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
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

// MAIN SCRIPT
jQuery(document).ready(async function ($) {
  var group = getGroupFromLocalStorage();

  // If there's already a group (i.e., subsequent visits)
  if (checkGroupIsValid(group)) {
    executeGroupLogic(group);
    return;
  }

  // If there's not yet a group (i.e., first visit)
  var userId = await getSnowplowUserId();

  // Get group assignment from server, then put into LocalStorage
  $.ajax({
    type: "POST",
    url: groupFetcherData.ajaxUrl,
    data: {
      action: "fetch_group",
      userId,
      nonce: groupFetcherData.nonce, // Add nonce to the AJAX request
    },
    // The success callback displays the CTA according to the group logic, among other things
    success: function (response) {
      var data = JSON.parse(response);
      group = data.group;
      if (checkGroupIsValid(group)) {
        localStorage.setItem("group", group);
        console.log("User group:", group);
        executeGroupLogic(group);
      } else {
        console.error("Failed to fetch user group:", data.error);
      }
    },
    error: function () {
      console.error("Failed to send AJAX request");
    },
  });
});
