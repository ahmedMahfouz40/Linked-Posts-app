import { lazy, Suspense, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import AuthContextProvider from "./Contexts/AuthContext/AuthContextProvider";

//  Lazy-load every page-level component
const MainLayout = lazy(() => import("./Layouts/MainLayout/MainLayout"));
const HomeLayout = lazy(() => import("./Layouts/HomeLayout/HomeLayout"));
const FeedLayout = lazy(() => import("./Layouts/FeedLayout/FeedLayout"));

const MyFeed = lazy(() => import("./Components/MyFeed/MyFeed"));
const MyPosts = lazy(() => import("./Components/MyPosts/MyPosts"));
const Post = lazy(() => import("./Components/Posts/Post"));
const Saved = lazy(() => import("./Components/Saved/Saved"));
const Notifications = lazy(() => import("./Pages/Notifications/Notifications"));
const PostDetails = lazy(() => import("./Pages/PostDetails/PostDetails"));
const Login = lazy(() => import("./Pages/Login/Login"));
const Register = lazy(() => import("./Pages/Register/Register"));
const Profile = lazy(() => import("./Pages/Profile/Profile"));
const UserProfile = lazy(() => import("./Pages/Profile/UserProfile"));
const Settings = lazy(() => import("./Pages/Settings/Settings"));

const PageLoader = () => (
  <div style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
    <span>
      <FontAwesomeIcon
        icon={faSpinner}
        className="animate-spin text-blue-400"
      />
    </span>
  </div>
);
const client = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <HomeLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/feed/community" replace /> },
      {
        path: "feed",
        element: <FeedLayout />,
        children: [
          { index: true, element: <Navigate to="community" replace /> },
          { path: "myFeed", element: <MyFeed /> },
          { path: "myPosts", element: <MyPosts /> },
          { path: "community", element: <Post /> },
          { path: "saved", element: <Saved /> },
        ],
      },
      { path: "profile", element: <Profile /> },
      { path: "profile/:id", element: <UserProfile /> },
      { path: "notifications", element: <Notifications /> },
      { path: "postDetails/:id", element: <PostDetails /> },
      { path: "settings", element: <Settings /> },
    ],
  },
  {
    path: "/auth",
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="login" replace /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
export default function App() {
  useEffect(() => {
    const theme = localStorage.getItem("theme");

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <QueryClientProvider client={client}>
      <AuthContextProvider>
        <Suspense fallback={<PageLoader />}>
          <RouterProvider router={router} />
        </Suspense>
        <ToastContainer />
      </AuthContextProvider>
    </QueryClientProvider>
  );
}
