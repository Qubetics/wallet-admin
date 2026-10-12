import { useLocation, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from 'react';

const NotRequireAuth = () => {
  const token = useSelector((state) => state?.userState?.user?.token);
  const permissions_data = useSelector(
    (state) => state?.userState?.user?.permissions_data
  );
  const location = useLocation();

  const [jwtExpiration, setJwtExpiration] = useState("");
  const navigate = useNavigate();
  let dispatch = useDispatch();

  return !token ? (
    <Outlet />
  ) : (
    <Navigate
      to={
        permissions_data?.length > 0
          ? `/${permissions_data[0]?.menu_list_data?.slug}`
          : "/dashboard"
      }
      state={{ from: location }}
      replace
    />
  );
};
export default NotRequireAuth;
