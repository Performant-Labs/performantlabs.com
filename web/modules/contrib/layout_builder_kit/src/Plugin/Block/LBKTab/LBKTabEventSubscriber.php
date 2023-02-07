<?php

namespace Drupal\layout_builder_kit\Plugin\Block\LBKTab;

use Drupal\Core\Logger\LoggerChannelFactoryInterface;
use Drupal\core_event_dispatcher\Event\Theme\ThemeEvent;
use Drupal\core_event_dispatcher\ThemeHookEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Class LBKTabEventSubscriber.
 *
 * @package Drupal\layout_builder_kit
 */
class LBKTabEventSubscriber implements EventSubscriberInterface {

  /**
   * Logger Factory service.
   *
   * @var \Drupal\Core\Logger\LoggerChannelFactoryInterface
   */
  protected $loggerFactory;

  /**
   * LBKTabEventSubscriber constructor.
   */
  public function __construct(LoggerChannelFactoryInterface $loggerFactory) {
    $this->loggerFactory = $loggerFactory;
  }

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    $events = [];

    // TODO: the hardcoded string isn't correct but ThemeHookEvents::THEME isn't
    // available when we need it. See https://www.drupal.org/project/layout_builder_kit/issues/3282326
    // $events[ThemeHookEvents::THEME][] = ['themeEvent'];
    $events['hook_event_dispatcher.theme'][] = ['themeEvent'];
    return $events;
  }

  /**
   * Theme event.
   *
   * @param \Drupal\core_event_dispatcher\Event\Theme\ThemeEvent $event
   *   The event.
   */
  public function themeEvent(ThemeEvent $event) {
    $modulePath = \Drupal::service('extension.list.module')->getPath('layout_builder_kit');

    $newThemes = [
      'LBKTab' => [
        'template' => 'LBKTab',
        'render element' => 'content',
        'variables' => [
          'title' => NULL,
          'display_title' => NULL,
          'tabs_default_text' => NULL,
          'classes' => NULL,
          'tabs' => [],
        ],
        'path' => $modulePath . '/src/Plugin/Block/LBKTab',
      ],
    ];

    $event->addNewThemes($newThemes);
  }

}
