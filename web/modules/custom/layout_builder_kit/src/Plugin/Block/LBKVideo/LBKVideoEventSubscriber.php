<?php

namespace Drupal\layout_builder_kit\Plugin\Block\LBKVideo;

use Drupal\Core\Logger\LoggerChannelFactoryInterface;
use Drupal\core_event_dispatcher\Event\Theme\ThemeEvent;
use Drupal\core_event_dispatcher\ThemeHookEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Class LBKVideoEventSubscriber.
 *
 * @package Drupal\layout_builder_kit
 */
class LBKVideoEventSubscriber implements EventSubscriberInterface {

  /**
   * Logger Factory service.
   *
   * @var \Drupal\Core\Logger\LoggerChannelFactoryInterface
   */
  protected $loggerFactory;

  /**
   * LBKVideoEventSubscriber constructor.
   */
  public function __construct(LoggerChannelFactoryInterface $loggerFactory) {
    $this->loggerFactory = $loggerFactory;
  }

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    $events = [];

    $events[ThemeHookEvents::THEME][] = ['themeEvent'];
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
      'LBKVideo' => [
        'template' => 'LBKVideo',
        'render element' => 'content',
        'variables' => [
          'title' => NULL,
          'display_title' => NULL,
          'video_url' => NULL,
          'video_field' => NULL,
          'video_radio_options' => NULL,
          'field_type' => NULL,
          'classes' => NULL,
        ],
        'path' => $modulePath . '/src/Plugin/Block/LBKVideo',
      ],
    ];

    $event->addNewThemes($newThemes);
  }

}
