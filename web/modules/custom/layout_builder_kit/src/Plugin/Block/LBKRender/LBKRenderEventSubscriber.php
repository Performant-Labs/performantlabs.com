<?php

namespace Drupal\layout_builder_kit\Plugin\Block\LBKRender;

use Drupal\Core\Logger\LoggerChannelFactoryInterface;
use Drupal\core_event_dispatcher\Event\Theme\ThemeEvent;
use Drupal\core_event_dispatcher\ThemeHookEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Class LBKRenderEventSubscriber.
 *
 * @package Drupal\layout_builder_kit
 */
class LBKRenderEventSubscriber implements EventSubscriberInterface {

  /**
   * Logger Factory service.
   *
   * @var \Drupal\Core\Logger\LoggerChannelFactoryInterface
   */
  protected $loggerFactory;

  /**
   * LBKRenderEventSubscriber constructor.
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
      'LBKRender' => [
        'template' => 'LBKRender',
        'render element' => 'content',
        'variables' => [
          'title' => NULL,
          'display_title' => NULL,
          'render_type' => NULL,
          'view_mode' => NULL,
          'entity' => [],
          'classes' => NULL,
        ],
        'path' => $modulePath . '/src/Plugin/Block/LBKRender',
      ],
    ];

    $event->addNewThemes($newThemes);
  }

}
