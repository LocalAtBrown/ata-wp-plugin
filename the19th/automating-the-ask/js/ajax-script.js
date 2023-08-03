jQuery(function($) {
    $.post(
        ajax_object.ajax_url, 
        {
            'action': 'call_api',
            'other_data': 'other_value'
        }, 
        function(response) {
            console.log('Got this from the server: ' + response);
        }
    );
});
