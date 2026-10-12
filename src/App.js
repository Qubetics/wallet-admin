import React, { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import "./App.scss";
import MainLayout from "./Layout/MainLayout";
import Login from "./Pages/Login/Login";
import Toastify from "./common/toast/toast";
import Dashboard from "./Pages/Dashboard/Dashboard";
import TransactionDetails from "./Pages/TransactionDetails/TransactionDetails";
import Setting from "./Pages/Setting/Setting";
import TokenManagement from "./Pages/TokenManagement/TokenManagement";
import Announcement from "./Pages/Announcement";

import NotRequireAuth from "./Layout/NotRequireAuth";
import RequireAuth from "./Layout/RequredAuth";
import { useIdleTimer } from "react-idle-timer";
import { logout } from "./Redux/slice/userSlice";
import NotFound from "./Pages/NoPage/NoPage";
import BannerManagement from "./Pages/BannerManagment/index";

function App() {
  const dispatch = useDispatch();
  const isRemeber = localStorage.getItem("isRemeber");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (sessionStorage.getItem("isActive") == null && isRemeber === "false") {
      dispatch(logout({ navigate: navigate }));
    }

    if (location?.pathname == "/revenue") {
      navigate("/swap");
    }
  }, []);

  const _onActive = (e) => {
  };

  const _onIdle = () => {
    dispatch(logout({ navigate: navigate }));
  };
  useIdleTimer({
    // onPresenceChange,
    // onPrompt,
    _onIdle,
    _onActive,
    // onAction,
    timeout: 1000 * 60 * 15, // 1000  60  1=1 mniute
    promptBeforeIdle: 0,
    events: [
      "mousemove",
      "keydown",
      "wheel",
      "DOMMouseScroll",
      "mousewheel",
      "mousedown",
      "touchstart",
      "touchmove",
      "MSPointerDown",
      "MSPointerMove",
      "visibilitychange",
      "focus",
    ],
    immediateEvents: [],
    debounce: 0,
    throttle: 0,
    eventsThrottle: 200,
    element: document,
    startOnMount: true,
    startManually: false,
    stopOnIdle: false,
    crossTab: true,
    name: "idle-timer",
    syncTimers: 0,
    leaderElection: false,
  });

  return (
    <React.Fragment>
      <Routes>
        <Route element={<NotRequireAuth />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<RequireAuth />}>
          <Route path="/" element={<MainLayout />}>
            <Route index path="/dashboard" element={<Dashboard />} />

            <Route
              index
              path="/transaction-details"
              element={<TransactionDetails />}
            />
            <Route
              index
              path="/token-management"
              element={<TokenManagement />}
            />
            <Route index path="/settings" element={<Setting />} />
            <Route index path="/push-notification" element={<Announcement />} />
            <Route index path="/banner-management" element={<BannerManagement />} />
            <Route index path="/" element={<Dashboard />} />           
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toastify />
    </React.Fragment>
  );
}

export default App;
