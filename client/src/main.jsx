import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

import HomePage from "./pages/HomePage.jsx";
import PostDetailPage from "./pages/PostDetailPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import PostEditorPage from "./pages/PostEditorPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import BookmarksPage from "./pages/BookmarksPage.jsx";
import PrivateRoute from "./components/shared/PrivateRoute.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
