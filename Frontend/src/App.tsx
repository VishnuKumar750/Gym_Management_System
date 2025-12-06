import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import Users from "./components/Users";
import Bills from "./components/Bills";
import Notification from "./components/Notification";
import AuthForm from "./components/AuthForm";

import DashboardLayout from "./components/layout/DashboardLayout";
import AuthLayout from "./components/layout/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Report from "./components/Report";
import Profile from "./components/Profile";

function App() {


  return (
    <Router>
        
        <Routes>

          {/* Public Route */}
          <Route
            path="/login"
            element={
              <AuthLayout>
                <AuthForm />
              </AuthLayout>
            }
          />

          {/* Protected Routes */}
          {/* <Route
            path="/"
            element={
              <ProtectedRoute roles={["admin"]}>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          /> */}

          <Route
            path="/"
            element={
              <ProtectedRoute roles={["admin"]}>
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/members"
            element={
              <ProtectedRoute roles={["admin"]}>
                <DashboardLayout>
                  <Users />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/Report"
            element={
              <ProtectedRoute roles={["admin"]}>
                <DashboardLayout>
                  <Report />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/bills"
            element={
              <ProtectedRoute roles={["user"]}>
                <DashboardLayout>
                  <Bills />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute roles={["user"]}>
                <DashboardLayout>
                  <Notification />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/unauthorized"
            element={
              <ProtectedRoute roles={["user"]}>
                <DashboardLayout>
                  <Notification />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

        </Routes>

    </Router>
  );
}

export default App;
