import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Workshops from "./pages/Workshops";
import WorkshopDetails from "./pages/WorkshopDetails";
import MyRegistrations from "./pages/MyRegistrations";
import AdminWorkshops from "./pages/AdminWorkshops";
import AdminCategories from "./pages/AdminCategories";
import WorkshopRegistrations from "./pages/WorkshopRegistrations";

import ProtectedRoute from "./components/ProtectedRoute";
import {
  getRole,
  isLoggedIn,
  logout,
} from "./utils/auth";

function Navigation() {
  const navigate = useNavigate();
  const [, setVersion] = useState(0);

  useEffect(() => {
    const refresh = () =>
      setVersion((value) => value + 1);

    window.addEventListener(
      "auth-changed",
      refresh
    );

    return () =>
      window.removeEventListener(
        "auth-changed",
        refresh
      );
  }, []);

  const role = getRole();
  const loggedIn = isLoggedIn();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="main-nav">
      <Link to="/" className="brand">
        <span className="brand-mark">W</span>

        <div>
          <strong>Workshop</strong>
          <small>מרכז הסדנאות שלך</small>
        </div>
      </Link>

      <div className="nav-links">
        <Link to="/">בית</Link>
        <Link to="/workshops">סדנאות</Link>

        {role === "User" && (
          <Link to="/my-registrations">
            ההרשמות שלי
          </Link>
        )}

        {role === "Admin" && (
          <>
            <Link to="/admin/workshops">
              ניהול סדנאות
            </Link>

            <Link to="/admin/categories">
              קטגוריות
            </Link>

            <Link to="/admin/registrations">
              נרשמים
            </Link>
          </>
        )}
      </div>

      <div className="nav-actions">
        {!loggedIn && (
          <>
            <Link
              to="/login"
              className="nav-login"
            >
              התחברות
            </Link>

            <Link
              to="/register"
              className="nav-register"
            >
              הרשמה
            </Link>
          </>
        )}

        {loggedIn && (
          <button
            className="nav-logout"
            onClick={handleLogout}
          >
            התנתקות
          </button>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navigation />

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/workshops"
          element={<Workshops />}
        />

        <Route
          path="/workshops/:id"
          element={<WorkshopDetails />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/my-registrations"
          element={
            <ProtectedRoute role="User">
              <MyRegistrations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/workshops"
          element={
            <ProtectedRoute role="Admin">
              <AdminWorkshops />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute role="Admin">
              <AdminCategories />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/registrations"
          element={
            <ProtectedRoute role="Admin">
              <WorkshopRegistrations />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
