# Boring — Shopify theme

An editorial Shopify theme for a brand selling essentials for health and finance. Typography-led, severely minimal, evidence-first.

Built on Shopify's Dawn reference theme. See `/docs/admin-setup.md` for everything the admin needs to configure.

## Structure

```
assets/                  Editorial CSS on top of Dawn base.css
sections/                Custom sections (editorial-hero, main-product-editorial, etc.)
snippets/                Shared snippets (comparison-table, evidence-panel, etc.)
templates/               JSON templates wired to custom sections
apps/
  member-discount/       Shopify Function — 10% discount for customers tagged `member`
  pushowl-webhook/       Cloudflare Worker — adds `member` tag on push subscribe
docs/
  admin-setup.md         Metaobjects, metafields, apps, pages
  copy/                  Long-form copy for manifesto pages
```

## Working against the dev store

```bash
shopify theme push --store=boringggtheme.myshopify.com --theme=boringgg-dev
```

Preview URL printed on successful push.

## Brand tokens

All defined in `assets/editorial-theme.css`:

- Background `#F7F4EE` / Alt background `#EFE9DF`
- Ink `#111111` / Muted `#4B4B4B`
- Rule `#D8D1C7` / Accent `#7A6E5A` / Science `#5E6B57`
- Times New Roman everywhere

## Attribution

Built on Dawn, Shopify's reference theme. Original Dawn is MIT-licensed; see `LICENSE.md`.
