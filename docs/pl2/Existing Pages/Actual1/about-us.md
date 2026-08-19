[Skip to main content](#main-content)

⚙ 20260418

[![Home](/themes/custom/performant_labs_20260418/logo.svg)](/)

Menu

## Main navigation

* [Services](/services)
* [How We Do It](/how-we-do-it)
* [Articles](/articles)
* [Open Source Projects](/open-source-projects)
* [About Us](/about-us)
* [Contact Us](/form/contact)

[Call today](/contact)

## Breadcrumb

1. [Home](/)
2. About Us

# Drupal testing, done by the people who wrote the tools.

*Nearly two decades of Drupal work, narrowed to testing. Author of Automated Testing Kit on drupal.org, and of Testor on GitHub. The dogfooding proof runs on this site, every night.*

[Book a testing review](/contact-us?intent=testing-review)

[See the site test itself](/how-we-built-this-site)

## On drupal.org since 2006.

Performant Labs has been on drupal.org for nineteen-plus years — since the Drupal 4.7 era, before automated testing in Drupal was a distinct practice. The work narrowed to testing deliberately, as the rest of the community converged on Drupal's testing ecosystem (Behat, PHPUnit, then Playwright and Cypress). We stayed with it because it's where the hardest, most valuable Drupal problems live: not building the next site, but keeping the critical one working through twelve major-version upgrades.

* **19+ years on drupal.org** — [drupal.org/u/aangel](https://www.drupal.org/u/aangel) (member for 19 years 9 months as of this writing).
* **9+ projects credited on drupal.org** — the project list on the same profile covers Automated Testing Kit (and its D7 backport + Demo Recipe), Campaign Kit, Layout Builder Kit, the Drupal Quality Initiative, Audit Kit, AI Drush Tools, and Payment Stripe.
* **Active in the community** — Bay Area Drupal Camp presenter on the Drupal Quality Initiative. See [our open-source projects](/open-source-projects).

## Open source: the tools we wrote.

*Automated Testing Kit and Testor aren't projects we contribute to — we author and maintain them. Both exist because specific testing gaps in the Drupal community weren't being filled by anything else.*

Automated Testing Kit (ATK)

*A library of tests and helper functions for end-to-end testing of Drupal sites, for both Playwright and Cypress.*

Why it exists: every Drupal site re-writes the same twenty login / entity-reference / permissions tests in each new project. ATK ships them pre-written, together with the helper functions needed to make them reliable against Drupal's specific quirks. Maintained on drupal.org as a supported module, including a Drupal 7 backport and a demonstration recipe.

[**drupal.org/project/automated\_testing\_kit**](https://www.drupal.org/project/automated_testing_kit)

Testor

*A command-line companion to ATK for running tests outside the Drupal admin UI.*

Why it exists: teams running ATK in CI and local dev want the same test suite accessible from a terminal, not only from the Drupal admin. Testor provides that surface. Maintained in the open on GitHub, updated through late 2025.

[**github.com/Performant-Labs/testor**](https://github.com/Performant-Labs/testor)

*Other OSS we ship.* Performant Labs also maintains [Campaign Kit](https://www.drupal.org/project/campaign_kit), [Layout Builder Kit](https://www.drupal.org/project/layout_builder_kit), the [Drupal Quality Initiative](https://www.drupal.org/project/dqi), [Audit Kit](https://www.drupal.org/project/audit_kit), [AI Drush Tools](https://www.drupal.org/project/ai_drush_tools), and [Payment Stripe](https://www.drupal.org/project/payment_stripe) on drupal.org.

### Who we are.

Performant Labs is led by **André Angelantoni** (drupal.org [`aangel`](https://www.drupal.org/u/aangel)), author of Automated Testing Kit and maintainer of the testing-specific Drupal projects linked above. A small team of senior testing engineers work alongside him on the autonomous-healing workflow you see running on this site.

## We test what we ship.

This site runs the same autonomous-healing workflow we offer our clients. Every night, Claude agents re-run the Playwright suite against the live site, triage failures, author fixes as pull requests, and file issues when the failure is in the site rather than the test. The commit history is public. The dashboard is public. Every heal is a verifiable fact, not a case study.

[Read how the workflow is wired](/how-we-built-this-site)

## Want to talk testing?

If any of this sounds like the kind of Drupal testing partner you're looking for — start here.

[Book a testing review](/contact-us?intent=testing-review)

[See the testing menu](/services)

## Footer

* [Services](/services)
  + [Drupal Development](/services)
  + [Automated Testing](/services)
  + [Performance Tuning](/services)
  + [Open Source Projects](/open-source-projects)
* [Resources](/articles)
  + [Articles](/articles)
  + [Documentation](/docs)
* ### Company

  + [About Us](/about-us)
  + [Contact Us](/contact)
  + [Privacy Policy](/privacy-policy)
