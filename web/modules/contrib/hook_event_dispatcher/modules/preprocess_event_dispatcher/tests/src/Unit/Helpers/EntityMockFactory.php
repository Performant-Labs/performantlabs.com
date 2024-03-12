<?php

namespace Drupal\Tests\preprocess_event_dispatcher\Unit\Helpers;

use Drupal\Core\Entity\EntityInterface;
use Mockery\MockInterface;

/**
 * Class EntityMock.
 */
final class EntityMockFactory {

  /**
   * Get a full Entity mock.
   *
   * @template T of \Drupal\Core\Entity\EntityInterface
   *
   * @param class-string<T> $class
   *   Class of mocked entity.
   * @param string $type
   *   Entity type.
   * @param string $bundle
   *   Entity bundle.
   *
   * @return \Mockery\MockInterface&T
   *   EntityMock.
   */
  public static function getMock(string $class, string $type, string $bundle): MockInterface&EntityInterface {
    /** @var \Mockery\MockInterface&T $mock */
    $mock = \Mockery::mock($class);
    $mock->allows([
      'getEntityType' => $type,
      'bundle' => $bundle,
    ]);
    return $mock;
  }

}
