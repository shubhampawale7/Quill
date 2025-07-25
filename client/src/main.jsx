import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

// Import components used directly in the router config
import ErrorPage from "./pages/ErrorPage.jsx";
import PrivateRoute from "./components/shared/PrivateRoute.jsx";

// --- Lazy-loaded Page Components ---
const HomePage = React.lazy(() => import("./pages/HomePage.jsx"));
const PostDetailPage = React.lazy(() => import("./pages/PostDetailPage.jsx"));
const AdminDashboardPage = React.lazy(() =>
  import("./pages/AdminDashboardPage.jsx")
);
const RegisterPage = React.lazy(() => import("./pages/RegisterPage.jsx"));
const LoginPage = React.lazy(() => import("./pages/LoginPage.jsx"));
const PostEditorPage = React.lazy(() => import("./pages/PostEditorPage.jsx"));
const SearchPage = React.lazy(() => import("./pages/SearchPage.jsx"));
const CategoryPage = React.lazy(() => import("./pages/CategoryPage.jsx"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage.jsx"));
const SettingsPage = React.lazy(() => import("./pages/SettingsPage.jsx"));
const BookmarksPage = React.lazy(() => import("./pages/BookmarksPage.jsx"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />, // New: Global error boundary
    children: [
      { index: true, element: <HomePage /> },
      { path: "post/slug/:slug", element: <PostDetailPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "search/:keyword", element: <SearchPage /> },
      { path: "category/:categoryId", element: <CategoryPage /> },
      { path: "profile/:userId", element: <ProfilePage /> },
      {
        path: "",
        element: <PrivateRoute />,
        children: [
          { path: "admin", element: <AdminDashboardPage /> },
          { path: "admin/post/new", element: <PostEditorPage /> },
          { path: "admin/post/edit/:id", element: <PostEditorPage /> },
          { path: "settings", element: <SettingsPage /> },
          { path: "bookmarks", element: <BookmarksPage /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
