# Layout Builder Kit

## Introduction

Layout Builder Kit is a set of pre-made components you can use in your Layout
Builder pages. Version 3 works only on Drupal 10+ with
Hook Event Dispatcher 4. If your site requires Hook Event Dispatcher
3.x, use earlier versions of the module.

Layout Builder Kit can now render media objects.

## Description

Layout Builder Kit includes basic components that you can use within your Drupal
site. The components can be used in Block Layout or Layout Builder.

This module contains 7 components:
- Book Navigation
- Icon Text
- Image
- Render
- Rich Text
- Tab
- Video

For a better editing experience, use Layout Build Modal (https://www.drupal.org/project/layout_builder_modal).

## Requirements

This module requires the following modules:

  - [Hook Event Dispatcher](https://www.drupal.org/project/hook_event_dispatcher) (4.x+)
  - Layout Builder (part of core)


## Documentation

Find the documentation at:
https://performantlabs.com/layout-builder-kit/layout-builder-kit.


## Installation

 - Install as you would normally install a contributed Drupal module. Visit
   https://www.drupal.org/node/1897420 for further information.
 - Installing the module without Composer is not recommended and is unsupported.


## Configuration

Layout Builder is not turned on by default. To turn it on for the Basic Page
content type:

    1. Go to Structure > Content Types > Basic Page > Manage Display.
    2. Set the checkbox "Use Layout Builder." Optionally set "Allow each content item to have its layout customized."
    3. Click Save.
    4. Go to Content > Add content > Basic Page, provide a title and click Save.
    5. Click "Layout."
    6. You are now editing the layout of all Basic Pages or just this page, depending
       on how you configured the content type in #2.
    7. Click Add Block. Filter with "LBK." Click on a link to add a component.
