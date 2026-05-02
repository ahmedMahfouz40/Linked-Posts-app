import React, { useState } from "react";
import useGet from "../CustomHooks/useGetPosts";
import Loading from "../Pages/Loading/Loading";
import AuthContext from "./authContext";
import { Navigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null,
  );
  const queryClient = useQueryClient();

  const { data, isLoading } = useGet(
    ["profileData", token],
    "users/profile-data",
    !!token,
    { retry: false },
  );
  const profileData = data?.data.data.user;
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
