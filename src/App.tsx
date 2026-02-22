import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import CategoryManagementPage from "./pages/admin/CategoryManagementPage";
import ProductManagementPage from "./pages/admin/ProductManagementPage";
import HelpCenterPage from "./pages/admin/HelpCenterPage";
import TermsPage from "./pages/admin/TermsPage";
import PrivacyPolicyPage from "./pages/admin/PrivacyPolicyPage";
import CookiePolicyPage from "./pages/admin/CookiePolicyPage";
import EmailConfigPage from "./pages/admin/EmailConfigPage";
import PlaceholderPage from "./pages/admin/PlaceholderPage";
import ProgramConfigPage from "./pages/admin/ProgramConfigPage";
import BackgroundImagesPage from "./pages/admin/BackgroundImagesPage";
import BulkUploadPage from "./pages/admin/BulkUploadPage";
import PopularProductsPage from "./pages/admin/PopularProductsPage";
import ShowcaseProductsPage from "./pages/admin/ShowcaseProductsPage";
import ProductBannerPage from "./pages/admin/ProductBannerPage";
import PromoBannerPage from "./pages/admin/PromoBannerPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/admin" replace /> : <LoginPage />} />
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="categories" element={<CategoryManagementPage />} />
        <Route path="products" element={<ProductManagementPage />} />
        <Route path="programs" element={<ProgramConfigPage />} />
        <Route path="bulk-upload" element={<BulkUploadPage />} />
        <Route path="popular-products" element={<PopularProductsPage />} />
        <Route path="showcase-products" element={<ShowcaseProductsPage />} />
        <Route path="product-banners" element={<ProductBannerPage />} />
        <Route path="promo-banners" element={<PromoBannerPage />} />
        <Route path="background-images" element={<BackgroundImagesPage />} />
        <Route path="email-config" element={<EmailConfigPage />} />
        <Route path="help-center" element={<HelpCenterPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="cookie-policy" element={<CookiePolicyPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
