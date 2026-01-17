// lib/shopify.js → FINAL WORKING VERSION (December 2025)

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const ADMIN_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

const ENDPOINT = `https://${SHOPIFY_DOMAIN}/api/2025-10/graphql.json`;
const ADMIN_ENDPOINT = `${process.env.SHOPIFY_ADMIN_API_BASE_URL}/2025-10/graphql.json`;

// Storefront request (public) — with guards for token/endpoint
async function request(query, variables = {}) {
  if (!ENDPOINT) {
    throw new Error('Missing SHOPIFY_STOREFRONT_ENDPOINT (check SHOPIFY_DOMAIN in .env.local)');
  }
  if (!STOREFRONT_TOKEN) {
    throw new Error('Missing NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local');
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0]?.message || "Storefront error");
  return json.data;
}

// Admin request — with guards for token/endpoint
async function adminRequest(query, variables = {}) {
  if (!ADMIN_ENDPOINT) {
    throw new Error('Missing SHOPIFY_ADMIN_API_BASE_URL in .env.local');
  }
  if (!ADMIN_TOKEN) {
    throw new Error('Missing SHOPIFY_ACCESS_TOKEN in .env.local');
  }

  const res = await fetch(ADMIN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": ADMIN_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();

  if (json.errors) {
    console.error("Shopify Admin GraphQL errors:", json.errors);
    throw new Error(json.errors[0].message || "Admin API error");
  }

  const userErrors =
    json.data?.customerCreate?.userErrors ||
    json.data?.metafieldsSet?.userErrors ||
    json.data?.customerUpdate?.userErrors ||
    [];

  if (userErrors.length > 0) {
    console.error("Shopify userErrors:", userErrors);
    throw new Error(userErrors[0].message);
  }

  return json.data;
}

// ===========================
// CUSTOMER REGISTRATION — unchanged & working
// ===========================
export async function register({ firstName, lastName, email, password }) {
  const mutation = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
          firstName
          lastName
        }
        customerUserErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password,
      acceptsMarketing: false
    },
  };

  const data = await request(mutation, variables);

  if (data.customerCreate.customerUserErrors?.length > 0) {
    throw new Error(data.customerCreate.customerUserErrors[0].message);
  }

  return data.customerCreate.customer;
}

// ===========================
// PRODUCTS — unchanged & working
// ===========================
export async function getAllProducts(first = 50) {
  const query = `
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            vendor
            description
            featuredImage { url altText }
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  price { amount currencyCode }
                  compareAtPrice: compareAtPriceV2 { amount currencyCode }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await request(query, { first });

  return data.products.edges.map(edge => ({
    ...edge.node,
    variantId: edge.node.variants.edges[0]?.node.id || null,
    price: edge.node.variants.edges[0]?.node.price || null,
    compareAtPrice: edge.node.variants.edges[0]?.node.compareAtPrice || null,
  }));
}

// export async function getProductByHandle(handle) {
//   const query = `
//     query GetProduct($handle: String!) {
//       product(handle: $handle) {
//         id
//         title
//         handle
//         descriptionHtml
//         productType
//         featuredImage {
//           url
//           altText
//         }
//         images(first: 20) {
//           edges {
//             node {
//               url
//               altText
//             }
//           }
//         }
//         variants(first: 50) {
//           edges {
//             node {
//               id
//               title
//               price {
//                 amount
//                 currencyCode
//               }
//               compareAtPrice: compareAtPriceV2 {
//                 amount
//                 currencyCode
//               }
//             }
//           }
//         }
//         capacity: metafield(namespace: "custom", key: "capacity") {
//           value
//         }
//         care_advice: metafield(namespace: "custom", key: "care_advice") {
//           value
//         }
//       }
//     }
//   `;

//   try {
//     const data = await request(query, { handle });
//     if (!data?.product) return null;

//     // ✅ Normalize variants with proper structure
//     const variants = data.product.variants?.edges.map(({ node }) => ({
//       id: node.id,
//       title: node.title,
//       price: {
//         amount: node.price.amount,
//         currencyCode: node.price.currencyCode,
//       },
//       compareAtPrice: node.compareAtPrice
//         ? {
//           amount: node.compareAtPrice.amount,
//           currencyCode: node.compareAtPrice.currencyCode,
//         }
//         : null,
//     })) || [];

//     const product = {
//       id: data.product.id,
//       title: data.product.title,
//       handle: data.product.handle,
//       descriptionHtml: data.product.descriptionHtml,
//       productType: data.product.productType,
//       featuredImage: data.product.featuredImage,
//       images: data.product.images?.edges.map(e => e.node) || [],
//       variants, // ✅ Array of variants with full price structure
//       metafields: [
//         {
//           namespace: "custom",
//           key: "capacity",
//           value: data.product.capacity?.value || ""
//         },
//         {
//           namespace: "custom",
//           key: "care_advice",
//           value: data.product.care_advice?.value || ""
//         },
//       ],
//     };

//     return product;
//   } catch (error) {
//     console.error(`Failed to load product: ${handle}`, error.message);
//     return null;
//   }
// }


export async function getProductByHandle(handle) {
  const query = `
    query GetProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        descriptionHtml
        productType

        featuredImage {
          url
          altText
        }

        images(first: 20) {
          edges {
            node {
              url
              altText
            }
          }
        }

        variants(first: 50) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              compareAtPrice: compareAtPriceV2 {
                amount
                currencyCode
              }
              image {
                url
                altText
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }

        capacity: metafield(namespace: "custom", key: "capacity") {
          value
        }
        care_advice: metafield(namespace: "custom", key: "care_advice") {
          value
        }
      }
    }
  `;

  try {
    const data = await request(query, { handle });
    if (!data?.product) return null;

    // ✅ Normalize variants (with image)
    const variants =
      data.product.variants?.edges.map(({ node }) => ({
        id: node.id,
        title: node.title,
        price: {
          amount: node.price.amount,
          currencyCode: node.price.currencyCode,
        },
        compareAtPrice: node.compareAtPrice
          ? {
            amount: node.compareAtPrice.amount,
            currencyCode: node.compareAtPrice.currencyCode,
          }
          : null,
        image: node.image
          ? {
            url: node.image.url,
            altText: node.image.altText,
          }
          : null,
        options: node.selectedOptions,
      })) || [];

    const product = {
      id: data.product.id,
      title: data.product.title,
      handle: data.product.handle,
      descriptionHtml: data.product.descriptionHtml,
      productType: data.product.productType,

      featuredImage: data.product.featuredImage,

      images: data.product.images?.edges.map(e => e.node) || [],

      variants,

      metafields: [
        {
          namespace: "custom",
          key: "capacity",
          value: data.product.capacity?.value || "",
        },
        {
          namespace: "custom",
          key: "care_advice",
          value: data.product.care_advice?.value || "",
        },
      ],
    };

    return product;
  } catch (error) {
    console.error(`Failed to load product: ${handle}`, error);
    return null;
  }
}


// ===========================
// CART FUNCTIONS — enhanced with full fetches & items mapping
// ===========================
export async function getCartById(cartId) {
  try {
    const data = await request(
      `
      query getCart($id: ID!) {
        cart(id: $id) {
          id
          checkoutUrl
          totalQuantity
          cost {
            subtotalAmount { amount currencyCode }
            totalAmount { amount currencyCode }
            totalTaxAmount { amount currencyCode }
            totalDutyAmount { amount currencyCode }
          }
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    image { url }
                    price { amount currencyCode }
                    product { title featuredImage { url } }
                  }
                }
              }
            }
          }
        }
      }
      `,
      { id: cartId }
    );

    if (!data.cart) return null;

    const cart = data.cart;

    // Map lines to items for consistency
    cart.items =
      cart.lines?.edges.map((edge) => ({
        id: edge.node.id,
        quantity: edge.node.quantity,
        variant: edge.node.merchandise,
      })) || [];

    delete cart.lines; // Clean up raw GraphQL response

    // Ensure cost object exists (avoid null errors)
    cart.cost = cart.cost || {
      subtotalAmount: { amount: "0", currencyCode: "INR" },
      totalAmount: { amount: "0", currencyCode: "INR" },
      totalTaxAmount: { amount: "0", currencyCode: "INR" },
      totalDutyAmount: { amount: "0", currencyCode: "INR" },
    };

    return cart;
  } catch (err) {
    if (typeof window !== "undefined") {
      localStorage?.removeItem("guestCartId");
    }
    console.error("Failed to fetch cart by ID:", err);
    return null;
  }
}

export async function createCart() {
  const data = await request(`
    mutation cartCreate {
      cartCreate {
        cart {
          id
          checkoutUrl
          totalQuantity
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price { amount currencyCode }
                    product { title featuredImage { url } }
                  }
                }
              }
            }
          }
        }
        userErrors { field message }
      }
    }
  `);

  if (data.cartCreate?.userErrors?.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }

  const cart = data.cartCreate.cart;

  // ✅ Map to items
  cart.items = cart.lines?.edges.map(edge => ({
    id: edge.node.id,
    quantity: edge.node.quantity,
    variant: edge.node.merchandise,
  })) || [];

  delete cart.lines;

  if (typeof window !== "undefined") {
    localStorage.setItem("guestCartId", cart.id);
  }

  return cart;
}

// export async function addToCartServer(variantId, quantity = 1, cartId = null, customerShopifyId = null) {
//   const isBrowser = typeof window !== "undefined";
//   let effectiveCartId = cartId;
//   const customerId = customerShopifyId || (isBrowser ? localStorage.getItem("customerShopifyId") : null);

//   // Logic to find/create cartId
//   if (!effectiveCartId) {
//     if (customerId) {
//       effectiveCartId = await getCustomerCartId(customerId);
//       if (!effectiveCartId) {
//         const newCart = await createCart();
//         await saveCustomerCartId(customerId, newCart.id);
//         effectiveCartId = newCart.id;
//       }
//     } else {
//       // Guest
//       const guestCartId = isBrowser ? localStorage.getItem("guestCartId") : null;
//       if (guestCartId) {
//         const guestCart = await getCartById(guestCartId);
//         effectiveCartId = guestCart?.id || null;
//       }
//       if (!effectiveCartId) {
//         const newCart = await createCart();
//         effectiveCartId = newCart.id;
//         if (isBrowser) {
//           localStorage.setItem("guestCartId", effectiveCartId);
//         }
//       }
//     }
//   }

//   // 🔥 CRITICAL FIX: Convert to full Global ID
//   const merchandiseId =
//     typeof variantId === "string" && variantId.startsWith("gid://")
//       ? variantId
//       : `gid://shopify/ProductVariant/${variantId}`;

//   let fullCart;

//   if (effectiveCartId) {
//     // Existing cart → use cartLinesAdd
//     const data = await request(
//       `
//       mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
//         cartLinesAdd(cartId: $cartId, lines: $lines) {
//           cart {
//             id
//             checkoutUrl
//             totalQuantity
//             lines(first: 50) {
//               edges {
//                 node {
//                   id
//                   quantity
//                   merchandise {
//                     ... on ProductVariant {
//                       id
//                       title
//                       image { url }
//                       price { amount currencyCode }
//                       product { title featuredImage { url } }
//                     }
//                   }
//                 }
//               }
//             }
//           }
//           userErrors { field message }
//         }
//       }
//       `,
//       {
//         cartId: effectiveCartId,
//         lines: [{ merchandiseId, quantity }],
//       }
//     );

//     if (data.cartLinesAdd?.userErrors?.length > 0) {
//       throw new Error(data.cartLinesAdd.userErrors[0].message);
//     }

//     fullCart = data.cartLinesAdd.cart;
//   } else {
//     // No cart yet → create one with the first item
//     const data = await request(
//       `
//       mutation cartCreate($lines: [CartLineInput!]) {
//         cartCreate(lines: $lines) {
//           cart {
//             id
//             checkoutUrl
//             totalQuantity
//             lines(first: 50) {
//               edges {
//                 node {
//                   id
//                   quantity
//                   merchandise {
//                     ... on ProductVariant {
//                       id
//                       title
//                       image { url }
//                       price { amount currencyCode }
//                       product { title featuredImage { url } }
//                     }
//                   }
//                 }
//               }
//             }
//           }
//           userErrors { field message }
//         }
//       }
//       `,
//       { lines: [{ merchandiseId, quantity }] }
//     );

//     if (data.cartCreate?.userErrors?.length > 0) {
//       throw new Error(data.cartCreate.userErrors[0].message);
//     }

//     fullCart = data.cartCreate.cart;

//     // Save the new cartId for guest
//     if (!customerId && isBrowser) {
//       localStorage.setItem("guestCartId", fullCart.id);
//     }
//   }

//   // ✅ Map to items
//   fullCart.items = fullCart.lines?.edges.map(edge => ({
//     id: edge.node.id,
//     quantity: edge.node.quantity,
//     variant: edge.node.merchandise,
//   })) || [];

//   delete fullCart.lines;

//   return fullCart;
// }

// export async function addToCartServer(
//   variantId,
//   quantity = 1,
//   cartId = null,             // can be passed explicitly (from header/body)
//   customerShopifyId = null
// ) {
//   const isBrowser = typeof window !== "undefined";

//   // 1. Determine final customer identifier
//   const customerId = customerShopifyId || (isBrowser ? localStorage.getItem("customerShopifyId") : null);

//   // 2. Determine which cart ID to start with
//   let effectiveCartId = cartId;

//   if (!effectiveCartId) {
//     if (customerId) {
//       // Logged-in: try to get existing customer cart
//       effectiveCartId = await getCustomerCartId(customerId);
//     } else if (isBrowser) {
//       // Guest: use localStorage
//       effectiveCartId = localStorage.getItem("guestCartId");
//     }
//   }

//   // 3. Normalize variant ID to full GID
//   const merchandiseId = variantId.startsWith("gid://shopify/ProductVariant/")
//     ? variantId
//     : `gid://shopify/ProductVariant/${variantId}`;

//   let fullCart;
//   let createdNewCart = false;

//   try {
//     if (effectiveCartId) {
//       // Try to add to existing cart
//       const data = await request(
//         `
//         mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
//           cartLinesAdd(cartId: $cartId, lines: $lines) {
//             cart {
//               id
//               checkoutUrl
//               totalQuantity
//               lines(first: 50) {
//                 edges {
//                   node {
//                     id
//                     quantity
//                     merchandise {
//                       ... on ProductVariant {
//                         id
//                         title
//                         image { url }
//                         price { amount currencyCode }
//                         product { title featuredImage { url } }
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//             userErrors { field message code }
//           }
//         }
//         `,
//         {
//           cartId: effectiveCartId,
//           lines: [{ merchandiseId, quantity }],
//         }
//       );

//       if (data.cartLinesAdd?.userErrors?.length > 0) {
//         const err = data.cartLinesAdd.userErrors[0];
//         // Important: detect "cart not found" situation
//         if (err.code === "INVALID" && err.message.includes("not found")) {
//           effectiveCartId = null; // fall through to create new
//         } else {
//           throw new Error(err.message);
//         }
//       } else {
//         fullCart = data.cartLinesAdd.cart;
//       }
//     }

//     // 4. If no cart or previous cart was invalid → create new one
//     if (!fullCart) {
//       const data = await request(
//         `
//         mutation cartCreate($input: CartInput!) {
//           cartCreate(input: $input) {
//             cart {
//               id
//               checkoutUrl
//               totalQuantity
//               lines(first: 50) {
//                 edges {
//                   node {
//                     id
//                     quantity
//                     merchandise {
//                       ... on ProductVariant {
//                         id
//                         title
//                         image { url }
//                         price { amount currencyCode }
//                         product { title featuredImage { url } }
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//             userErrors { field message }
//           }
//         }
//         `,
//         {
//           input: {
//             lines: [{ merchandiseId, quantity }],
//             // Optional: you can add buyerIdentity here later for logged-in users
//           }
//         }
//       );

//       if (data.cartCreate?.userErrors?.length > 0) {
//         throw new Error(data.cartCreate.userErrors[0].message);
//       }

//       fullCart = data.cartCreate.cart;
//       createdNewCart = true;
//     }

//     // 5. Save cart ID appropriately
//     if (createdNewCart || !effectiveCartId) {
//       if (customerId) {
//         // For logged-in users → persist in database
//         await saveCustomerCartId(customerId, fullCart.id);
//       } else if (isBrowser) {
//         // For guests → localStorage only
//         localStorage.setItem("guestCartId", fullCart.id);
//         localStorage.setItem("cartId", fullCart.id); // many components read "cartId"
//       }
//     }

//     // 6. Normalize response
//     fullCart.items = fullCart.lines?.edges.map(edge => ({
//       id: edge.node.id,
//       quantity: edge.node.quantity,
//       variant: edge.node.merchandise,
//     })) || [];

//     delete fullCart.lines;

//     return fullCart;

//   } catch (err) {
//     console.error("addToCartServer failed:", err);
//     throw err;
//   }
// }

// lib/shopify.js – improved addToCartServer

export async function addToCartServer(
  variantId,
  quantity = 1,
  cartId = null,
  customerShopifyId = null
) {
  const isBrowser = typeof window !== "undefined";
  const customerId = customerShopifyId || (isBrowser ? localStorage.getItem("customerShopifyId") : null);

  let effectiveCartId = cartId;

  if (!effectiveCartId) {
    if (customerId) {
      effectiveCartId = await getCustomerCartId(customerId);
    } else if (isBrowser) {
      effectiveCartId = localStorage.getItem("guestCartId");
    }
  }

  const merchandiseId = variantId.startsWith("gid://shopify/ProductVariant/")
    ? variantId
    : `gid://shopify/ProductVariant/${variantId}`;

  let fullCart;
  let createdNewCart = false;

  // ── Try to add to existing cart first ──
  if (effectiveCartId) {
    try {
     const data = await request(
      `
      mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            checkoutUrl
            totalQuantity
            lines(first: 50) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      image { url }
                      price { amount currencyCode }
                      product { title featuredImage { url } }
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
            code
          }
        }
      }
      `,
      {
        cartId: effectiveCartId,
        lines: [{ merchandiseId, quantity }],
      }
    );

      // For cartCreate
      const dataCreate = await request(
        `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  image {
                    url
                  }
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    featuredImage {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
  `,
        {
          input: {
            lines: [{ merchandiseId, quantity }]
          }
        }
      );

      if (data.cartLinesAdd?.userErrors?.length > 0) {
        const err = data.cartLinesAdd.userErrors[0];

        // ── This is the critical check ──
        if (
          err.code === "INVALID" ||
          err.message.includes("not found") ||
          err.message.includes("does not exist") ||
          err.message.includes("Cart not found")
        ) {
          console.warn(`Cart ${effectiveCartId} no longer exists → creating new one`);
          effectiveCartId = null; // fall through to create
        } else {
          throw new Error(`cartLinesAdd failed: ${err.message}`);
        }
      } else {
        fullCart = data.cartLinesAdd.cart;
      }
    } catch (err) {
      console.error("cartLinesAdd attempt failed:", err.message);
      effectiveCartId = null; // force create new
    }
  }

  // ── Create new cart if needed ──
  // ── Create new cart if needed ──
  if (!fullCart) {
    const data = await request(
      `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
          totalQuantity
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    image {
                      url
                    }
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      featuredImage {
                        url
                      }
                    }
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
    `,
      {
        input: {
          lines: [{ merchandiseId, quantity }]
        }
      }
    );

    if (data.cartCreate?.userErrors?.length > 0) {
      throw new Error(data.cartCreate.userErrors[0].message);
    }

    fullCart = data.cartCreate.cart;
    createdNewCart = true;
  }

  // ── Save new ID correctly ──
  if (createdNewCart || !effectiveCartId) {
    if (customerId) {
      await saveCustomerCartId(customerId, fullCart.id);
      if (isBrowser) localStorage.removeItem("guestCartId"); // clean up
    } else if (isBrowser) {
      localStorage.setItem("guestCartId", fullCart.id);
      localStorage.setItem("cartId", fullCart.id);
    }
  }

  // Normalize items (your existing code)
  fullCart.items = fullCart.lines?.edges.map(edge => ({
    id: edge.node.id,
    quantity: edge.node.quantity,
    variant: edge.node.merchandise,
  })) || [];

  delete fullCart.lines;

  return fullCart;
}

export async function getCustomerCartId(shopifyCustomerId) {
  const data = await adminRequest(`
    query ($id: ID!) {
      customer(id: $id) {
        metafield(namespace: "anapurna", key: "cart_id") { value }
      }
    }`, { id: `gid://shopify/Customer/${shopifyCustomerId}` });
  return data.customer?.metafield?.value || null;
}

export async function saveCustomerCartId(shopifyCustomerId, cartId) {
  await adminRequest(`
    mutation ($input: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $input) {
        metafield { value }
        userErrors { message }
      }
    }`, {
    input: [{
      ownerId: `gid://shopify/Customer/${shopifyCustomerId}`,
      namespace: "anapurna",
      key: "cart_id",
      type: "single_line_text_field",
      value: cartId
    }]
  });
}

export async function getCart(customerShopifyId = null) {
  const isBrowser = typeof window !== "undefined";
  const customerId = customerShopifyId || (isBrowser ? localStorage.getItem("customerShopifyId") : null);

  if (customerId) {
    let cartId = await getCustomerCartId(customerId);

    if (!cartId && isBrowser) {
      const savedGuestCartId = localStorage.getItem("guestCartId");
      if (savedGuestCartId) {
        const guestCart = await getCartById(savedGuestCartId);
        if (guestCart?.items?.length > 0) { // Check items instead of raw lines
          await saveCustomerCartId(customerId, guestCart.id);
          cartId = guestCart.id;
          localStorage.removeItem("guestCartId");
        }
      }
    }

    if (!cartId) {
      const newCart = await createCart();
      await saveCustomerCartId(customerId, newCart.id);
      cartId = newCart.id;
    }

    const cart = await getCartById(cartId);
    return { ...cart, source: "customer" };
  }

  if (isBrowser) {
    const savedGuestCartId = localStorage.getItem("guestCartId");
    if (savedGuestCartId) {
      const cart = await getCartById(savedGuestCartId);
      if (cart) return { ...cart, source: "guest" };
    }
  }

  const freshCart = await createCart();
  return { ...freshCart, source: "guest" };
}

export async function updateCartLine(cartId, lineId, quantity) {
  if (!cartId || !lineId) throw new Error("cartId & lineId are required");

  const data = await request(
    `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          totalQuantity
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    image { url }
                    price { amount currencyCode }
                    product { title featuredImage { url } }
                  }
                }
              }
            }
          }
        }
      }
    }`,
    { cartId, lines: [{ id: lineId, quantity }] }
  );

  const cart = data.cartLinesUpdate.cart;

  // ✅ Map to items
  cart.items = cart.lines?.edges.map(edge => ({
    id: edge.node.id,
    quantity: edge.node.quantity,
    variant: edge.node.merchandise,
  })) || [];

  delete cart.lines;

  return cart;
}

export async function removeCartLine(cartId, lineId) {
  const data = await request(
    `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    image { url }
                    price { amount currencyCode }
                    product { title featuredImage { url } }
                  }
                }
              }
            }
          }
          estimatedCost { totalAmount { amount currencyCode } }
        }
        userErrors { field message }
      }
    }`,
    { cartId, lineIds: [lineId] }
  );

  const errors = data.cartLinesRemove.userErrors;
  if (errors?.length) throw new Error(errors[0].message);

  const cart = data.cartLinesRemove.cart;

  // ✅ Map to items
  cart.items = cart.lines?.edges.map(edge => ({
    id: edge.node.id,
    quantity: edge.node.quantity,
    variant: edge.node.merchandise,
  })) || [];

  delete cart.lines;

  return cart;
}



export async function getBlogs() {
  const query = `
    query getBlogs {
      blogs(first: 50) {
        edges {
          node {
            id
            handle
            title
            articles(first: 250) {
              edges {
                node {
                  id
                  title
                  handle
                  excerptHtml
                  contentHtml
                  publishedAt
                  image {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await request(query);

  return data.blogs.edges.map(edge => ({
    id: edge.node.id,
    handle: edge.node.handle,
    title: edge.node.title,
    articles: edge.node.articles.edges.map(a => ({
      id: a.node.id,
      title: a.node.title,
      handle: a.node.handle,
      excerpt: a.node.excerptHtml,
      contentHtml: a.node.contentHtml,
      publishedAt: a.node.publishedAt,
      image: a.node.image,
    })),
  }));
}

export async function getBlogByHandle(blogHandle, articlesFirst = 250) {
  const query = `
    query getBlogByHandle($handle: String!, $articlesFirst: Int!) {
      blog(handle: $handle) {
        id
        handle
        title
        articles(first: $articlesFirst) {
          edges {
            node {
              id
              title
              handle
              excerptHtml
              contentHtml
              publishedAt
              image {
                url
                altText
              }
            }
          }
        }
      }
    }
  `;

  const data = await request(query, {
    handle: blogHandle,
    articlesFirst,
  });

  if (!data?.blog) return null;

  return {
    ...data.blog,
    articles: data.blog.articles.edges.map(edge => ({
      ...edge.node,
      excerpt: edge.node.excerptHtml, // normalize
    })),
  };
}
