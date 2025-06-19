import { useLocation, Navigate, Outlet } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react";


const RequireAuth = () => {


    const token = useSelector((state) => state?.userState?.user?.token);


    const location = useLocation()

    return (
        token
            ? <Outlet />
            : <Navigate to="/login" state={{ from: location }} replace />
    )
}
export default RequireAuth