<?php

namespace Drupal\layout_builder_kit\Plugin\Block\LBKIconText;

use Drupal\Core\Logger\LoggerChannelFactoryInterface;
use Drupal\core_event_dispatcher\Event\Theme\ThemeEvent;
use Drupal\core_event_dispatcher\ThemeHookEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Class LBKIconTextEventSubscriber.
 *
 * @package Drupal\layout_builder_kit
 */
class LBKIconTextEventSubscriber implements EventSubscriberInterface {

  /**
   * Logger Factory service.
   *
   * @var \Drupal\Core\Logger\LoggerChannelFactoryInterface
   */
  protected $loggerFactory;

  /**
   * LBKIconTextEventSubscriber constructor.
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
      'LBKIconText' => [
        'template' => 'LBKIconText',
        'render element' => 'content',
        'variables' => [
          'title' => NULL,
          'display_title' => NULL,
          'image' => NULL,
          'media_position' => NULL,
          'alignment' => NULL,
          'text' => NULL,
          'text_format' => NULL,
          'link' => NULL,
          'classes' => NULL,
        ],
        'path' => $modulePath . '/src/Plugin/Block/LBKIconText',
      ],
    ];

    $event->addNewThemes($newThemes);
  }

}
