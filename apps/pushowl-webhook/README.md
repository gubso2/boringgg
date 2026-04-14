# PushOwl → member tag webhook

A 50-line Cloudflare Worker. Receives a webhook from PushOwl when someone subscribes to web push on boringggtheme.myshopify.com, calls the Shopify Admin API to append the `member` tag to that customer, and exits. The `member` tag triggers the member-discount Shopify Function at checkout.

## Deploy

```bash
cd apps/pushowl-webhook
npm install
npx wrangler login
npx wrangler secret put SHOPIFY_ADMIN_TOKEN      # paste Admin API token
npx wrangler secret put PUSHOWL_WEBHOOK_SECRET   # paste a long random string
npx wrangler deploy
```

Wrangler will print the deployed URL, e.g. `https://boring-pushowl-webhook.<your-subdomain>.workers.dev`.

## Generating the Shopify Admin API token

1. Shopify admin → **Settings → Apps and sales channels → Develop apps → Create an app**.
2. Name it `Boring — Member Tagger`.
3. **Configure Admin API scopes**: grant `write_customers`. Nothing else.
4. Install the app; reveal the Admin API access token; paste into `wrangler secret put SHOPIFY_ADMIN_TOKEN`.

## Configuring PushOwl

PushOwl's webhook config lives in their app admin → **Settings → Webhooks** (exact path varies — check [PushOwl docs](https://support.pushowl.com/)).

- **URL**: the Worker URL from above, with `?secret=<PUSHOWL_WEBHOOK_SECRET>` appended, *or* set the secret in PushOwl's header config so it sends `x-pushowl-signature` header.
- **Events**: `subscriber.subscribed`, `subscriber.identified`.
- **Payload**: must include `shopifyCustomerId`. If PushOwl only emits `email` instead of a customer ID, we'll need to extend the Worker to look up the customer by email.

## Verifying

1. Sign in to the storefront as a test customer.
2. Enable notifications via the on-site PushOwl prompt.
3. Check the Worker logs: `npx wrangler tail`.
4. In Shopify admin, confirm the customer now has the `member` tag.
5. Add a product to cart; at checkout, the member discount line should appear.

## If PushOwl doesn't support outbound webhooks

Some plans don't. Fallback options:

- **Shopify Flow** (native, free): PushOwl may write a customer metafield on subscribe. Use a Flow trigger on metafield update → "Add customer tags" action.
- **Zapier**: PushOwl → Zapier → "Update Customer Tags" on Shopify.
- **Polling Worker**: Cloudflare Cron Trigger hits PushOwl's subscribers API every 15 minutes and diffs; add the tag for new subscribers. Ugly but workable.
