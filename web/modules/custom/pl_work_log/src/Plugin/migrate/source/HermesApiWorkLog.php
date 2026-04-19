<?php

namespace Drupal\pl_work_log\Plugin\migrate\source;

use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Site\Settings;
use Drupal\migrate\Plugin\migrate\source\SourcePluginBase;
use Drupal\migrate\Plugin\MigrationInterface;
use Drupal\migrate\Row;
use GuzzleHttp\ClientInterface;
use GuzzleHttp\Exception\GuzzleException;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Source plugin that fetches work logs from the Hermes REST API.
 *
 * Configuration options:
 * - api_url: (optional) Full URL to the work-logs endpoint. Falls back to
 *   the 'hermes_api_url' Drupal setting, then the HERMES_API_URL env var.
 * - api_token: (optional) Bearer token. Falls back to the 'hermes_api_token'
 *   Drupal setting, then the HERMES_API_TOKEN env var.
 *
 * @MigrateSource(
 *   id = "hermes_api_work_log",
 *   source_module = "pl_work_log"
 * )
 */
class HermesApiWorkLog extends SourcePluginBase implements ContainerFactoryPluginInterface {

  /**
   * The HTTP client.
   *
   * @var \GuzzleHttp\ClientInterface
   */
  protected ClientInterface $httpClient;

  /**
   * The logger.
   *
   * @var \Psr\Log\LoggerInterface
   */
  protected LoggerInterface $logger;

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition, MigrationInterface $migration = NULL) {
    $instance = new static($configuration, $plugin_id, $plugin_definition, $migration);
    $instance->httpClient = $container->get('http_client');
    $instance->logger = $container->get('logger.factory')->get('pl_work_log');
    return $instance;
  }

  /**
   * {@inheritdoc}
   */
  protected function initializeIterator() {
    $url = $this->configuration['api_url']
      ?? Settings::get('hermes_api_url')
      ?? getenv('HERMES_API_URL');
    $token = $this->configuration['api_token']
      ?? Settings::get('hermes_api_token')
      ?? getenv('HERMES_API_TOKEN');

    if (empty($url)) {
      $this->logger->error('Hermes API URL not configured. Set HERMES_API_URL env var or hermes_api_url in settings.php.');
      return new \ArrayIterator([]);
    }

    if (empty($token)) {
      $this->logger->error('Hermes API token not configured. Set HERMES_API_TOKEN env var or hermes_api_token in settings.php.');
      return new \ArrayIterator([]);
    }

    try {
      $response = $this->httpClient->request('GET', $url, [
        'headers' => [
          'Authorization' => 'Bearer ' . $token,
          'Accept' => 'application/json',
        ],
        'timeout' => 30,
      ]);
    }
    catch (GuzzleException $e) {
      $this->logger->error('Failed to fetch work logs from Hermes API: @error', [
        '@error' => $e->getMessage(),
      ]);
      return new \ArrayIterator([]);
    }

    $status = $response->getStatusCode();
    if ($status !== 200) {
      $this->logger->error('Hermes API returned HTTP @code', ['@code' => $status]);
      return new \ArrayIterator([]);
    }

    $body = json_decode((string) $response->getBody(), TRUE);
    if (!is_array($body) || !isset($body['data'])) {
      $this->logger->error('Unexpected response format from Hermes API.');
      return new \ArrayIterator([]);
    }

    $count = $body['meta']['count'] ?? count($body['data']);
    $this->logger->info('Fetched @count work logs from Hermes API.', ['@count' => $count]);

    return new \ArrayIterator($body['data']);
  }

  /**
   * {@inheritdoc}
   */
  public function fields() {
    return [
      'id' => $this->t('Primary key / Google Calendar event ID'),
      'date' => $this->t('Work log date (YYYY-MM-DD)'),
      'title' => $this->t('Work log title'),
      'hours' => $this->t('Duration in decimal hours'),
      'event_id' => $this->t('Google Calendar event ID'),
      'ingested_at' => $this->t('ISO-8601 UTC ingest timestamp'),
      'project_id' => $this->t('Project machine name'),
      'category' => $this->t('Category machine name'),
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getIds() {
    return [
      'id' => [
        'type' => 'string',
        'max_length' => 255,
      ],
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function prepareRow(Row $row) {
    if (!parent::prepareRow($row)) {
      return FALSE;
    }

    // Convert ingested_at from ISO-8601 to Drupal datetime format.
    $ingested_at = $row->getSourceProperty('ingested_at');
    if ($ingested_at) {
      // Strip trailing 'Z' and ensure format is Y-m-d\TH:i:s.
      $ingested_at = rtrim($ingested_at, 'Z');
      $row->setSourceProperty('ingested_at', $ingested_at);
    }

    return TRUE;
  }

  /**
   * {@inheritdoc}
   */
  public function __toString() {
    return 'Hermes API Work Logs';
  }

}
