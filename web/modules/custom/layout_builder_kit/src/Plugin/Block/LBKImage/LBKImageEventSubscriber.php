<?php

namespace Drupal\layout_builder_kit\Plugin\Block\LBKImage;

use Drupal\Core\Logger\LoggerChannelFactoryInterface;
use Drupal\core_event_dispatcher\Event\Theme\ThemeEvent;
use Drupal\core_event_dispatcher\ThemeHookEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Class LBKImageEventSubscriber.
 *
 * @package Drupal\layout_builder_kit
 */
class LBKImageEventSubscriber implements EventSubscriberInterface {

  /**
   * Logger Factory service.
   *
   * @var \Drupal\Core\Logger\LoggerChannelFactoryInterface
   */
  protected $loggerFactory;

  /**
   * LBKImageEventSubscriber constructor.
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
      'LBKImage' => [
        'template' => 'LBKImage',
        'render element' => 'content',
        'variables' => [
          'title' => NULL,
          'display_title' => NULL,
          'title_position' => NULL,
          'image' => NULL,
          'image_alignment' => NULL,
          'overlay_position' => NULL,
          'overlay_text' => NULL,
          'overlay_text_format' => NULL,
          'classes' => NULL,
        ],
        'path' => $modulePath . '/src/Plugin/Block/LBKImage',
      ],
    ];

    $event->addNewThemes($newThemes);
  }

}
