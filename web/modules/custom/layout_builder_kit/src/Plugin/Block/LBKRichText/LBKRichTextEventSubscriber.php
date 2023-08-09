<?php

namespace Drupal\layout_builder_kit\Plugin\Block\LBKRichText;

use Drupal\Core\Logger\LoggerChannelFactoryInterface;
use Drupal\core_event_dispatcher\Event\Theme\ThemeEvent;
use Drupal\core_event_dispatcher\ThemeHookEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Class LBKRichTextEventSubscriber.
 *
 * @package Drupal\layout_builder_kit
 */
class LBKRichTextEventSubscriber implements EventSubscriberInterface {

  /**
   * Logger Factory service.
   *
   * @var \Drupal\Core\Logger\LoggerChannelFactoryInterface
   */
  protected $loggerFactory;

  /**
   * LBKRichTextEventSubscriber constructor.
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
      'LBKRichText' => [
        'template' => 'LBKRichText',
        'variables' => [
          'title' => NULL,
          'display_title' => NULL,
          'rich_text' => NULL,
          'rich_text_format' => NULL,
          'classes' => NULL,
        ],
        'path' => $modulePath . '/src/Plugin/Block/LBKRichText',
      ],
    ];

    $event->addNewThemes($newThemes);
  }

}
