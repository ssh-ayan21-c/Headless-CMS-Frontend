import "./App.css";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import { useAuthContext } from "./contexts/auth";

import BlogRead from "./pages/BlogRead/BlogRead";
import Playground from "./pages/Playground/Playground";
import Editor from "./pages/Editor/Editor";
import Blogs from "./pages/Blogs/Blogs";

import { DropAreaProvider } from "./contexts/file";
import Home from "./pages/Home/Home";
import Signup from "./pages/UserPages/Signup";
import Login from "./pages/UserPages/Login";
import Author from "./pages/Author/Author";
import { UserProvider } from "./contexts/user";
import Navbar from "./components/Navbar/Navbar";

const App = () => {
  const { user } = useAuthContext();
  const location = useLocation();

  const noNavbarRoutes = [
    "/playground",
    "/playground/categories",
    "/playground/all-blogs",
    "/playground/dashboard",
    "/playground/featured-blogs",
    "/playground/change-password",
    "/playground/get-api-key",
    "/editor",
    "/playground/edit-profile",
    "/editor/:blog",
  ];

  // Check if the current path matches any of the noNavbar routes
  const hideNavbar = noNavbarRoutes.some((path) =>
    new RegExp(`^${path.replace(/:\w+/g, "\\w+")}$`).test(location.pathname)
  );

  return (
    <>
      <UserProvider>{!hideNavbar && <Navbar />}</UserProvider>
      <Routes>
        <Route
          index
          path="/"
          element={!user ? <Home /> : <Navigate to="/blogs" />}
        />

        <Route index path="/blogs" element={<Blogs />} />

        <Route
          path="/playground/*"
          element={user ? <Playground /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/editor"
          element={
            user ? (
              <DropAreaProvider>
                <Editor />
              </DropAreaProvider>
            ) : (
              <Navigate to={"/login"} />
            )
          }
        />
        <Route
          path="/editor/:blog"
          element={
            user ? (
              <DropAreaProvider>
                <Editor />
              </DropAreaProvider>
            ) : (
              <Navigate to={"/login"} />
            )
          }
        />
        <Route
          path="signup"
          element={!user ? <Signup /> : <Navigate to={"/blogs"} />}
        />
        <Route
          path="login"
          element={!user ? <Login /> : <Navigate to={"/blogs"} />}
        />
        <Route
          path="author/:id"
          element={
            <UserProvider>
              <Author />
            </UserProvider>
          }
        />
        <Route
          path="read-this-blog/:id"
          element={
            <UserProvider>
              <BlogRead />
            </UserProvider>
          }
        />
        <Route path="*" element={<h1>Error 404, please enter valid URL!</h1>} />
      </Routes>
    </>
  );
};

export default App;
