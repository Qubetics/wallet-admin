import React, { useEffect, useMemo } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./App.scss";
import MainLayout from "./Layout/MainLayout";
import Login from "./Pages/Login/Login";
import Toastify from "./common/toast/toast";
import IndexChain from "./Pages/ChainSwap/IndexChain";
import Dashboard from "./Pages/Dashboard/Dashboard";
import TransactionDetails from "./Pages/TransactionDetails/TransactionDetails";
import Revenue from "./Pages/Revenue/revenue";
import Setting from "./Pages/Setting/Setting";
import TokenManagement from "./Pages/TokenManagement/TokenManagement";
import DefaultTokenManagement from "./Pages/DefaultTokenManagment/DefaultTokenManagement";
import Announcement from "./Pages/Announcement";
import SubAdmin from "./Pages/SubAdmin";

import NotRequireAuth from "./Layout/NotRequireAuth";
import RequireAuth from "./Layout/RequredAuth";
import { useIdleTimer } from "react-idle-timer";
import { logout } from "./Redux/slice/userSlice";
import Spritz from "./Pages/Spritz/Spritz";
import Blockchainswap from "./Pages/blockchainSwap/blockchainswap";
import Swft from "./Pages/blockchainSwap/Swft/Swft";
import History from "./Pages/Revenue/history";
import ApplicationMaintenance from "./Pages/ApplicationMaintenance";
import NotFound from "./Pages/NoPage/NoPage";
import IndexSolana from "./Pages/TokenManagement/solana/indexSolana";
import BannerManagement from "./Pages/BannerManagment/index";

function App() {
  const dispatch = useDispatch();
  const toast = useSelector((state) => state.toastState.toast);
  const isRemeber = localStorage.getItem("isRemeber");
  const toastify = useMemo(() => <Toastify toast={toast} />, [toast]);

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
    // this.setState({isTimedOut: false})
  };

  const _onIdle = () => {
    dispatch(logout({ navigate: navigate }));
  };
  const {
    start,
    reset,
    activate,
    pause,
    resume,
    isIdle,
    getTabId,
    isPrompted,
    isLeader,
    isLastActiveTab,
    getRemainingTime,
    getElapsedTime,
    getLastIdleTime,
    getLastActiveTime,
    getIdleTime,
    getTotalIdleTime,
    getActiveTime,
    getTotalActiveTime,
  } = useIdleTimer({
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
            <Route index path="/solana-dashboard" element={<IndexSolana />} />

            <Route index path="/chain-swap" element={<IndexChain />} />
            <Route index path="/swapHistory" element={<History />} />

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
            <Route index path="/swap" element={<Revenue />} />
            <Route index path="/revenue" element={<Revenue />} />
            <Route
              index
              path="/default-token-management"
              element={<DefaultTokenManagement />}
            />
            <Route index path="/push-notification" element={<Announcement />} />
            <Route index path="/banner-management" element={<BannerManagement />} />
            <Route index path="/sub-admin-management" element={<SubAdmin />} />
            <Route index path="/spritz" element={<Spritz />} />
            <Route index path="/" element={<Dashboard />} />
            <Route index path="/swftc" element={<Swft />} />

            <Route index path="/blockchainswap" element={<Blockchainswap />} />
            <Route
              index
              path="/app_maintenance"
              element={<ApplicationMaintenance />}
            />

            <Route
              index
              path="/app-maintenance"
              element={<ApplicationMaintenance />}
            />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      {toast?.message && toastify}
    </React.Fragment>
  );
}

export default App;
