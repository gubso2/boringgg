# Member discount — Shopify Function

Applies a flat 10% discount to any cart where the authenticated customer has the `member` tag.

## How it fits in

- Customers get tagged `member` by the Cloudflare Worker in `../pushowl-webhook/` after they enable web-push notifications via PushOwl.
- The Worker calls Shopify Admin API `customerUpdate` with the tag.
- On checkout, this Function inspects `cart.buyerIdentity.customer.hasTags`. If `member` is present, it returns a 10% order-level discount.
- No coupon codes. No app UI for customers.

## Prerequisites

- Shopify CLI 3.93+ (`shopify version`).
- A Shopify app backing this function. If you don't have one, run `shopify app init` at the repo root and move the `apps/` directory underneath it. The function registers with an app, not directly with a store.

## Local development

```bash
cd apps/member-discount
npm install
shopify app function typegen
shopify app function build
```

## Deploying

```bash
# From the app root (one level up from apps/member-discount)
shopify app deploy
```

Then in the Shopify admin:
1. Go to **Discounts → Create discount → Automatic → Member discount**.
2. Select the function, set any required configuration.
3. Activate.

Now every cart belonging to a customer tagged `member` gets 10% off at checkout. No customer action required.

## Files

- `shopify.extension.toml` — function extension config
- `src/cart_lines_discounts_generate_run.graphql` — input query
- `src/cart_lines_discounts_generate_run.js` — discount logic

## Testing

In the store admin, manually tag a test customer with `member`. Add any product to the cart while signed in as that customer. At checkout, you should see a "Member discount" line for 10% off.
