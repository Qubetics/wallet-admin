import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const NotRequireAuth = () => {
  const token = useSelector((state) => state?.userState?.user?.token);
  const permissions_data = useSelector(
    (state) => state?.userState?.user?.permissions_data
  );
  const location = useLocation();

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
