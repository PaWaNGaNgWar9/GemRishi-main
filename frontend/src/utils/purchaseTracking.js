// ===== Add By Pawan ==========================================================================
export function trackPurchaseEvent({
  orderId,
  subtotal,
  tax = 0,
  shipping = 0,
  coupon = "",
  currency = "INR",
  items = [],
}) {
  if (!orderId) {
    console.warn("[purchaseTracking] Missing orderId — skipping purchase event");
    return;
  }

  const storageKey = `tracked_order_${orderId}`;

  try {
    if (sessionStorage.getItem(storageKey)) return;
    sessionStorage.setItem(storageKey, "1");
  } catch (e) {
    console.warn("[purchaseTracking] sessionStorage unavailable:", e);
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ecommerce: null });

  window.dataLayer.push({
    event: "purchase",
    ecommerce: {
      transaction_id: String(orderId),
      value: Number(subtotal) || 0,
      tax: Number(tax) || 0,
      shipping: Number(shipping) || 0,
      currency,
      coupon: coupon || "",
      items: items.map((item) => ({
        item_id: String(item.id ?? ""),
        item_name: item.name ?? "",
        item_brand: item.brand ?? "Gemrishi",
        item_category: item.category ?? "",
        item_variant: item.variant ?? "",
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
      })),
    },
  });
}

export function buildItemsFromCartData(cartData = []) {
  return cartData.map((item) => {
    const variant =
      item.customization?.quality?.name ||
      item.customization?.goldKarat?.name ||
      item.customization?.certificate?.name ||
      "";
    return {
      id: item.productId || item.jewelryId || item.name,
      name: item.name,
      category: item.itemType || "",
      variant,
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
    };
  });
}

// (Add By Pawan) buildItemsFromRawCart — for files (ShoppingCart.jsx) whose cartData comes
// straight from the API in its raw nested shape ({ item: {...}, quantity, totalPrice }),
// instead of the flat shape ({ name, price, productId }) that buildItemsFromCartData()
// above expects. Using buildItemsFromCartData() on raw cart data silently produced
// id: undefined, name: undefined, price: 0 in every event.
export function buildItemsFromRawCart(cartData = []) {
  return cartData.map((cartItem) => {
    const isJewelry = cartItem.itemType === "Jewelry";
    const hasJewelryCustomization = !!cartItem.customization?.jewelryId;
    const name = isJewelry
      ? cartItem.item?.jewelryName
      : hasJewelryCustomization
      ? cartItem.customization.jewelryId?.jewelryName
      : cartItem.item?.name;
    const variant =
      cartItem.customization?.quality?.name ||
      cartItem.customization?.goldKarat?.name ||
      cartItem.customization?.certificate?.name ||
      "";
    const qty = Number(cartItem.quantity) || 1;
    return {
      id: String(cartItem.item?._id || cartItem._id || ""),
      name: name || "Unnamed Item",
      category: cartItem.itemType || "",
      variant,
      price: qty
        ? Number((Number(cartItem.totalPrice || 0) / qty).toFixed(2))
        : Number(cartItem.totalPrice) || 0,
      quantity: qty,
    };
  });
}

export function buildItemsFromOrder(order) {
  return (order?.items || []).map((item) => {
    const product = item.productId;
    const jewelry = item.jewelryId;
    const linked =
      typeof product === "object" && product
        ? product
        : typeof jewelry === "object" && jewelry
        ? jewelry
        : null;
    const quantity = Number(item.quantity) || 1;
    const price =
      (Number(item.itemTotal) || 0) / quantity || Number(linked?.price) || 0;
    const variant =
      item.customization?.quality?.name ||
      item.customization?.goldKarat?.name ||
      item.customization?.certificate?.name ||
      "";
    return {
      id: linked?._id || (typeof product === "string" ? product : jewelry) || item._id,
      name: linked?.name || linked?.jewelryName || item.name || "Item",
      category: linked ? (jewelry ? "Jewelry" : "Gemstone") : "",
      variant,
      price,
      quantity,
    };
  });
}
// ===== End Add By Pawan ============================================================