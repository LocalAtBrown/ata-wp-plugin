jQuery(document).ready(function($) {
  // Handler for deleting an API key.
  $('.api-key-delete').click(function(event) {
    event.preventDefault();
    var key = $(this).data('key');
    $.ajax({
      url: ajaxurl,
      type: 'POST',
      data: {
        action: 'api_key_manager_delete_key',
        key: key,
        nonce: api_key_manager.nonce
      },
      success: function(data) {
        if (data == 'success') {
          // Reload the page after deleting the API key.
          window.location.reload();
        } else {
          // Display an error message if the deletion fails.
          alert('An error occurred while deleting the API key.');
        }
      }
    });
  });
});
