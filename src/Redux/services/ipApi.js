import { CONFIG } from "../../common/constant/constant";
import { setIpAddress } from "../../Redux/slice/userSlice";
export const getIp = () => (dispatch) => {
  return new Promise(async (resolve, reject) => {
    try {
      // alert('tedtddd');
       await fetch(CONFIG.IP_TRACK_URL)
        .then((res) => res.json())
        .then((json) => {
          dispatch(setIpAddress(json));
        });
    } catch (error) {
      console.log("Ip error >>>>", error);
    }
  });
};
