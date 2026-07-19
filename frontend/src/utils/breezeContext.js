
let checkoutContext = null;
let firedPaymentMethod = null;
let firedPurchase = false;
let firedAddress = null;

export const setBreezeCheckoutContext = (ctx) => {
  checkoutContext = ctx;
  firedPaymentMethod = null;
  firedPurchase = false;
 firedAddress = null;
};
export const clearBreezeCheckoutContext = () => {
  checkoutContext = null;
  firedPaymentMethod = null;
  firedPurchase = false;
   firedAddress = null; 
};
// ========================================
export const getBreezeCheckoutContext = () => checkoutContext;

export const getFiredPaymentMethod = () => firedPaymentMethod;
export const setFiredPaymentMethod = (m) => {
  firedPaymentMethod = m;
};

export const getFiredPurchase = () => firedPurchase;
export const setFiredPurchase = (v) => {
  firedPurchase = v;
};
export const getFiredAddress = () => firedAddress;
export const setFiredAddress = (addr) => {
  firedAddress = addr;
};