jQuery(document).ready(function($) {
    var cookieName = "_sp_id.";
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf(cookieName) == 0) {
            var userId = cookie.substring(cookieName.length + 5, cookie.length);
		    console.log('User ID3:', userId);
            localStorage.setItem('User ID', userId);
            $.ajax({
                type: 'POST',
                url: groupFetcherData.ajaxUrl,
                data: {
                    action: 'fetch_group',
                    userId: userId,
                    nonce: groupFetcherData.nonce // Add nonce to the AJAX request
                },
                success: function(response) {
                    var data = JSON.parse(response);
                    if (data.group) {
                        localStorage.setItem('group', data.group);
                        console.log('User group:', data.group);
                    } else {
                        console.error('Failed to fetch user group:', data.error);
                    }
                },
                error: function() {
                    console.error('Failed to send AJAX request');
                }
            });
            break;
        }
    }
});
