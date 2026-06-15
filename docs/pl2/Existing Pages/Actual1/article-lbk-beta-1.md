# Captured: /articles/introducing-layout-builder-kit-beta-1

Source: `https://pl-performantlabs.com.3.ddev.site:8493/articles/introducing-layout-builder-kit-beta-1` (theme: `performant_labs_20260502`).
Captured 2026-05-06 via `curl` + `pandoc -t markdown_strict-raw_html`.

Page kind: **Article node** rendered through `node--article--full.html.twig` (neonbyte). Not a Layout Builder Canvas page.

---

## Breadcrumb (system block, above the article)

1. [Home](/)
2. [Articles](/articles)
3. Introducing Layout Builder Kit Beta 1

## Article masthead (`header-article` SDC)

**Tags** (above title — `field_tags` rendered as taxonomy term links):

- [Layout Builder Kit](/taxonomy/term/1)
- [Drupal Planet](/taxonomy/term/8)

**Title:** Introducing Layout Builder Kit Beta 1

**Author / date:** *not displayed* — `display_submitted` is FALSE on this article (matches `article-atk-v10.md` and the rest of `/articles/*`).

**Hero image** (overlaps body with `margin-top: -150px` per `header-article.css`):

`/sites/default/files/styles/16_9_512x288_focal_point_webp/public/migration/articles/9_article-bg2_0.png.avif`
alt: "Layout Builder Kit Beta 1 hero"

## Article body (rendered by `{{ content|without('field_tags','field_image','comment') }}`)

Visible above the prose: **Category** label / value pair (`field_category`, label-above) — value: [Talks](/taxonomy/term/13).

---

With [Layout Builder](https://www.drupal.org/docs/8/core/modules/layout-builder) now available, making pages in Drupal is entering a new era of drag and drop functionality. Though it was possible to place components (also called blocks) using contributed modules like Panels, Display Suite and others, now that capability is built into Drupal core. More people will know about it and use it.

Though Layout Builder gives site builders the ability to drag and drop components onto pages, it's just the platform. It makes available the essential blocks Drupal provides, like a Search block or Login block, but does not include any more. Where do the more interesting components come from that we will be a-dragging and a-dropping?

### Commercial Offerings

There are at least two commercial libraries of components available right now. The first, [CohesionDX](https://www.acquia.com/products-services/acquia-cohesion), has just been purchased by Acquia. Before the acquisition using the product required a subscription and likely this will remain the same now that Acquia has purchased it. Acquia likely sees it as a useful addition to their ecosystem of products that allows it to compete with other CMSs out there. You'll need to contact Acquia to get the pricing and it's possible you might already need to be a customer (it's too early to know; check with them).

The second product, [Glazed Builder](https://www.sooperthemes.com/drupal-modules/glazed-builder), is by Sooper Themes. It too requires a subscription. A single editor costs under $100/year and 10 editors is $360/year.

Both products offer a visual page builder (that is almost certainly not based atop Layout Builder, someone text me on Slack if I'm wrong) and a library of components including tabs, pricing tables, carousels, and more. I don't have personal experience with either product but they are a welcome addition to the Drupal world. Drupal 8 addressed a lot of my concerns around modernizing Drupal from a programmer's perspective (yaay Symfony). These commercial page layout products plus Layout Builder are addressing my longstanding concern (and not just my concern): how do we make Drupal easier for content editors?

### Layout Builder Kit

What if you don't want to lock yourself into a vendor's solution? What if they offer too much for your uses and you just need a few simple components? What if you want to create your own custom components and don't want to start from scratch? If you are in any of these groups, you may want to try [Layout Builder Kit](https://www.drupal.org/project/layout_builder_kit).

[Layout Builder Kit](https://www.drupal.org/project/layout_builder_kit) has just entered beta and includes the following components:

- Rich Text
- Image
- Icon
- Tab
- Video
- Book Navigation

Each component is subclassed from LBKBaseComponent, which provides some basic common functionality, like whether to display the title or a textfield for extra classes to include when rendering the component.

### Component Placement and Storage

In Layout Builder, the position of the component is always stored in the Layout field in a serialized string (which can be located in two places; more on that in a future post). When it comes storing the component configuration—the title, the alignment of the text, and all the other settings—that can be stored in multiple ways.

It's important to understand how configuration is stored because if you're not careful it's very possible to break other functionality in Drupal or use a method that is very slow. We recently worked on a site with over 40 components on a single page (not Layout Builder Kit components, custom ones). With that many components on a page, a slow storage mechanism will generate a lot of complaints from the content editors.

The three ways (so far) to store component configuration are:

1. In the Layout field, along with the placement (as a serialized string).
2. Using the Field API through the Drupal GUI
3. Using the Entity API plus the Field API.

This first group of components in Layout Builder Kit all use the first method, storing the configuration in the Layout field as part of the serialized string. Though this method is more work because it makes us construct our own forms, it preserves the ability to use many if not all of the other Drupal features, like pulling up a prior revision of the page.

We specifically chose not to use the Field API because it makes a table for every field. Working with 40+ components on a field and multiple fields per component translates into lots of extra work for the database and Drupal to piece things together. (Translation: it's slow.)

However, we are looking into the ramifications of using the Entity API to store component configuration. Some initial tests worked well but there are more to go. If we release components that use the Entity API, they will go into a new whole version (2.x instead of 1.x) or we will name them differently and release two sets.

In the meantime, these components are ready to try and there won't be a forced upgrade to a new storage mechanism in the future.

---

## Notes for the preview

- No comments region (`{{ content.comment }}` is empty on `/articles/*`).
- No author picture / no byline.
- Body has only H3 sections (rendered as `## Heading` in Drupal source via WYSIWYG; current production HTML emits `<h2>` per pandoc capture above — preview should use `<h2>` for first-level body headings to match what's actually shipped).
- Three structural elements not on the listing page need styling decisions in the preview:
  1. **Category field** displayed as label/value above prose.
  2. **Inline links** in prose (lots of them — every external product is linked).
  3. **Ordered list** (the "three ways to store component configuration" enumerated list).
