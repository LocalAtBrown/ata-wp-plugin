<?php
// Retrieve the shortcode content using do_shortcode
$shortcode_content = do_shortcode('[ata_shortcode]');

// Return the shortcode content as JSON
echo wp_json_encode($shortcode_content);
