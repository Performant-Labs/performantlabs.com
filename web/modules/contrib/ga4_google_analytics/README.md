# GA4 Google Analytics

The **GA4 Google Analytics** module integrates Google Analytics 4 (GA4) tracking into your Drupal website, providing advanced insights into user behavior and engagement. With easy installation and configuration, this module allows you to track pageviews, clicks, conversions, and more, helping you optimize your website's performance using GA4's event-driven tracking system, all within the Drupal environment.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Troubleshooting & FAQ](#troubleshooting--faq)

## Requirements

- Drupal 9 or higher
- Google Analytics 4 (GA4) account and Measurement ID

## Installation

Install the GA4 Google Analytics module via Composer:

`composer require drupal/ga4_google_analytics`

Alternatively, you can install it like a standard contributed Drupal module. See the [Drupal documentation](https://www.drupal.org/docs/8/extending-drupal-8/installing-modules) for detailed installation instructions.

## Configuration
-------------

1.  Go to **Administration » Extend** and enable the GA4 Google Analytics module.
2.  Navigate to **Configuration » Web services » GA4 Google Analytics Settings** to access the module's settings.

### Settings:

*   **GA4 Measurement ID**: Enter your GA4 Measurement ID.
*   **Pages**: Specify pages using their paths, one per line. Use `*` as a wildcard (e.g., `/user/*`).
*   **Roles**: Specify the user roles for which analytics should be used, or leave empty for all roles.

### Finding Your GA4 Measurement ID

1.  Log in to your Google Analytics account.
2.  Open the Admin panel in Google Analytics 4.
3.  Select your desired property.
4.  Go to **Data Stream** and click on the name of your data stream.
5.  Find the Measurement ID (starting with `G-`) in the top-right corner.

### Exclude Specific URLs

To exclude specific URLs (e.g., `/admin/*`, `/user/*`, `/node/*/edit`) from tracking, adjust your settings under **Configuration » Web services » GA4 Google Analytics Settings**.

## Troubleshooting & FAQ

For any issues related to installation or configuration, refer to the [Drupal module documentation](https://www.drupal.org/docs/8/extending-drupal-8/installing-modules) or the official Google Analytics 4 documentation.

## Maintainers

This module is maintained by Sujan Shrestha.