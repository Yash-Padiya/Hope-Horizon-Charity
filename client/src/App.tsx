import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RootLayout from "./Layout/RootLayout";
import Home from "./Pages/Home";
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";
import NotFoundPage from "./Pages/NotFound";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCookie } from "./utils/cookies";
import { fetchUserData } from "./store/auth/authSlice";
import UserDashboard from "./Pages/Admin/UserDashboard";
import CampaignDashboard from "./Pages/Admin/CampaignDashboard";
import HelpCenter from "./Pages/Admin/HelpCenter";
import VolunteerDashboard from "./Pages/Admin/VolunteerDashboard";
import Campaigns from "./Pages/Campaigns";
import Profile from "./components/Profile";
import ChangePassword from "./auth/ChangePassword";
import CampaignDetails from "./Pages/CampaignDetails";
import PaymentForm from "./Pages/PaymentForm";
import PaymentSuccess from "./Pages/PaymentSuccess";
import PaymentFailure from "./Pages/PaymentFailure";
import About from "./Pages/AboutUs";
import DonationHistory from "./Pages/DonationHistory";
import Dashboard from "./Pages/Admin/Dashboard";
import SupportPage from "./Pages/Support";
import ProtectedRoute, { AdminProtectedRoute } from "./auth/ProtectedRoutes";
import { RootState } from "./store/store";
function App() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    // Check if the 'authData' cookie exists
    const authData = getCookie("authData");
    if (authData && authData.token && authData.user_type) {
      dispatch(fetchUserData(authData)); // Pass the parsed user data from cookie to Redux
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaigns/:id" element={<CampaignDetails />} />
          {/* Private Routes */}
          {/* <Route element={<ProtectedRoute />}> */}
            <Route path="/help-support" element={<SupportPage />} />
            <Route path="/donation/history" element={<DonationHistory />} />
            <Route path="/auth/change-password" element={<ChangePassword />} />
            <Route path="/payments/:id" element={<PaymentForm />} />
            <Route
              path="/payment-success/:txnid"
              element={<PaymentSuccess />}
            />
            <Route
              path="/payment-failure/:txnid"
              element={<PaymentFailure />}
            />
            <Route path="/profile" element={<Profile />} />
          {/* </Route> */}
          {/* Admin Routes */}
          {/* <Route element={<AdminProtectedRoute />}> */}
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/donor-dashboard" element={<UserDashboard />} />
            <Route
              path="/admin/campaigns-dashboard"
              element={<CampaignDashboard />}
            />
            <Route path="/admin/helpcenter" element={<HelpCenter />} />
            <Route
              path="/admin/volunteer-dashboard"
              element={<VolunteerDashboard />}
            />
          {/* </Route> */}
          {/* Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
