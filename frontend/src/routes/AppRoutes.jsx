import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/account/LoginPage";
import SignupPage from "../pages/account/SignupPage";
import ProductsPage from "../pages/ProductsPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import ProfilePage from "../pages/profile/ProfilePage";
import OrdersPage from "../pages/profile/OrdersPage";
import WishlistPage from "../pages/profile/WishlistPage";
import AddressPage from "../pages/profile/AddressPage";
import SettingsPage from "../pages/profile/SettingsPage";
import VouchersPage from "../pages/profile/VouchersPage";
import ContactPage from "../pages/ContactPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import CustomersManagement from "../pages/admin/CustomersManagement";
import ProductsManagement from "../pages/admin/ProductsManagement";
import OrdersManagement from "../pages/admin/OrdersManagement";
import SearchPage from "../pages/SearchPage";
import ForgetpasswordPage from "../pages/account/ForgetpasswordPage";
import ResetpasswordPage from "../pages/account/ResetpasswordPage";
import CheckoutPage from "../pages/checkout/CheckoutPage";
import OrderSuccessPage from "../pages/checkout/OrderSuccessPage";
import PrivacyPolicyPage from "../pages/policies/PrivacyPolicyPage";
import TermsPage from "../pages/policies/TermsPage";
import ShippingPolicyPage from "../pages/policies/ShippingPolicyPage";
import RefundPolicyPage from "../pages/policies/RefundPolicyPage";
import NotFoundPage from "../pages/NotFoundPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/category/:categoryName" element={<ProductsPage />} />
      <Route path="/search/:searchParams" element={<SearchPage />} />
      <Route path="/product/:productId" element={<ProductDetailPage />} />


      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgetpasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetpasswordPage />} />


      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/checkout/success" element={<OrderSuccessPage />} />

      <Route path="/account" element={<ProfilePage />} />
      <Route path="/account/orders" element={<OrdersPage />} />
      <Route path="/account/wishlist" element={<WishlistPage />} />
      <Route path="/account/addresses" element={<AddressPage />} />
      <Route path="/account/settings" element={<SettingsPage />} />
      <Route path="/account/gift-vouchers" element={<VouchersPage />} />

      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
      <Route path="/refund-policy" element={<RefundPolicyPage />} />

      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/customers" element={<CustomersManagement />} />
      <Route path="/admin/products" element={<ProductsManagement />} />
      <Route path="/admin/orders" element={<OrdersManagement />} />


       <Route path="*" element={<NotFoundPage/>} />

    </Routes>
  );
}