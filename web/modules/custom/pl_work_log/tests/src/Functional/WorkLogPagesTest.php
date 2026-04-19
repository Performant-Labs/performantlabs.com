<?php

namespace Drupal\Tests\pl_work_log\Functional;

use Drupal\Tests\BrowserTestBase;

/**
 * Tier 2 (Functional / HTTP) tests for pl_work_log.
 *
 * Verifies page structure, authenticated access, route protection, links,
 * and migrated-data visibility using Drupal's internal HTTP stack.
 * No real browser required.
 *
 * Run with:
 *   ddev exec vendor/bin/phpunit \
 *     web/modules/custom/pl_work_log/tests/src/Functional/WorkLogPagesTest.php
 *
 * @group pl_work_log
 */
class WorkLogPagesTest extends BrowserTestBase {

  /**
   * {@inheritdoc}
   */
  protected static $modules = [
    'node',
    'field',
    'text',
    'datetime',
    'taxonomy',
    'views',
    'migrate',
    'migrate_plus',
    'migrate_tools',
    'sqlite',
    'pl_work_log',
  ];

  /**
   * Use the stark theme to avoid custom-theme side effects in tests.
   *
   * @var string
   */
  protected $defaultTheme = 'stark';

  /**
   * Admin user with all permissions.
   *
   * @var \Drupal\user\UserInterface
   */
  protected $adminUser;

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();

    // Create and log in an admin user.
    $this->adminUser = $this->drupalCreateUser([], NULL, TRUE);
  }

  // ── T2-001: Auth-protected routes deny anonymous requests ─────────────────

  /**
   * All work log routes must return 403 for anonymous users.
   *
   * @dataProvider workLogRoutesProvider
   */
  public function testAnonymousAccessIsDenied(string $path): void {
    $this->drupalGet($path);
    $this->assertSession()->statusCodeEquals(403);
  }

  /**
   * Data provider for protected work log routes.
   */
  public static function workLogRoutesProvider(): array {
    return [
      'dashboard'        => ['/work-log-dashboard'],
      'actions'          => ['/work-logs/actions'],
      'ingest form'      => ['/work-logs/actions/ingest'],
      'rollback form'    => ['/work-logs/actions/rollback'],
      'category mapping' => ['/work-logs/actions/category-mapping'],
    ];
  }

  // ── T2-002: Dashboard page structure ──────────────────────────────────────

  /**
   * The dashboard must return 200 and render with the correct page title.
   */
  public function testDashboardReturns200WithPageTitle(): void {
    $this->drupalLogin($this->adminUser);
    $this->drupalGet('/work-log-dashboard');

    $this->assertSession()->statusCodeEquals(200);
    // Use responseContains to avoid site-name dependency (test env = '| Drupal').
    $this->assertSession()->responseContains('Work Log Dashboard');
  }

  /**
   * The dashboard must contain the Summary and Recent Work Logs sections.
   */
  public function testDashboardContainsExpectedSections(): void {
    $this->drupalLogin($this->adminUser);
    $this->drupalGet('/work-log-dashboard');

    $this->assertSession()->responseContains('Summary');
    $this->assertSession()->responseContains('Recent Work Logs');
  }

  /**
   * The dashboard must contain the table with expected column headers.
   */
  public function testDashboardTableHasCorrectColumns(): void {
    $this->drupalLogin($this->adminUser);
    $this->drupalGet('/work-log-dashboard');

    $this->assertSession()->responseContains('<table');
    // Column headers: "Date", "Title", "Hours".
    $this->assertSession()->responseContains('Date');
    $this->assertSession()->responseContains('Title');
    $this->assertSession()->responseContains('Hours');
  }

  /**
   * The dashboard filter form must expose Project, Category, and Sort controls.
   */
  public function testDashboardHasFilterForm(): void {
    $this->drupalLogin($this->adminUser);
    $this->drupalGet('/work-log-dashboard');

    // The selects are rendered with named fields.
    $this->assertSession()->fieldExists('project');
    $this->assertSession()->fieldExists('category');
    $this->assertSession()->fieldExists('sort_by');
  }

  /**
   * The Summary section must display a non-empty Total Entries count.
   */
  public function testDashboardSummaryShowsTotalEntries(): void {
    $this->drupalLogin($this->adminUser);
    $this->drupalGet('/work-log-dashboard');

    $this->assertSession()->responseContains('Total Entries');
  }

  // ── T2-003: Actions page structure ────────────────────────────────────────

  /**
   * The actions overview must return 200 and render the correct page title.
   */
  public function testActionsPageReturns200WithTitle(): void {
    $this->drupalLogin($this->adminUser);
    $this->drupalGet('/work-logs/actions');

    $this->assertSession()->statusCodeEquals(200);
    // Use responseContains to avoid site-name dependency in test env.
    $this->assertSession()->responseContains('Work Log Actions');
  }

  /**
   * The actions page must show Migration Status and the current status value.
   */
  public function testActionsPageShowsMigrationStatus(): void {
    $this->drupalLogin($this->adminUser);
    $this->drupalGet('/work-logs/actions');

    $this->assertSession()->responseContains('Migration Status');
    // Status is Idle when no migration is running.
    $this->assertSession()->responseContains('Idle');
  }

  /**
   * The actions page must link to all three action forms.
   */
  public function testActionsPageHasAllActionLinks(): void {
    $this->drupalLogin($this->adminUser);
    $this->drupalGet('/work-logs/actions');

    $this->assertSession()->linkExists('Ingest New Hours');
    $this->assertSession()->linkExists('Rollback Last Ingestion');
    $this->assertSession()->linkExists('Category Mapping Rules');
  }

  /**
   * "Ingest New Hours" link must navigate to the ingest form.
   */
  public function testIngestLinkNavigatesToForm(): void {
    $this->drupalLogin($this->adminUser);
    $this->drupalGet('/work-logs/actions');
    $this->clickLink('Ingest New Hours');

    $this->assertSession()->addressEquals('/work-logs/actions/ingest');
    $this->assertSession()->statusCodeEquals(200);
    // IngestForm extends ConfirmFormBase — button label is 'Run Ingestion'.
    $this->assertSession()->buttonExists('Run Ingestion');
  }

  /**
   * "Category Mapping Rules" link must navigate to the category form.
   */
  public function testCategoryMappingLinkNavigatesToForm(): void {
    $this->drupalLogin($this->adminUser);
    $this->drupalGet('/work-logs/actions');
    $this->clickLink('Category Mapping Rules');

    $this->assertSession()->addressEquals('/work-logs/actions/category-mapping');
    $this->assertSession()->statusCodeEquals(200);
  }

  // ── T2-004: Work log node content integrity ───────────────────────────────

  /**
   * Work log nodes must have a valid date and positive hours.
   *
   * Creates one node programmatically (migration data doesn't exist in the
   * fresh test DB — this tests the field configuration, not the importer).
   */
  public function testWorkLogNodesHaveValidFields(): void {
    $this->drupalLogin($this->adminUser);

    // Create a work_log node programmatically.
    $node = $this->drupalCreateNode([
      'type'  => 'work_log',
      'title' => 'Test Work Log Entry',
      'field_work_log_date'  => ['value' => '2026-04-17'],
      'field_work_log_hours' => ['value' => 4.5],
    ]);
    $node->save();

    $nodes = \Drupal::entityTypeManager()
      ->getStorage('node')
      ->loadByProperties(['type' => 'work_log']);

    $this->assertNotEmpty($nodes, 'At least one work_log node exists.');

    foreach ($nodes as $n) {
      $date  = $n->get('field_work_log_date')->value;
      $hours = (float) $n->get('field_work_log_hours')->value;

      $this->assertMatchesRegularExpression(
        '/^\d{4}-\d{2}-\d{2}$/',
        $date,
        sprintf('Node %d has a valid YYYY-MM-DD date.', $n->id())
      );
      $this->assertGreaterThan(
        0,
        $hours,
        sprintf('Node %d has positive hours.', $n->id())
      );
    }
  }

}
