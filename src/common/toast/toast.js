import React, { useEffect, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { clearToast } from "../../Redux/slice/toastSlice";

const Toastify = () => {
  const dispatch = useDispatch();
  const toast_state = useSelector((state) => state.toastState.toast);
  const timestamp = useSelector((state) => state.toastState.timestamp);
  const lastToastRef = useRef({ message: null, timestamp: null });
  const toastIdRef = useRef(null);

  useEffect(() => {
    if (
      toast_state?.message &&
      (lastToastRef.current.message !== toast_state.message ||
       lastToastRef.current.timestamp !== timestamp)
    ) {
      // Dismiss any existing toast first
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }

      const toastConfig = {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        onClose: () => {
          toastIdRef.current = null;
          // Clear the toast state when toast closes
          dispatch(clearToast());
        }
      };

      // Update our ref to track this toast
      lastToastRef.current = {
        message: toast_state.message,
        timestamp: timestamp
      };

      // Show new toast and store its ID
      if (toast_state.status) {
        toastIdRef.current = toast.success(toast_state.message, toastConfig);
      } else {
        toastIdRef.current = toast.error(toast_state.message, toastConfig);
      }
    }
  }, [toast_state, timestamp, dispatch]);

  return (
    <ToastContainer 
      position="top-right"
      autoClose={3000}
      limit={1}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover
      theme="light"
    />
  );
};

export default Toastify;
