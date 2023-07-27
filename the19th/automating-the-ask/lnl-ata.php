<?php
/*
Plugin Name: Automating the Ask
Description: Custom WordPress plugin to handle A,B,C testing
Version: 1.0
Author: UXpertism Corporation
*/

// Enqueue CSS and JavaScript files
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

function automating_the_ask_enqueue_scripts() {
    if (is_callable('jetpack_is_mobile')) {
        if (jetpack_is_mobile()) {
            // Enqueue scripts and stylesheets
            wp_enqueue_script('jquery');
            wp_enqueue_script('jquery-ui-dialog');
            wp_enqueue_script('cryptojs-aes-format', plugins_url('/automating-the-ask-api-key-manager/cryptojs-aes-format.js'));
            wp_enqueue_style('jquery-ui-dialog', plugins_url('css/jquery-ui.css', __FILE__));
            wp_enqueue_script('automating-the-ask-scripts', plugins_url('js/automating-the-ask-scripts.js', __FILE__), array('jquery', 'jquery-ui-dialog'), '1.0', true);

            // Enqueue Custom CSS
            wp_enqueue_style('the19th-custom', plugins_url('css/the19th-custom.css', __FILE__));

            // Localize script to pass PHP variables to JavaScript
            $user_id = get_current_user_id();
            wp_localize_script('automating-the-ask-scripts', 'automating_the_ask_params', array(
                'ajax_url' => admin_url('admin-ajax.php'),
                'user_id' => $user_id
            ));

            // Enqueue custom HTML, CSS, and JS
            $custom_modal = get_option('automating_the_ask_custom_modal', '');
            $custom_css = get_option('automating_the_ask_custom_css', '');
            $custom_js = get_option('automating_the_ask_custom_js', '');

            wp_add_inline_style('jquery-ui-dialog', $custom_css);
            wp_add_inline_script('automating-the-ask-scripts', $custom_js);
        }
    }
}
add_action('wp_enqueue_scripts', 'automating_the_ask_enqueue_scripts');

// Enqueue CSS and JavaScript files for the admin page
function automating_the_ask_admin_enqueue_scripts() {
    wp_enqueue_style('automating-the-ask-admin-style', plugins_url('css/admin-style.css', __FILE__));
}
add_action('admin_enqueue_scripts', 'automating_the_ask_admin_enqueue_scripts');

// Sanitize and validate the submitted API key nonce
function sanitize_api_key_nonce($api_key_nonce) {
    $sanitized_api_key_nonce = sanitize_text_field($api_key_nonce);
    return $sanitized_api_key_nonce;
}

// Sanitize and validate the submitted API key
function sanitize_api_key($api_key) {
    $sanitized_api_key = sanitize_text_field($api_key);
    return $sanitized_api_key;
}

// Process the form submission
function process_api_key_form() {
    $my_api_key_nonce = filter_input(INPUT_POST, 'my_api_key_nonce', FILTER_SANITIZE_STRING);
    $api_key = filter_input(INPUT_POST, 'api_key', FILTER_SANITIZE_STRING);

    if (isset($_POST['submit_api_key']) && isset($api_key)) {
        // Verify the nonce for added security
        if (!empty($my_api_key_nonce) && wp_verify_nonce($my_api_key_nonce, 'update_api_key')) {
            $sanitized_api_key = sanitize_text_field($api_key);
            $user_id = esc_html(get_current_user_id());
            $group = 'default';
            $error = '';

            // API Key validation and processing logic
            if (!empty($sanitized_api_key)) {
                echo 'API Key submitted: ' . esc_html($sanitized_api_key) . '<br>';
            } else {
                // Output error message
                echo 'Error: Invalid API Key.<br>';
            }
        } else {
            // Nonce verification failed
            echo 'Error: Security check failed.<br>';
        }
    }
}

// Create a shortcode to display the API Key form
function api_key_form_shortcode($atts) {
    ob_start();
    process_api_key_form();
    ?>
    <form action="<?php echo esc_url(admin_url('admin-post.php')); ?>" method="POST">
        <?php wp_nonce_field('update_api_key', 'my_api_key_nonce'); ?>
        <label for="api_key">API Key:</label>
        <input type="text" name="api_key" id="api_key" required>
        <input type="submit" name="submit_api_key" value="Submit">
    </form>
    <?php
    return ob_get_clean();
}
add_shortcode('api_key_form', 'api_key_form_shortcode');
