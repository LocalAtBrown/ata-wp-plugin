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
    /_sp_id\.[A-Za-z\d]+=([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12})\./;

  var delay = function (ms) {
    return new Promise((_) => setTimeout(_, ms));
console.log(cookiePattern);
  };

  var DELAY_MS = 250;
  var WAIT_MS = 30000;
  var ITERATIONS = WAIT_MS / DELAY_MS;

  for (var i = 0; i < ITERATIONS; i++) {
    var matches = cookiePattern.exec(document.cookie) || [];
    var userId = matches[1];
    // If no matches, try again after DELAY_MS ms
    if (userId === undefined) {
      console.log(i);
      await delay(DELAY_MS);
      continue;
    }

    console.log(`Found Snowplow User ID ${userId} after ${i * DELAY_MS}ms`);
    return userId;
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
  
  var modalShownInSession = sessionStorage.getItem("modalShownInSession");  

  if (localStorage.getItem("modalDisabled") === "disabled" || sessionStorage.getItem("modalShownInSession") === "true") {
    var body = document.querySelector("body");
    body.classList.add("newsletter-disabled");
  }
  if (group === "A" && localStorage.getItem("modalDisabled") !== "disabled" && modalShownInSession !== "true") {
    displayModal();
    localStorage.setItem("modalShown", "true");
  }
  if (group === "B" && localStorage.getItem("modalDisabled") !== "disabled" && modalShownInSession !== "true") {
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

      if (depth >= 30 && localStorage.getItem("modalDisabled") !== "disabled" && modalShownInSession !== "true") {
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
  modalClose.className = "mc-closeModal";
  modalClose.id = "modalClose";

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
    width: '100%',
    margin: '0 auto',
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
  if (window.location.href.includes('/newsletter') || document.querySelector('.category-obituaries')) {
    modal.dialog("destroy").remove();
  }	
}
// MAIN SCRIPT
jQuery(document).ready(async function ($) {
   
  var group = getGroupFromLocalStorage();
  // If there's already a group (i.e., subsequent visits)
  if (checkGroupIsValid(group)) {
    executeGroupLogic(group);
    sessionStorage.setItem("modalShownInSession", "true");
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