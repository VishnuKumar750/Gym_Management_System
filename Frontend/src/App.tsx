import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import Users from "./components/Users";
import Bills from "./components/Bills";
import Notification from "./components/Notification";
import AuthForm from "./components/AuthForm";

import DashboardLayout from "./components/layout/DashboardLayout";
import AuthLayout from "./components/layout/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./components/context/AuthProvider";

function App() {
  return (
    <Router>
      <AuthProvider>
        
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
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Users />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/bills"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Bills />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Notification />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

        </Routes>

      </AuthProvider>
    </Router>
  );
}

export default App;
