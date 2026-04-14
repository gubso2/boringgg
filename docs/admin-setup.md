# Boring — Admin setup guide

This guide walks through everything the theme expects to find in the Shopify admin: metaobject definitions, metafields, pages, collections, and app wiring. The theme will render on a blank store but all the evidence/comparison/member/referral UX depends on these being configured.

Time budget end-to-end: ~60 minutes of admin clicks, plus content entry.

---

## 1. Metaobject definitions

**Admin → Settings → Custom data → Metaobjects → Add definition.**

Create these in order (later ones reference earlier ones).

### 1.1 `source`

For individual studies/reports cited as evidence.

| Name | Type | Required |
|---|---|---|
| `title` | Single-line text | ✓ |
| `authors` | Single-line text | |
| `publication` | Single-line text | |
| `year` | Integer | |
| `url` | URL | |
| `type` | Single-line text (preset values: `RCT`, `Meta-analysis`, `Observational`, `Report`, `Other`) | |

### 1.2 `evidence`

Scientific backing for a product.

| Name | Type | Required |
|---|---|---|
| `strength` | Single-line text (preset values: `High`, `Moderate`, `Emerging`) | ✓ |
| `plain_english_takeaway` | Multi-line text | ✓ |
| `mechanism_summary` | Multi-line text | |
| `sources` | List of metaobject references → `source` | |

### 1.3 `financial_impact`

Parallel to evidence, but for finance products.

| Name | Type |
|---|---|
| `estimated_annual_saving` | Money |
| `payback_period_months` | Integer |
| `saving_type` | Single-line text (preset: `Recurring utility`, `One-time avoided cost`, `Return`, `Risk reduction`) |
| `methodology` | Multi-line text |
| `assumptions` | List of single-line text |
| `caveats` | Multi-line text |

### 1.4 `comparison`

Benchmark comparison against a major-brand product.

| Name | Type |
|---|---|
| `benchmark_brand` | Single-line text |
| `benchmark_product_name` | Single-line text |
| `our_price` | Money |
| `benchmark_price` | Money |
| `our_specs` | List of single-line text (format: `Label | Value` per entry) |
| `benchmark_specs` | List of single-line text |
| `material_ours` | Single-line text |
| `material_benchmark` | Single-line text |
| `performance_ours` | Multi-line text |
| `performance_benchmark` | Multi-line text |
| `running_cost_ours` | Single-line text |
| `running_cost_benchmark` | Single-line text |
| `warranty_ours` | Single-line text |
| `warranty_benchmark` | Single-line text |
| `key_advantage` | Multi-line text |
| `key_disadvantage` | Multi-line text |
| `summary` | Multi-line text |

### 1.5 `best_for_segment`

A single "Best for" line.

| Name | Type |
|---|---|
| `label` | Single-line text |
| `description` | Single-line text |

### 1.6 `caveat`

A single "What to know" line.

| Name | Type |
|---|---|
| `text` | Single-line text |

---

## 2. Product metafields

**Admin → Settings → Custom data → Products → Add definition.** Namespace `custom` throughout.

| Key | Type |
|---|---|
| `functional_subtitle` | Single-line text |
| `what_it_does` | Multi-line text |
| `why_it_matters` | Multi-line text |
| `who_benefits` | Multi-line text |
| `member_price` | Money |
| `domain` | Single-line text (preset: `health`, `finance`) |
| `comparison` | Metaobject reference → `comparison` |
| `evidence` | Metaobject reference → `evidence` |
| `financial_impact` | Metaobject reference → `financial_impact` |
| `best_for` | List of metaobject references → `best_for_segment` |
| `caveats` | List of metaobject references → `caveat` |

---

## 3. Collection metafields

**Admin → Settings → Custom data → Collections.** Namespace `custom`.

| Key | Type |
|---|---|
| `editorial_intro` | Multi-line text |
| `domain` | Single-line text (preset: `health`, `finance`) |

---

## 4. Customer metafields

**Admin → Settings → Custom data → Customers.** Namespace `loyalty`.

| Key | Type |
|---|---|
| `store_credit_balance` | Money |
| `referral_code` | Single-line text |
| `member_since` | Date |

These are read by the account dashboard. The referral app (Rivo) can write `referral_code` directly; `store_credit_balance` will either come from Rivo or be maintained manually until native Store Credit is surfaced. Set the "storefront access" toggle to "Read" on all three so Liquid can display them.

---

## 5. Shop-level metafields

**Admin → Settings → Custom data → Shop.** Namespace `brand`.

| Key | Type | Default |
|---|---|---|
| `markup_percent` | Integer | 50 |
| `warranty_years` | Integer | 2 |

These drive the text in the Transparency mini-strip snippet on product pages.

---

## 6. Collections to create

**Admin → Products → Collections → Create collection.**

Hub collections (smart, based on product tag):

- `Health` — auto-tag: product tag is `health`
- `Finance` — auto-tag: product tag is `finance`

Sub-collections (smart, based on product type or tag):

Health:
- Sleep
- Oral Health
- Sun Protection
- Air Quality
- Water Quality
- Home Safety

Finance:
- Energy Savings
- Water Savings
- Fraud Protection
- Long-Term Investing

Populate each with an `editorial_intro` metafield (2–3 sentences, editorial tone). Example for Sleep:

> The evidence for sleep is stronger than for almost any health intervention. These are the small, durable items that measurably improve it — mouth tape, weighted blankets with genuine studies behind them, and cervical pillows with orthopaedic data. No supplements.

---

## 7. Pages to create

**Admin → Online Store → Pages → Add page.** All should use the default `page` template (which we've wired to the `editorial-essay` section).

| Handle | Title | Purpose |
|---|---|---|
| `how-it-works` | How we price | Fixed markup + warranty manifesto. See copy in `/docs/copy/how-it-works.md`. |
| `membership` | Membership | Member pricing explainer. |
| `referrals` | Referrals | Invite-and-earn explainer. |
| `evidence` | How we assess products | Three pillars in long form. |
| `warranty` | Warranty | 2-year warranty terms. |
| `about` | About | Short editorial about. |

For each: open the page in the theme customizer, fill the `editorial-essay` section's Kicker / Heading / Lede / Body fields. The section defaults to reading the page content if body is left blank.

---

## 8. Apps to install

### 8.1 PushOwl (web push)

1. **Shopify App Store → PushOwl → Install**.
2. Follow onboarding; pick "Classic" prompt UI (minimal, least intrusive).
3. In PushOwl admin → prompt customization → set copy to:
   - Title: "Notifications for new essentials"
   - Body: "Two messages a month. Nothing else."
4. Configure outbound webhook (see `apps/pushowl-webhook/README.md`).

### 8.2 Rivo (referrals)

1. **Shopify App Store → Rivo Referrals → Install**.
2. In Rivo admin → referral program → set:
   - Referrer reward: 10% store credit
   - Referee reward: 10% off first order (optional — you may prefer no new-customer discount if you want to keep pricing "flat" messaging pure)
   - Referral trigger: first paid order
3. In Rivo settings → metafields → enable writing `referral_code` to `loyalty.referral_code` (if available). Otherwise use Rivo's native customer portal and link to it from the account dashboard.

---

## 9. Member discount Shopify Function

See `apps/member-discount/README.md`. You'll:

1. Run `shopify app init` at the repo root (creates a container app for the function).
2. Move `apps/member-discount/` under the new app's `extensions/` directory.
3. `shopify app deploy`.
4. In admin → Discounts → Create → Automatic → Member discount.

---

## 10. Theme publish checklist

- [ ] All metaobjects + metafields defined.
- [ ] Hub + sub collections created with editorial intros.
- [ ] Six pages created (how-it-works, membership, referrals, evidence, warranty, about).
- [ ] Header menu edited (**Online Store → Navigation → Main menu**) to: Health / Finance / Membership / How we price / Account.
- [ ] Footer menu edited to: About / Warranty / Contact / Legal.
- [ ] At least 3 seed products populated end-to-end (1 health, 1 finance, 1 crossover) with comparison + evidence metaobjects attached.
- [ ] PushOwl installed, webhook configured, member tag applies on subscribe.
- [ ] Rivo installed.
- [ ] Member-discount function deployed and active.
- [ ] Password protection removed from storefront.
- [ ] `shopify theme publish --store=boringggtheme.myshopify.com --theme=boringgg-dev`.

---

## 11. Seed product template

Quick copy for a first product to validate the data pipeline. Use this as a template to populate metafields.

**Product**: Silicone Nasal Strips (Health)

- `custom.domain`: `health`
- `custom.functional_subtitle`: "Opens the nasal airway during sleep. Reusable for 200+ nights."
- `custom.what_it_does`: "A soft silicone insert that gently widens the nasal valve overnight, reducing airflow resistance."
- `custom.why_it_matters`: "Most adults breathe primarily through the nose during sleep. When the nasal valve partially collapses, it increases respiratory effort, reduces oxygen saturation, and is a measurable contributor to snoring and poor sleep quality."
- `custom.who_benefits`: "Light snorers, mouth breathers, congested sleepers, and athletes seeking better nocturnal oxygen delivery. Not a treatment for sleep apnoea — see a clinician."

Attach an `evidence` metaobject with:
- `strength`: Moderate
- `plain_english_takeaway`: "Multiple randomised studies show nasal dilators reduce snoring frequency and improve sleep efficiency for light-to-moderate snorers."
- `mechanism_summary`: "By holding the nasal valve open, airway resistance drops roughly 30%. Lower resistance means less effortful breathing and fewer micro-arousals."
- `sources`: attach 2–3 `source` records (PubMed / Cochrane / JAMA studies).

Attach a `comparison` metaobject with a real benchmark (e.g. Mute Nasal Dilators):
- `benchmark_brand`: Mute
- `benchmark_product_name`: Nasal Dilator
- `our_price`: £14
- `benchmark_price`: £24
- `material_ours`: Medical-grade silicone, reusable
- `material_benchmark`: Polymer, single-use packaging
- `performance_ours`: "30% average reduction in airway resistance. Reusable for 200+ nights."
- `performance_benchmark`: "~35% reduction in airway resistance. Designed for ~30 nights per strip."
- `running_cost_ours`: "£0.07 per night"
- `running_cost_benchmark`: "£0.80 per night"
- `warranty_ours`: 2 years
- `warranty_benchmark`: None
- `summary`: "Comparable effect. ~11× cheaper per night. No disposable packaging."

This single product should exercise every block on the editorial product template.
