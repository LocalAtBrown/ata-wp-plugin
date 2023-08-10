<?php
/*
Plugin Name: Automating the Ask
Description: Custom WordPress plugin to handle A,B,C testing
Version: 1.0
Author: UXpertism Corporation
*/

function fetch_group() {
    // Sanitize and verify nonce
    $nonce = isset($_POST['nonce']) ? sanitize_text_field($_POST['nonce']) : '';
    if (!wp_verify_nonce($nonce, 'fetch_group_nonce')) {
        echo wp_json_encode(['error' => 'Invalid nonce value']);
        wp_die();
    }

    if (!isset($_POST['userId'])) {
        echo wp_json_encode(['error' => 'No user ID set']);
        wp_die();
    }

    $userId = sanitize_text_field($_POST['userId']);
    $url = "https://ata-api.localnewslab.io/prescription/the-19th/$userId";
    $headers = [
        'x-api-key' => LNL_ATA_API_KEY
    ];

    $response = vip_safe_wp_remote_get($url, ['headers' => $headers]);

	if (is_wp_error($response)) {
    		wp_send_json_error(['error' => $response->get_error_message()]);
	} else {
    		wp_send_json($response['body']);
	}

    wp_die();
}
add_action('wp_ajax_fetch_group', 'fetch_group');
add_action('wp_ajax_nopriv_fetch_group', 'fetch_group');

function enqueue_scripts() {
    wp_enqueue_script('my-script', get_template_directory_uri() . '/js/script.js', array(), '1.0.0', true);
    wp_localize_script('my-script', 'myData', array(
        'userGroup' => get_option('user_group'),
    ));
}
add_action('wp_enqueue_scripts', 'enqueue_scripts');

// Enqueue HTML Editor 
function enqueue_my_script() {
    if (is_callable('jetpack_is_mobile')) {
        if (jetpack_is_mobile()) {
            wp_enqueue_script('my-script', '/wp-content/plugins/automating-the-ask-shortcode/script.js', array('jquery'), '1.0', true);
            wp_localize_script('my-script', 'myScriptData', array(
                'shortcodeContent' => do_shortcode('[ata_shortcode]')
            ));
        }
    }
}
add_action('wp_enqueue_scripts', 'enqueue_my_script');

// Enqueue CSS and JavaScript
function automating_the_ask_enqueue_scripts() {
    if (is_callable('jetpack_is_mobile')) {
        if (jetpack_is_mobile()) {
            // Enqueue scripts and stylesheets
            wp_enqueue_script('jquery');
            wp_enqueue_script('jquery-ui-dialog');
            wp_enqueue_style('jquery-ui-dialog', plugins_url('css/jquery-ui.css', __FILE__));
            wp_enqueue_script('automating-the-ask-scripts', plugins_url('js/index.js', __FILE__), array('jquery', 'jquery-ui-dialog'), '1.0', true);

            // Localize script with data for JavaScript
            wp_localize_script('automating-the-ask-scripts', 'groupFetcherData', [
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('fetch_group_nonce'), // create and add nonce here
            ]);

            // Enqueue Custom CSS
            wp_enqueue_style('the19th-custom', plugins_url('css/the19th-custom.css', __FILE__));
        }
    }
}
add_action('wp_enqueue_scripts', 'automating_the_ask_enqueue_scripts');

// Enqueue CSS and JavaScript files for the admin page
function automating_the_ask_admin_enqueue_scripts() {
    wp_enqueue_style('automating-the-ask-admin-style', plugins_url('css/admin-style.css', __FILE__));
}