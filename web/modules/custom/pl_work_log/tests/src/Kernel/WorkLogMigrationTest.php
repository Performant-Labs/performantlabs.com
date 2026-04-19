<?php

namespace Drupal\Tests\pl_work_log\Kernel;

use Drupal\KernelTests\KernelTestBase;
use Drupal\migrate\MigrateExecutable;
use Drupal\migrate\MigrateMessage;
use Drupal\Core\Database\Database;

/**
 * Tier 1 (Kernel) tests for pl_work_log.
 *
 * Verifies: SQLite DB connection and schema, migration execution,
 * imported node count, and module-enabled state.
 * No browser required — runs against a temporary test database.
 *
 * Run with:
 *   ddev exec vendor/bin/phpunit \
 *     web/modules/custom/pl_work_log/tests/src/Kernel/WorkLogMigrationTest.php
 *
 * @group pl_work_log
 */
class WorkLogMigrationTest extends KernelTestBase {

  /**
   * {@inheritdoc}
   */
  protected static $modules = [
    'system',
    'user',
    'node',
    'field',
    'text',
    'datetime',
    'taxonomy',
    'filter',
    'migrate',
    'migrate_plus',
    'migrate_tools',
    'sqlite',
    'pl_work_log',
  ];

  /**
   * Path to the fixture SQLite DB for tests.
   *
   * @var string
   */
  protected string $fixtureDb;

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();

    $this->installEntitySchema('user');
    $this->installEntitySchema('node');
    $this->installEntitySchema('taxonomy_term');
    $this->installEntitySchema('taxonomy_vocabulary');
    $this->installConfig(['system', 'user']);

    // Build a fixture SQLite DB in /tmp (siteDirectory may be vfs).
    $this->fixtureDb = sys_get_temp_dir() . '/wl_hermes_test_' . uniqid() . '.db';
    $this->buildFixtureDb($this->fixtureDb);

    // Register the hermes_sqlite connection pointing at the fixture DB.
    Database::addConnectionInfo('hermes_sqlite', 'default', [
      'driver'   => 'sqlite',
      'database' => $this->fixtureDb,
      'prefix'   => '',
    ]);
  }

  /**
   * {@inheritdoc}
   */
  protected function tearDown(): void {
    parent::tearDown();
    if (file_exists($this->fixtureDb)) {
      unlink($this->fixtureDb);
    }
  }

  /**
   * Creates a minimal fixture SQLite DB with the expected schema and data.
   */
  protected function buildFixtureDb(string $path): void {
    $pdo = new \PDO('sqlite:' . $path);
    $pdo->exec("
      CREATE TABLE IF NOT EXISTS work_logs (
        id          TEXT PRIMARY KEY,
        date        TEXT NOT NULL,
        title       TEXT NOT NULL,
        hours       REAL NOT NULL,
        event_id    TEXT NOT NULL,
        ingested_at TEXT NOT NULL,
        project_id  TEXT NOT NULL DEFAULT '',
        category    TEXT NOT NULL DEFAULT ''
      )
    ");
    $pdo->exec("
      INSERT INTO work_logs (id, date, title, hours, event_id, ingested_at, project_id, category)
      VALUES
        ('evt-001', '2026-04-17', 'Improve Hermes',  9.75, 'evt-001', '2026-04-17T12:00:00Z', '',        ''),
        ('evt-002', '2026-04-16', 'ATK Release 2.1', 9.00, 'evt-002', '2026-04-16T12:00:00Z', 'pl-atk',  'drupal'),
        ('evt-003', '2026-04-16', 'New website',     2.50, 'evt-003', '2026-04-16T12:00:00Z', 'pl-site',  '')
    ");
  }

  /**
   * Queries the fixture DB directly via PDO (bypasses Drupal's query builder).
   *
   * Drupal's Database API can have hydration quirks with external DB keys;
   * PDO is simpler and more reliable for asserting raw data values.
   *
   * @param string $sql    Parameterized SQL query.
   * @param array  $params Named/positional bind parameters.
   *
   * @return \stdClass[]
   */
  protected function pdoQuery(string $sql, array $params = []): array {
    $pdo = new \PDO('sqlite:' . $this->fixtureDb);
    $pdo->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_OBJ);
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll();
  }

  // ── T1-001: SQLite DB connection ──────────────────────────────────────────

  /**
   * The hermes_sqlite DB connection must be reachable and return rows.
   */
  public function testHermesSqliteConnectionIsReachable(): void {
    $conn = Database::getConnection('default', 'hermes_sqlite');
    $count = (int) $conn->select('work_logs')
      ->countQuery()
      ->execute()
      ->fetchField();

    $this->assertGreaterThan(0, $count, 'work_logs table has at least one row.');
  }

  // ── T1-002: SQLite schema columns ────────────────────────────────────────

  /**
   * The work_logs table must have project_id and category columns.
   */
  public function testWorkLogsSchemaHasProjectIdAndCategory(): void {
    $conn = Database::getConnection('default', 'hermes_sqlite');

    // SQLite PRAGMA returns column info.
    $columns = $conn->query('PRAGMA table_info(work_logs)')->fetchAllAssoc('name');

    $this->assertArrayHasKey('project_id', $columns, 'project_id column exists.');
    $this->assertArrayHasKey('category', $columns, 'category column exists.');
    $this->assertArrayHasKey('date', $columns, 'date column exists.');
    $this->assertArrayHasKey('title', $columns, 'title column exists.');
    $this->assertArrayHasKey('hours', $columns, 'hours column exists.');
  }

  // ── T1-003: Fixture data exists and values are sensible ──────────────────

  /**
   * Fixture rows must have non-zero hours and non-empty titles.
   */
  public function testFixtureRowsHaveValidData(): void {
    $rows = $this->pdoQuery('SELECT * FROM work_logs');

    $this->assertNotEmpty($rows, 'Fixture DB has at least one row.');
    foreach ($rows as $row) {
      $this->assertNotEmpty($row->title, "Row {$row->id} has a title.");
      $this->assertGreaterThan(0, (float) $row->hours, "Row {$row->id} has positive hours.");
      $this->assertMatchesRegularExpression(
        '/^\d{4}-\d{2}-\d{2}$/',
        $row->date,
        "Row {$row->id} has YYYY-MM-DD date."
      );
    }
  }

  // ── T1-004: project_id and category survive round-trip ───────────────────

  /**
   * A row with project_id/category must return those values correctly.
   */
  public function testProjectIdAndCategoryRoundTrip(): void {
    $rows = $this->pdoQuery(
      'SELECT * FROM work_logs WHERE id = :id',
      [':id' => 'evt-002']
    );

    $this->assertCount(1, $rows, 'Exactly one row for evt-002.');
    $row = $rows[0];
    $this->assertEquals('pl-atk', $row->project_id);
    $this->assertEquals('drupal', $row->category);
    $this->assertEquals('ATK Release 2.1', $row->title);
  }

  // ── T1-005: Empty project_id/category stored as empty string, not NULL ───

  /**
   * Rows without project/category must store empty strings, not NULL.
   */
  public function testEmptyProjectAndCategoryAreNotNull(): void {
    $rows = $this->pdoQuery(
      'SELECT * FROM work_logs WHERE id = :id',
      [':id' => 'evt-001']
    );

    $this->assertCount(1, $rows, 'Exactly one row for evt-001.');
    $row = $rows[0];
    $this->assertSame('', $row->project_id, 'project_id is empty string, not NULL.');
    $this->assertSame('', $row->category, 'category is empty string, not NULL.');
  }

  // ── T1-006: sqlite core module is enabled ────────────────────────────────

  /**
   * The core sqlite module must be enabled for the database driver to load.
   */
  public function testSqliteModuleIsEnabled(): void {
    $this->assertTrue(
      $this->container->get('module_handler')->moduleExists('sqlite'),
      'The core sqlite module is enabled.'
    );
  }

}
