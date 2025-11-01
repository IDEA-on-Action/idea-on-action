import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Notices from "./pages/Notices";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFail from "./pages/PaymentFail";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import TwoFactorSetup from "./pages/TwoFactorSetup";
import TwoFactorVerify from "./pages/TwoFactorVerify";
import Forbidden from "./pages/Forbidden";
import NotFound from "./pages/NotFound";
import { AdminRoute } from "./components/auth/AdminRoute";
import { AdminLayout } from "./components/layouts/AdminLayout";
import { CartDrawer } from "./components/cart";
import Dashboard from "./pages/admin/Dashboard";
import AdminServices from "./pages/admin/AdminServices";
import CreateService from "./pages/admin/CreateService";
import EditService from "./pages/admin/EditService";
import AdminBlog from "./pages/admin/AdminBlog";
import CreateBlogPost from "./pages/admin/CreateBlogPost";
import EditBlogPost from "./pages/admin/EditBlogPost";
import AdminNotices from "./pages/admin/AdminNotices";
import CreateNotice from "./pages/admin/CreateNotice";
import EditNotice from "./pages/admin/EditNotice";
import AdminRoles from "./pages/admin/AdminRoles";
import AuditLogs from "./pages/admin/AuditLogs";
import AdminOrders from "./pages/admin/Orders";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <CartDrawer />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/payment" element={<Payment />} />
            <Route path="/checkout/payment/kakao/success" element={<PaymentSuccess />} />
            <Route path="/checkout/payment/toss/success" element={<PaymentSuccess />} />
            <Route path="/checkout/payment/kakao/fail" element={<PaymentFail />} />
            <Route path="/checkout/payment/kakao/cancel" element={<PaymentFail />} />
            <Route path="/checkout/payment/toss/fail" element={<PaymentFail />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/2fa/setup" element={<TwoFactorSetup />} />
            <Route path="/2fa/verify" element={<TwoFactorVerify />} />
            <Route path="/forbidden" element={<Forbidden />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="services/new" element={<CreateService />} />
              <Route path="services/:id/edit" element={<EditService />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="blog/new" element={<CreateBlogPost />} />
              <Route path="blog/:id/edit" element={<EditBlogPost />} />
              <Route path="notices" element={<AdminNotices />} />
              <Route path="notices/new" element={<CreateNotice />} />
              <Route path="notices/:id/edit" element={<EditNotice />} />
              <Route path="roles" element={<AdminRoles />} />
              <Route path="audit-logs" element={<AuditLogs />} />
              <Route path="orders" element={<AdminOrders />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
