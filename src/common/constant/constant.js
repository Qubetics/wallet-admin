import eth from "../../Images/eth.png";
import bnb from "../../Images/bnb.png";
import ada from "../../Images/ada.png";
import matic from "../../Images/matic.png";
import tron from "../../Images/Tron.png";
import tics from "../../Images/qubetics.png";
import avax from "../../Images/avax.png";
import sol from "../../Images/solana.png";
import cro from "../../Images/cronos.png";
import btc from "../../Images/btc.png";
import pls from "../../Images/pls.png";
import { logout } from "../../Redux/slice/userSlice";

const CONFIG = {
  API_URL: process.env.REACT_APP_API_URL,
  IMAGE_URL: process.env.REACT_APP_PUBLIC_BASE_URL,
  IP_TRACK_URL: process.env.REACT_APP_IP_TRACK_URL,
};

const handleUnauthorizedError = (response, dispatch, navigate, setToast) => {
  if (response?.error?.status === 401 || 
      (response?.error?.data?.code === 401) || 
      (response?.data?.code === 401)) {
        dispatch(logout({ navigate: navigate }));
        dispatch(setToast({ message: "Logout successfully", status: true }));
        clearStorage();
        setTimeout(() => {
          dispatch(setToast({ message: "Logout successfully", status: false }));
        }, 5000);
  }
  return false;
};

const revenue_blockchain_options = [
  { key: "key1", label: "Select any chain", value: 0 },
  {
    key: "key2",
    label: (
      <>
        {" "}
        <span>
          <img src={eth} style={{ width: "20px" }} alt=""></img> ETH
        </span>
      </>
    ),
    value: 1,
  },
  {
    key: "key3",
    label: (
      <>
        {" "}
        <span>
          <img src={bnb} style={{ width: "20px" }} alt=""></img> BNB
        </span>
      </>
    ),
    value: 3,
  },
  {
    key: "key9",
    label: (
      <>
        {" "}
        <span>
          <img src={pls} style={{ width: "20px" }} alt=""></img> PLS
        </span>
      </>
    ),
    value: 9,
  },
];

const select_blockchain_options = [
  { key: "key1", label: "Select any chain", value: 0 },
  {
    key: "key2",
    label: (
      <>
        {" "}
        <span>
          <img src={eth} style={{ width: "20px" }} alt=""></img> ETH
        </span>
      </>
    ),
    value: 1,
  },
  {
    key: "key3",
    label: (
      <>
        {" "}
        <span>
          <img src={bnb} style={{ width: "20px" }} alt=""></img> BNB
        </span>
      </>
    ),
    value: 3,
  },
  {
    key: "key4",
    label: (
      <>
        {" "}
        <span>
          <img src={sol} style={{ width: "20px" }} alt=""></img> SOL
        </span>
      </>
    ),
    value: 4,
  },
  {
    key: "key5",
    label: (
      <>
        {" "}
        <span>
          <img src={ada} style={{ width: "20px" }} alt=""></img> ADA
        </span>
      </>
    ),
    value: 5,
  },
  {
    key: "key6",
    label: (
      <>
        {" "}
        <span>
          <img src={matic} style={{ width: "20px" }} alt=""></img> MATIC
        </span>
      </>
    ),
    value: 6,
  },
  {
    key: "key7",
    label: (
      <>
        {" "}
        <span>
          <img src={avax} style={{ width: "20px" }} alt=""></img> AVAX
        </span>
      </>
    ),
    value: 7,
  },
  {
    key: "key8",
    label: (
      <>
        {" "}
        <span>
          <img src={cro} style={{ width: "20px" }} alt=""></img> CRO
        </span>
      </>
    ),
    value: 8,
  },
  {
    key: "key9",
    label: (
      <>
        {" "}
        <span>
          <img src={pls} style={{ width: "20px" }} alt=""></img> PLS
        </span>
      </>
    ),
    value: 9,
  },
];

const select_blockchain = [
  { key: "key0", label: "Select any chain", value: 0 },
  {
    key: "key1",
    label: (
      <>
        {" "}
        <span>
          <img src={eth} style={{ width: "20px" }} alt=""></img> ETH
        </span>
      </>
    ),
    value: 2,
  },
  {
    key: "key2",
    label: (
      <>
        {" "}
        <span>
          <img src={btc} style={{ width: "20px" }} alt=""></img> BTC
        </span>
      </>
    ),
    value: 3,
  },
  {
    key: "key3",
    label: (
      <>
        {" "}
        <span>
          <img src={bnb} style={{ width: "20px" }} alt=""></img> BNB
        </span>
      </>
    ),
    value: 1,
  },
  {
    key: "key4",
    label: (
      <>
        {" "}
        <span>
          <img src={sol} style={{ width: "20px" }} alt=""></img> SOL
        </span>
      </>
    ),
    value: 5,
  },
  {
    key: "key6",
    label: (
      <>
        {" "}
        <span>
          <img src={matic} style={{ width: "20px" }} alt=""></img> MATIC
        </span>
      </>
    ),
    value: 4,
  },
   {
    key: "key7",
    label: (
      <>
        {" "}
        <span>
          <img src={tron} style={{ width: "20px" }} alt=""></img> TRON
        </span>
      </>
    ),
    value: 6,
  },
  {
    key: "key8",
    label: (
      <>
        {" "}
        <span>
          <img src={tics} style={{ width: "20px" }} alt=""></img> TICS
        </span>
      </>
    ),
    value: 7,
  },

];

const COIN_FAMILY_TOKEN_TYPE = [
  { coin_family: 2, token_type: "ERC20" }, // Ethereum
  { coin_family: 3, token_type: "BTC" }, // Bitcoin
  { coin_family: 1, token_type: "BEP20" }, // Binance Smart Chain
  { coin_family: 5, token_type: "SPL" }, // Solana
  { coin_family: 4, token_type: "ERC20" }, // Polygon
  { coin_family: 6, token_type: "TRC_20" }, // Avalanche
  { coin_family: 7, token_type: "TICS" }, // Cronos
  { coin_family: 8, token_type: "ERC20" }, // Pulse Chain
  // Add more as needed for TRON, TICS, etc.
];

const clearStorage = () => {
  const email = localStorage.getItem("email");
  const password = localStorage.getItem("password");
  const isRemember = localStorage.getItem("isRemeber");
  localStorage.clear();

  if (isRemember === "true") {
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
    localStorage.setItem("isRemeber", isRemember);
  }
};

const renderCointag = (coin_family) => {
  switch (coin_family) {
    case 1:
      return "Ethereum";
    case 2:
      return "";
    case 3:
      return "Binance Smart Chain";
    case 4:
      return "Solana";
    case 5:
      return "Cardano";
    case 6:
      return "Polygon";
    case 7:
      return "Avalanche";
    case 9:
      return "Pulse Chain";
    default:
      return "Cronos";
  }
};

export {
  CONFIG,
  renderCointag,
  select_blockchain_options,
  select_blockchain,
  clearStorage,
  revenue_blockchain_options,
  COIN_FAMILY_TOKEN_TYPE,
  handleUnauthorizedError
};

