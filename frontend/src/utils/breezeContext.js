
let checkoutContext = null;
let firedPaymentMethod = null;
let firedPurchase = false;

export const setBreezeCheckoutContext = (ctx) => {
  checkoutContext = ctx;
  firedPaymentMethod = null;
  firedPurchase = false;
};

export const clearBreezeCheckoutContext = () => {
  checkoutContext = null;
  firedPaymentMethod = null;
  firedPurchase = false;
};

export const getBreezeCheckoutContext = () => checkoutContext;

export const getFiredPaymentMethod = () => firedPaymentMethod;
export const setFiredPaymentMethod = (m) => {
  firedPaymentMethod = m;
};

export const getFiredPurchase = () => firedPurchase;
export const setFiredPurchase = (v) => {
  firedPurchase = v;
};