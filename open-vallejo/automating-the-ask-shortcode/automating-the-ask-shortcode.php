<?php
/**
 * Plugin Name: Automating the Ask HTML editor
 * Description: A plugin that adds an HTML editor for the modal popup.
 * Version: 1.0.0
 */

// Register the settings page
add_action('admin_menu', 'shortcode_plugin_register_settings_page');
function shortcode_plugin_register_settings_page() {
    add_options_page('Automating the Ask Shortcode Settings', 'Automating the Ask HTML editor', 'manage_options', 'shortcode-plugin-settings', 'shortcode_plugin_settings_page');
}

// Render the settings page
function shortcode_plugin_settings_page() {
    ?>
    <div class="wrap">
        <h1>Automating the Ask HTML editor</h1>
        <form method="post" action="options.php">
            <?php
            settings_fields('shortcode_plugin');
            do_settings_sections('shortcode_plugin');
            submit_button();
            ?>
        </form>
    </div>
    <?php
}

// Enqueue the script.js file
add_action('admin_enqueue_scripts', 'shortcode_plugin_enqueue_scripts');
function shortcode_plugin_enqueue_scripts($hook) {
    if ($hook === 'settings_page_shortcode-plugin-settings') {
        wp_enqueue_script('shortcode-plugin-js', plugin_dir_url(__FILE__) . 'script.js', array('jquery'), '1.0.0', true);
        wp_localize_script('shortcode-plugin-js', 'shortcodePluginAjax', array(
            'ajaxUrl' => admin_url('admin-ajax.php')
        ));
    }
}

// Register the shortcode
add_shortcode('ata_shortcode', 'shortcode_plugin_ata_shortcode');
function shortcode_plugin_ata_shortcode($atts) {
    // Retrieve the stored content from the settings
    $content = get_option('shortcode_plugin_content', '');
    
    // Allow HTML tags in the shortcode content
    $content = wp_kses_post($content);
    
    return $content;
}

// Register the plugin settings
add_action('admin_init', 'shortcode_plugin_register_settings');
function shortcode_plugin_register_settings() {
    register_setting('shortcode_plugin', 'shortcode_plugin_content');
    add_settings_section('shortcode_plugin_section', 'HTML Content', 'shortcode_plugin_section_callback', 'shortcode_plugin');
    add_settings_field('shortcode_plugin_content', 'Content', 'shortcode_plugin_content_callback', 'shortcode_plugin', 'shortcode_plugin_section');
}

// Render the content field
function shortcode_plugin_content_callback() {
    $content = get_option('shortcode_plugin_content', '');
    echo '<textarea name="shortcode_plugin_content" rows="5" cols="50">' . esc_textarea($content) . '</textarea>';
}

// Render the section description
function shortcode_plugin_section_callback() {
    echo '<p>Edit the HTML content for the Newsletter Modal</p>';
}

// Register the AJAX endpoint
add_action('wp_ajax_shortcode_plugin_get_shortcode', 'shortcode_plugin_get_shortcode');
add_action('wp_ajax_nopriv_shortcode_plugin_get_shortcode', 'shortcode_plugin_get_shortcode');
function shortcode_plugin_get_shortcode() {
    // Retrieve the shortcode content using do_shortcode
    $shortcode_content = do_shortcode('[ata_shortcode]');

    // Return the shortcode content as JSON
    echo wp_json_encode($shortcode_content);
    wp_die();
}
