let checkoutContext = null;
let firedAddress = false;
let firedPaymentMethod = null;
let firedPayNowMethod = null;
let firedPurchase = false;

export const setBreezeCheckoutContext = (ctx) => {
  checkoutContext = ctx;
  firedAddress = false;
  firedPaymentMethod = null;
  firedPayNowMethod = null;
  firedPurchase = false;
};

export const clearBreezeCheckoutContext = () => {
  checkoutContext = null;
  firedAddress = false;
  firedPaymentMethod = null;
  firedPayNowMethod = null;
  firedPurchase = false;
};

// ========================================
export const getBreezeCheckoutContext = () => checkoutContext;

export const getFiredAddress = () => firedAddress;
export const setFiredAddress = (value) => {
  firedAddress = value;
};

export const getFiredPaymentMethod = () => firedPaymentMethod;
export const setFiredPaymentMethod = (m) => {
  firedPaymentMethod = m;
};

export const getFiredPayNowMethod = () => firedPayNowMethod;
export const setFiredPayNowMethod = (m) => {
  firedPayNowMethod = m;
};

export const getFiredPurchase = () => firedPurchase;
export const setFiredPurchase = (v) => {
  firedPurchase = v;
};