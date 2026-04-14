// @ts-check

/**
 * Boring — Member discount Shopify Function.
 *
 * Applies a flat 10% discount to every line in the cart when the authenticated
 * customer is tagged with `member`. Unauthenticated carts and non-member
 * customers receive no discount.
 *
 * @typedef {import("../generated/api").CartLinesDiscountsGenerateRunInput} RunInput
 * @typedef {import("../generated/api").CartLinesDiscountsGenerateRunResult} FunctionRunResult
 */

const EMPTY_RESULT = { operations: [] };

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function cartLinesDiscountsGenerateRun(input) {
  const customer = input.cart?.buyerIdentity?.customer;
  const hasMemberTag = customer?.hasTags?.some((t) => t.tag === "member" && t.hasTag) ?? false;

  if (!hasMemberTag) return EMPTY_RESULT;
  if (!input.cart.lines.length) return EMPTY_RESULT;

  const hasOrderClass = (input.discount.discountClasses ?? []).includes("ORDER");
  if (!hasOrderClass) return EMPTY_RESULT;

  return {
    operations: [
      {
        orderDiscountsAdd: {
          candidates: [
            {
              message: "Member discount",
              targets: [{ orderSubtotal: { excludedCartLineIds: [] } }],
              value: { percentage: { value: 10 } },
            },
          ],
          selectionStrategy: "FIRST",
        },
      },
    ],
  };
}
