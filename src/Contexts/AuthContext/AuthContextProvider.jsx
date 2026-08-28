import React, { useState } from "react";
import useGet from "../../CustomHooks/useGetPosts";
import Loading from "../../Pages/Loading/Loading";
import { Navigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import AuthContext from "./authContext";
const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return null;
    try {
      const decoded = jwtDecode(storedToken);
      const isExpired = decoded.exp * 1000 < Date.now();
      if (isExpired) {
        localStorage.removeItem("token");
        return null;
      }
      return storedToken;
    } catch {
      localStorage.removeItem("token");
      return null;
    }
  });
  const queryClient = useQueryClient();

  const { data, isLoading } = useGet(
    ["profileData", token],
    "users/profile-data",
    !!token,
    { retry: false },
  );
  const profileData = data?.data.data.user;
  console.log("profile data " , profileData);
  
  const showLoading = !!token && isLoading;
  const { data: unred } = useGet(
    ["unred"],
    `notifications/unread-count`,
    !!token,
  );
  const unreadCount = unred?.data.data.unreadCount;

  function setUserToken(tkn) {
    setToken(tkn);
    localStorage.setItem("token", tkn);
  }

  function logout() {
    setToken(null);
    localStorage.removeItem("token");
    queryClient.clear();
  }

  return (
    <>
      {showLoading ? (
        <Loading />
      ) : (
        <AuthContext.Provider
          value={{
            setUserToken,
            token,
            logout,
            profileData,
            unreadCount,
          }}
        >
          {children}
        </AuthContext.Provider>
      )}
    </>
  );
};

export default AuthContextProvider;
