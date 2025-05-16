import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { Toaster } from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import NotificationsPage from "./pages/NotificationsPage";
import NetworkPage from "./pages/NetworkPage";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const { data: authUser, isLoading } = useAuth();
  
  if (isLoading) return null;
  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" /> : <SignUpPage />}
        />
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route
          path="/notifications"
          element={authUser ? <NotificationsPage/> :  <Navigate to="/login" />}
        />
        <Route
          path="/network"
          element={authUser ? <NetworkPage/> :  <Navigate to="/login" />}
        />
        <Route
          path="/posts/:postId"
          element={authUser ? <PostPage/> :  <Navigate to="/login" />}
        />
        <Route
          path="/profile/:username"
          element={authUser ? <ProfilePage/> :  <Navigate to="/login" />}
        />
      </Routes>
      <Toaster />
    </Layout>
  );
}

export default App;
