import { useSelector, useDispatch } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { setRedirectPath } from "../features/api/authSlice";

export default function ProtectedRoute({ children, onRequireLogin }) {
  const { userInfo } = useSelector((state) => state.auth);
  // const location = useLocation();
  // const dispatch = useDispatch();

  if (!userInfo) {
    // store where user wanted to go
    // if (!redirectPath) {
    //   dispatch(setRedirectPath(location.pathname + location.search)); // added location.search

    // }
    if (onRequireLogin) onRequireLogin();
    return null; // stops rendering protected page until login
  }

  return children;
}

