"use client";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { store } from "./app/store";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import SignupModal from "./components/SignupModal";
import Email from "./components/ForgetPassword/Email";
import Otp from "./components/ForgetPassword/Otp";
import ResetPassword from "./components/ForgetPassword/ResetPassword";
import SuccessfullyChange from "./components/ForgetPassword/SuccessfullyChange";
import ProtectedRoute from "./components/ProtectedRoute";
import { ForgotPasswordProvider } from "./components/ForgetPassword/ForgotPasswordContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// --- Import other page components ---
import Home from "./pages/Home/Home";
import ProductPage from "./pages/Product/ProductPage";
import DetailPage from "./pages/DetailPage/DetailPage";
import ShoppingCart from "./pages/DetailPage/ShoppingCart";
import MainAddressPage from "./pages/Order/MainAddressPage";
import ReviewAndConfirm from "./pages/Order/ReviewAndConfirm";
import PaymentPage from "./pages/Order/PaymentPage";
import Profile from "./pages/Profile/Profile";
import OrdersAndPurchases from "./pages/Profile/OrdersAndPurchases";
import CancelOrder from "./pages/Profile/CancelOrder";
import UseRazorpay from "./pages/Order/UseRazorpay";
import Productpage from "./pages/Productpage";
import ProductDetails from "./pages/ProductDetails";
import Gemstone from "./pages/Gemstone";
import Jewellery from "./pages/Jewellery";
import GemSuggestion from "./pages/GemSuggestion";
import Jewellerybyfilter from "./pages/jewellerybyfilter";
import GemstoneListPage from "./pages/GemstoneList";
import JewelryListPage from "./pages/JewelryListPage";
import WishlistPage from "./pages/WishlistPage";
import FilterProductPage from "./pages/Product/FilterProductPage";
import SearchResultsPage from "./components/SearchResultsPage";
import AboutUs from "./pages/StaticPages/AboutUs";
import ContactUs from "./pages/StaticPages/ContactUs";
import ProductList from "./pages/Product/ProductList";
import RingSize from "./pages/StaticPages/RingSize";
import Privacy from "./pages/StaticPages/Privacy";
import Gemstoneguide from "./pages/StaticPages/Gemstoneguide";
import Shipping from "./pages/StaticPages/Shipping";
import CustomDuties from "./pages/StaticPages/CustomDuties";
import RefundPolicy from "./pages/StaticPages/RefundPolicy";
import Testimonals from "./pages/StaticPages/Testimonals";
import TermsConditions from "./pages/StaticPages/TermsCondititions";
import CaratToRattiConverter from "./pages/StaticPages/CaratToRattiConverter";
import CareerPage from "./pages/StaticPages/CareerPage";
import { setRedirectPath } from "../src/features/api/authSlice";
import PurposeCollection from "./components/filters/PurposeCollection";
import RandomWrapper from "./components/RandomWrapper";
import { generateRandomString } from "./utils/randomString";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import { initBlaze } from "./utils/blazeCheckout";
import BlazeSDK from "@juspay/blaze-sdk-web";


const BASE_URL = import.meta.env.BASE_URL;

// --- ScrollToTop component (remains unchanged) ---
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    // ✅ additional improvement from tejas
    if (window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [pathname]);

  return null;
};

// --- AppWrapper Component (Login/Auth and Redirection Logic) ---
function AppWrapper() {
  // State to manage the active modal/flow
  const [activeModal, setActiveModal] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // HANDLERS FOR MODAL STATE TRANSITIONS

  // Closes the modal and navigates back in browser history
  const handleCloseModal = () => {
    setActiveModal(null);
    navigate(-1);
  };

  // new function to return where user left
  const handleJustCloseModal = () => {
    setActiveModal(null);
  };

  // FORWARD NAVIGATION HANDLERS
  const handleSwitchToSignup = () => setActiveModal("signup");
  const handleSwitchToLogin = () => {
    dispatch(setRedirectPath(location.pathname + location.search));
    setActiveModal("login");
  };
  const handleSwitchToForgotPasswordEmail = () =>
    setActiveModal("forgotPasswordEmail");
  const handleSwitchToForgotPasswordOtp = () =>
    setActiveModal("forgotPasswordOtp");

  // OTP Success handler: Moves to the final Reset Password step
  const handleSwitchToResetPassword = () => setActiveModal("resetPassword");

  // Reset Password Success handler: Shows the success component
  const handleResetPasswordComplete = () => {
    setActiveModal("resetSuccess");
  };

  // BACK NAVIGATION HANDLERS
  const handleBackToLogin = () => setActiveModal("login");
  const handleBackToEmail = () => setActiveModal("forgotPasswordEmail");
  const handleBackToOtp = () => setActiveModal("forgotPasswordOtp");


  return (
    <>
      <Navbar handleLoginClick={handleSwitchToLogin} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/gemstone/:slug" element={<ProductList />} />
        <Route path="/gemstone/filter/:slug" element={<FilterProductPage />} />
        <Route path="/gemstones/:slug" element={<DetailPage />} />
        <Route path="/gemstones/:slug/:generateRandomString?" element={<DetailPage />} />
        <Route path="/search-results" element={<SearchResultsPage />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/ring-size" element={<RingSize />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/gemstone-buy-guide" element={<Gemstoneguide />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/custom-duties" element={<CustomDuties />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/testimonals" element={<Testimonals />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/gemstone/purpose/:slug" element={<PurposeCollection />} />
        <Route
          path="/carat-to-ratti-converter"
          element={<CaratToRattiConverter />}
        />
        <Route path="/career" element={<CareerPage />} />

        {/* --- PUBLIC CART & WISHLIST (Removed ProtectedRoute wrapper) --- */}
        <Route path="/shopping/cart" element={<ShoppingCart />} />
        <Route path="/wishlist" element={<WishlistPage />} />

        {/* Protected Routes (Only for Shipping, Payment, Profile, Orders) */}
        <Route
          path="/shipping/address"
          element={
            <ProtectedRoute onRequireLogin={handleSwitchToLogin}>
              <MainAddressPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/review_And/confirm/details"
          element={
            <ProtectedRoute onRequireLogin={handleSwitchToLogin}>
              <ReviewAndConfirm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/page"
          element={
            <ProtectedRoute onRequireLogin={handleSwitchToLogin}>
              <PaymentPage />
            </ProtectedRoute>
          }
        />

        {/* Razorpay Route */}
        <Route
          path="/use-razorpay"
          element={
            <ProtectedRoute onRequireLogin={handleSwitchToLogin}>
              <UseRazorpay />
            </ProtectedRoute>
          }
        />

        <Route
          path="/personal/profile"
          element={
            <ProtectedRoute onRequireLogin={handleSwitchToLogin}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/and/purchases/:generateRandomString?"
          element={
            <ProtectedRoute onRequireLogin={handleSwitchToLogin}>
              <OrdersAndPurchases />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cancel/order/:orderId"
          element={
            <ProtectedRoute onRequireLogin={handleSwitchToLogin}>
              <CancelOrder />
            </ProtectedRoute>
          }
        />

        {/* Routes from second App */}
        <Route path="/jewelry" element={<Jewellery />} />
        <Route path="/jewelry/:slug" element={<Productpage />} />
        <Route path="/jewelry/:slug/:generateRandomString?" element={<Productpage />} />
        <Route path="/jewelry-list" element={<JewelryListPage />} />
        <Route path="/details/product/:slugOrId/:generateRandomString?" element={<ProductDetails />} />
        <Route path="/gemstone/:generateRandomString?" element={<Gemstone />} />
        <Route path="/jewellery" element={<Jewellery />} />
        <Route path="/suggest" element={<GemSuggestion />} />
        <Route path="/jewellery-results" element={<Jewellerybyfilter />} />
        <Route path="/filter-gemstone" element={<GemstoneListPage />} />
      </Routes>

      <Footer />
      <FloatingWhatsApp />

      {/* --- MODAL RENDERING BASED ON activeModal STATE --- */}

      {activeModal === "login" && (
        <LoginModal
          onClose={handleJustCloseModal}
          onSwitchToSignup={handleSwitchToSignup}
          onForgotPassword={handleSwitchToForgotPasswordEmail}
        />
      )}

      {activeModal === "signup" && (
        <SignupModal
          onClose={handleJustCloseModal}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}

      {/* Forgot Password Step 1: Email */}
      {activeModal === "forgotPasswordEmail" && (
        <Email
          onClose={handleJustCloseModal}
          onBack={handleBackToLogin}
          onContinue={handleSwitchToForgotPasswordOtp} // Go to OTP
        />
      )}

      {/* Forgot Password Step 2: OTP */}
      {activeModal === "forgotPasswordOtp" && (
        <Otp
          onClose={handleJustCloseModal}
          onBack={handleBackToEmail}
          onVerificationSuccess={handleSwitchToResetPassword} // Go to Reset Password
        />
      )}

      {/* Forgot Password Step 3: Reset Password */}
      {activeModal === "resetPassword" && (
        <ResetPassword
          onClose={handleJustCloseModal}
          onBack={handleBackToOtp} // Go back to OTP
          onResetSuccess={handleResetPasswordComplete} // On success, show the success screen
        />
      )}

      {/* Forgot Password Step 4: Success Screen */}
      {activeModal === "resetSuccess" && (
        <SuccessfullyChange
          onClose={handleJustCloseModal} // Close the modal
          onLoginClick={handleSwitchToLogin} // 'Done' button should likely go to the Login screen
        />
      )}
      <ToastContainer
        limit={1}
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        style={{
          marginTop: "100px",
          zIndex: 999999,
        }}
      />
    </>
  );
}

// --- Main App Component ---
// function App() {
//   return (
//     <Provider store={store}>
//       <Router basename={BASE_URL || "/gemstone/user/"}>
//         <ForgotPasswordProvider>
//           <ScrollToTop />

//           <AppWrapper />


//         </ForgotPasswordProvider>
//       </Router>
//     </Provider>
//   );
// }

function App() {

useEffect(() => {

BlazeSDK.initiate(
  {
    requestId:
      crypto.randomUUID(),

    service:
      "in.breeze.onecco",

    payload: {
      action:
        "initiate",

      clientId:
        "gemrishi",

      merchantId:
        "gemrishi",

      environment:
        "production",

      integrationType:
        "redirection",
    },
  },

  (response) => {

    console.log(
      "BLAZE INIT:",
      response
    );

    console.log(
      "PROCESS:",
      typeof BlazeSDK.process
    );
  }
);

}, []);

  return (
    <Provider store={store}>
      <Router basename={BASE_URL || "/gemstone/user/"}>
        <ForgotPasswordProvider>

          <ScrollToTop />

          <AppWrapper />

        </ForgotPasswordProvider>
      </Router>
    </Provider>
  );
}

export default App;
