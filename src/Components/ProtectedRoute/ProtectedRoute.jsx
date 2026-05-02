import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../../AuthContext/authContext";

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  if (token) {
    return <div>{children}</div>;
  }
  return <Navigate to={"/auth"} />;
};

export default ProtectedRoute;
