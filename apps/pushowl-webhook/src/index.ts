/**
 * Boring — PushOwl → member-tag Cloudflare Worker.
 *
 * Receives PushOwl's subscription webhook and tags the Shopify customer
 * with `member`. Shopify Functions elsewhere apply the 10% discount when
 * that tag is present.
 *
 * PushOwl sends POSTs to this endpoint when a subscriber's identity becomes
 * known (i.e. they're a logged-in customer, not anonymous). The payload
 * includes the Shopify customer ID; we call `customerUpdate` on the Admin
 * GraphQL API to append the tag.
 *
 * Environment variables (set via wrangler secrets):
 *   SHOPIFY_STORE_DOMAIN       e.g. boringggtheme.myshopify.com
 *   SHOPIFY_ADMIN_TOKEN        Admin API access token (private app or custom app)
 *   PUSHOWL_WEBHOOK_SECRET     Shared secret configured in PushOwl webhook
 */

export interface Env {
  SHOPIFY_STORE_DOMAIN: string;
  SHOPIFY_ADMIN_TOKEN: string;
  PUSHOWL_WEBHOOK_SECRET: string;
}

interface PushOwlPayload {
  event: string;
  subscriber?: {
    id?: string;
    shopifyCustomerId?: string | number;
    email?: string;
  };
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const providedSecret = req.headers.get("x-pushowl-signature") || new URL(req.url).searchParams.get("secret");
    if (!env.PUSHOWL_WEBHOOK_SECRET || providedSecret !== env.PUSHOWL_WEBHOOK_SECRET) {
      return new Response("Unauthorized", { status: 401 });
    }

    let payload: PushOwlPayload;
    try {
      payload = (await req.json()) as PushOwlPayload;
    } catch {
      return new Response("Bad payload", { status: 400 });
    }

    if (payload.event !== "subscriber.subscribed" && payload.event !== "subscriber.identified") {
      return new Response("Ignored", { status: 202 });
    }

    const rawId = payload.subscriber?.shopifyCustomerId;
    if (!rawId) {
      return new Response("No customer id", { status: 202 });
    }

    const gid = String(rawId).startsWith("gid://shopify/Customer/")
      ? String(rawId)
      : `gid://shopify/Customer/${rawId}`;

    const mutation = `
      mutation tagMember($id: ID!) {
        tagsAdd(id: $id, tags: ["member"]) {
          node { id }
          userErrors { field message }
        }
      }
    `;

    const res = await fetch(`https://${env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-10/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": env.SHOPIFY_ADMIN_TOKEN,
      },
      body: JSON.stringify({ query: mutation, variables: { id: gid } }),
    });

    const result = (await res.json()) as { data?: { tagsAdd?: { userErrors?: { message: string }[] } }; errors?: unknown };
    if (result.errors || result.data?.tagsAdd?.userErrors?.length) {
      console.error("Shopify tagsAdd failed", JSON.stringify(result));
      return new Response("Upstream error", { status: 502 });
    }

    return new Response(JSON.stringify({ ok: true, customer: gid }), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
