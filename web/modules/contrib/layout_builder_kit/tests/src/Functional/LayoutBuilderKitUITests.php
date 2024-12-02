<?php

namespace Drupal\Tests\layout_builder_kit\Functional;

use Drupal\Core\Url;
use Drupal\Tests\BrowserTestBase;

/**
 * Test for Layout Builder Kit
 *
 * @group layout_builder_kit
 */
class LayoutBuilderKitUITests extends BrowserTestBase {
  protected $defaultTheme = 'stark';

  protected $strictConfigSchema = FALSE;

  protected static $modules = ['layout_builder_kit'];

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();

//    $this->user = $this->drupalCreateUser(array(
//      'access administration pages',
//    ));
//
//    $this->container->get('router.builder')->rebuild();
  }

  /**
   * Tests the layout_builder_kit::help function.
   */
  public function testLayoutBuilderKitModuleHelp() {

    // Build initial paths.
    $lbkConfigUrl = Url::fromRoute('layout_builder_kit.layout_builder_kit_settings', [], ['absolute' => FALSE])->toString();

    // Create user for testing.
    $this->adminUser = $this->drupalCreateUser(['access layout builder kit components']);

    // Login the admin user.
    $this->drupalLogin($this->adminUser);

    // Access to config page.
    $this->drupalGet($lbkConfigUrl);

    // Check the response returned by Drupal.
    $this->assertSession()->statusCodeEquals(200);

    // Mock a route name and a RouteMatchInterface object.
//    $route_name = '/admin/help/layout_builder_kit';
//    $route_match = $this->createMock(\Drupal\Core\Routing\RouteMatchInterface::class);
//
//    // Call the function to be tested.
//    $output = layout_builder_kit_help($route_name, $route_match);
//    dump("**Show this**:". $output);
//
//    $this->assertNotEmpty($output);
  }

  /**
   * Tests the layout_builder_kit::help function.
   */
  public function testLayoutBuilderKitConfiguration() {

    // Login.
//    $this->drupalLogin($this->user);

  }

}

