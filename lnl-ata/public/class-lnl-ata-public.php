<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Lnl_Ata
 * @subpackage Lnl_Ata/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Lnl_Ata
 * @subpackage Lnl_Ata/public
 * @author     Your Name <email@example.com>
 */
class Lnl_Ata_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $lnl_ata    The ID of this plugin.
	 */
	private $lnl_ata;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $lnl_ata       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $lnl_ata, $version ) {

		$this->lnl_ata = $lnl_ata;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Lnl_Ata_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Lnl_Ata_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->lnl_ata, plugin_dir_url( __FILE__ ) . 'css/lnl-ata-public.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Lnl_Ata_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Lnl_Ata_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script( $this->lnl_ata, plugin_dir_url( __FILE__ ) . 'js/lnl-ata-public.js', array( 'jquery' ), $this->version, false );

	}

}
