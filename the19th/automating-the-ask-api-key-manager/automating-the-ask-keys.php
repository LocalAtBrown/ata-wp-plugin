<?php
/*
Plugin Name: Automating the Ask API Key Manager
Description: This plugin securely stores API keys and allows you to manage them.
Version: 1.0
Author: UXpertism Corporation
Author URI: https://uxpertism.com
*/

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

function api_key_manager_enqueue_scripts() {
    wp_enqueue_script('api-key-manager', plugin_dir_url(__FILE__) . 'api-key-manager.js', array('jquery'), '1.0.0', true);
}
add_action('admin_enqueue_scripts', 'api_key_manager_enqueue_scripts');

// Add the menu item.
add_action('admin_menu', 'api_key_manager_menu');
function api_key_manager_menu() {
    add_options_page(
        'Automating the Ask API Key Manager',
        'Automating the Ask API Key Manager',
        'manage_options',
        'api_key_manager',
        'api_key_manager_page',
        'dashicons-lock'
    );
}

// Display the main page content.
function api_key_manager_page() {
    $api_keys = get_option('api_keys', array());
    if (isset($_POST['api_key_manager_nonce']) && isset($_POST['api_key_manager_nonce'])) {
        // Verify nonce
        $api_key_manager_nonce = sanitize_text_field($_POST['api_key_manager_nonce']);
        if (wp_verify_nonce($api_key_manager_nonce, 'api_key_manager_add_key')) {
            $api_key = isset($_POST['api_key']) ? sanitize_key($_POST['api_key']) : '';
            $api_value = isset($_POST['api_value']) ? sanitize_text_field($_POST['api_value']) : '';

            if (!empty($api_key) && !empty($api_value)) {
                $api_keys[$api_key] = $api_value;
                update_option('api_keys', $api_keys);
            } else {
                // Handle empty fields error or display a message.
            }
        } else {
            // Nonce verification failed, handle the error or display a message.
        }
    }

    if (isset($_GET['action']) && isset($_GET['api_key_manager_nonce'])) {
        // Verify nonce
        $api_key_manager_nonce = sanitize_text_field($_GET['api_key_manager_nonce']);
        if (wp_verify_nonce($api_key_manager_nonce, 'api_key_manager_nonce_action')) {
            if ($_GET['action'] === 'delete' && isset($_GET['api_key'])) {
                $api_key = sanitize_key($_GET['api_key']);
                unset($api_keys[$api_key]);
                update_option('api_keys', $api_keys);
            }
        } else {
            // Nonce verification failed, handle the error or display a message.
        }
    }
?>
<div class="wrap">
    <h1>API Key Manager</h1>
    <h2>Add API Key</h2>
    <form method="post">
        <table class="form-table">
            <tbody>
                <tr>
                    <th scope="row"><label for="api_key">API Key Name</label></th>
                    <td><input name="api_key" type="text" id="api_key" class="regular-text"></td>
                </tr>
                <tr>
                    <th scope="row"><label for="api_value">API Key Value</label></th>
                    <td><input name="api_value" type="text" id="api_value" class="regular-text"></td>
                </tr>
            </tbody>
        </table>
         <?php wp_nonce_field('api_key_manager_add_key', 'api_key_manager_nonce'); ?>

        <p class="submit"><input type="submit" name="submit" id="submit" class="button button-primary" value="Add API Key"></p>
    </form>
    <h2>Active API Keys</h2>
    <?php if (empty($api_keys)) : ?>
    <p>No API keys found.</p>
    <?php else : ?>
    <table class="wp-list-table widefat striped">
        <thead>
            <tr>
                <th>API Key Name</th>
                <th>API Key Value</th>
                <!-- <th>Actions</th> -->
            </tr>
        </thead>
        <tbody>
            <?php foreach ($api_keys as $key => $value) : ?>
            <tr>
                <td><?php echo esc_html($key); ?></td>
                <td>
                    <span class="hidden-value"><?php echo esc_html($value); ?></span>
                </td>
                <!-- <td>
                    <a href="<?php echo esc_url(add_query_arg(array('page' => 'api_key_manager', 'api_key' => $key, 'action' => 'delete'), admin_url('admin.php'))); ?>" class="button">Delete</a>

                </td> -->
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
    <?php endif; ?>
</div>
<?php
}

include(dirname( __FILE__ ).'/CryptoJsAes.php');
add_action('wp_enqueue_scripts', 'enqueue_my_scripts');
function enqueue_my_scripts() {
    $password = "rkwfPafUMSiZtAsdfrtvblF0JM07";
    wp_enqueue_script('cryptojs-aes', plugin_dir_url(__FILE__).'cryptojs-aes.js', array('jquery'),wp_rand(),true);
    wp_enqueue_script('cryptojs-aes-format', plugin_dir_url(__FILE__).'cryptojs-aes-format.js', array('jquery'),wp_rand(),true);
    wp_enqueue_script('my-script', plugin_dir_url(__FILE__).'script.js', array('jquery'),wp_rand(),true);
    $api_keys = get_option('api_keys', array());
    $encrypted = CryptoJsAes::encrypt($api_keys, $password);
    $admin_url = strtok( admin_url( 'admin-ajax.php', ( is_ssl() ? 'https' : 'http' ) ), '?' );
    wp_localize_script( 'my-script','MyAjax', array(
        'ajaxurl' => $admin_url,
        'jsondata' => $encrypted
    ));
}
function api_key_manager_enqueue_styles() {
    wp_enqueue_style('api-key-manager-style', plugin_dir_url(__FILE__) . 'css/api-key-manager.css');
}
add_action('admin_enqueue_scripts', 'api_key_manager_enqueue_styles');
