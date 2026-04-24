import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import ProtectedRoute from './components/Route/ProtectedRoute';
import PublicRoute from "./components/Route//PublicRoute";

//pages
import Layout from './pages/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Signup from './pages/Signup';

const OnlinePharmacy = lazy(() => import('./pages/OnlinePharmacy'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const DiseasePrediction = lazy(() => import('./pages/DiseasePrediction'));
const HeartPrediction = lazy(() => import('./pages/HeartPrediction'));
const PatientProfile = lazy(() => import('./pages/PatientProfile'));
const StoreDashboard = lazy(() => import('./pages/StoreDashboard'));
const EmergencyCare = lazy(() => import('./pages/EmergencyCare'));
const CriticalDiseaseGuide = lazy(() => import('./pages/CriticalDiseaseGuide'));
const MaternityCareGuide = lazy(() => import('./pages/MaternityCareGuide'));
const BabyMotherCareGuide = lazy(() => import('./pages/BabyMotherCareGuide'));
const AddMedicine = lazy(() => import('./pages/AddMedicine'));
const DeleteMedicine = lazy(() => import('./pages/DeleteMedicine'));
const UpdateMedicine = lazy(() => import('./pages/UpdateMedicine'));
const Tracking = lazy(() => import('./pages/Tracking'));
const AddressPage = lazy(() => import('./pages/AddressPage').then((module) => ({ default: module.AddressPage })));
const PaymentPage = lazy(() => import('./pages/PaymentPage').then((module) => ({ default: module.PaymentPage })));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage').then((module) => ({ default: module.OrderConfirmationPage })));
const Orders = lazy(() => import('./pages/Orders'));
const AdminTracking = lazy(() => import('./pages/AdminTracking'));
const LungCancer = lazy(() => import('./pages/LungCancer'));
const KidneyPrediction = lazy(() => import('./pages/KidneyPrediction'));
const MyVaccination = lazy(() => import('./pages/MyVaccinations'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const NotFound = lazy(() => import('./pages/NotFound'));
const CartPage = lazy(() => import('./pages/Cart'));

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600 text-sm">
    Loading...
  </div>
);

function App() {

  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          <Route path='disease' element={<DiseasePrediction />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute allowedRoles={["User"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="admindashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path='onlinepharmacy' element={<OnlinePharmacy />} />
          <Route path='patientProfile' element={<PatientProfile />} />
          <Route
            path="storeDashboard"
            element={
              <ProtectedRoute allowedRoles={["Store"]}>
                <StoreDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/heart-disease" element={<HeartPrediction />} />
          <Route path="/emergencyguidelines" element={<EmergencyCare />} />
          <Route path="/critical-disease-guide" element={<CriticalDiseaseGuide />} />
          <Route path="/maternity-care" element={<MaternityCareGuide />} />
          <Route path="/baby-mother-care" element={<BabyMotherCareGuide />} />
          <Route path="/addmedicine" element={<AddMedicine />} />
          <Route path="/updatemedicine" element={<UpdateMedicine />} />
          <Route path="/deletemedicine" element={<DeleteMedicine />} />
          <Route path="/tracking/:id" element={<Tracking />} />
          <Route path="/addresspage" element={<AddressPage />} />
          <Route path="/payments" element={<PaymentPage />} />
          <Route path="/orderconfirmation" element={<OrderConfirmationPage />} />
          <Route path="/orders" element={<Orders />} />
          <Route
            path="/my-returns"
            element={
              <ProtectedRoute allowedRoles={["User"]}>
                <Navigate to="/dashboard" replace state={{ openSection: 'returns' }} />
              </ProtectedRoute>
            }
          />
          <Route path="/admintracking" element={<AdminTracking />} />
          <Route path="/lungcancerprediction" element={<LungCancer />} />
          <Route path="/kidneyprediction" element={<KidneyPrediction />} />
          <Route path="/myvaccinations" element={<MyVaccination />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="*" element={<NotFound />} />
          <Route
            path="cart"
            element={
              <ProtectedRoute allowedRoles={["User"]}>
                <CartPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
