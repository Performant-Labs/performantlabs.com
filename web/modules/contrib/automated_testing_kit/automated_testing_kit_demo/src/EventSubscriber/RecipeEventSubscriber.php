<?php

namespace Drupal\automated_testing_kit_demo\EventSubscriber;

use Drupal\Core\Recipe\RecipeAppliedEvent;
use Drupal\Core\CronInterface;
use Drupal\Core\Logger\LoggerChannelFactoryInterface;
use Drupal\Core\Messenger\MessengerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Class RecipeEventSubscriber.
 */
class RecipeEventSubscriber implements EventSubscriberInterface {

  /**
   * The logger factory.
   *
   * @var \Drupal\Core\Logger\LoggerChannelFactoryInterface
   */
  protected $loggerFactory;

  /**
   * The cron service.
   *
   * @var \Drupal\Core\CronInterface
   */
  protected $cron;

   /**
   * The messenger service.
   *
   * @var \Drupal\Core\CronInterface
   */
  protected $messenger;

  /**
   * Constructs a new RecipeEventSubscriber object.
   *
   * @param \Drupal\Core\Logger\LoggerChannelFactoryInterface $logger_factory
   *   The logger factory service.
   */
  public function __construct(LoggerChannelFactoryInterface $logger_factory, CronInterface $cron) {
    $this->loggerFactory = $logger_factory;
    $this->cron = $cron;
  }

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    return [
      RecipeAppliedEvent::class => ['onRecipeApplied'],
    ];
  }

  /**
   * React to the ATK Drupal Demo recipe being applied.
   *
   * @param \Drupal\automated_testing_kit_demo\Event\RecipeAppliedEvent $event
   *   The event object.
   */
  public function onRecipeApplied(RecipeAppliedEvent $event) {
    $recipe = $event->recipe;
    $name = $recipe->name;

    if ($name == 'Automated Testing Kit - Demonstration Recipe') {
      //
      // Copy tests and configuration files to the project root.
      //
      $cwd = getcwd();
      $this->loggerFactory->get('automated_testing_kit_demo')->info('cwd: ' . $cwd);

      $commands = 'export ATK_HOME=.. && modules/contrib/automated_testing_kit/module_support/atk_setup playwright';
      $output = shell_exec($commands);

      //
      // Adjust the Drush alias to work with DDEV.
      //
      $filepath = '../playwright.atk.config.js';
      $this->replaceLineInFile($filepath, 'drushCmd', '  drushCmd: "ddev drush",');

      //
      // Update playwright.config.js with the site URL from the DDEV configuration.
      //

      // Determine if the connection is secure.
      $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';

      // Retrieve the host and port from the server variables.
      $host = $_SERVER['HTTP_HOST'];

      // Construct the full URL.
      $currentSiteUrl = "{$protocol}://{$host}/";

      // Uncomment for debugging.
      // $this->loggerFactory->get('automated_testing_kit_demo')->info('Current site URL: ' . $currentSiteUrl);

      $filepath = '../playwright.config.js';
      $this->replaceLineInFile($filepath, 'baseURL: ', "    baseURL: '" . $currentSiteUrl . "',");

      //
      // Run cron to index the site.
      //
      $this->cron->run();
    }
  }

  /**
   * Replace a specific line in a file based on a search key
   *
   * @param string $filepath Path to the file to modify
   * @param string $searchKey String to search for in each line
   * @param string $replacementLine New line to replace the matched line (should include newline if needed)
   * @return bool True if operation was successful, false otherwise
   */
  public static function replaceLineInFile(string $filepath, string $searchKey, string $replacementLine): bool
  {
    // Check if file exists and is writable.
    if (!file_exists($filepath) || !is_writable($filepath)) {
      return false;
    }

    // Read file into array.
    $lines = file($filepath);
    if ($lines === false) {
      return false;
    }

    // Search for the line containing the search key
    $matchedLine = -1;
    foreach ($lines as $i => $line) {
      if (strpos($line, $searchKey) !== false) {
        $matchedLine = $i;
        break;
      }
    }

    // If no matching line found, return false
    if ($matchedLine === -1) {
      return false;
    }

    // Get the line ending from the original line
    $lineEnding = "";
    if (preg_match('/\R$/', $lines[$matchedLine], $matches)) {
        $lineEnding = $matches[0];
    } elseif ($matchedLine < count($lines) - 1) {
        // If this isn't the last line, default to \n
        $lineEnding = "\n";
    }

    // Replace the line, ensuring it has the same line ending
    $lines[$matchedLine] = rtrim($replacementLine, "\r\n") . $lineEnding;

    // Write back to file
    if (!file_put_contents($filepath, implode('', $lines))) {
      return false;
    }

    return true;
  }
}