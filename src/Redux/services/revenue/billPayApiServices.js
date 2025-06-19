import { apiSlice } from "../../slice/apiSlice";
import { setToast } from "../../slice/toastSlice";
import { setUser } from "../../slice/userSlice";

export const BillpayApiService = apiSlice.injectEndpoints({
  tagTypes: ["billPay"],
  endpoints: (builder) => ({
    getBillPayData: builder.mutation({
      query: (params) => ({
        url: "/billpay/list",
        method: "POST",
        body: { ...params },
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          if (error.error.status == 408) {
            // alert("Session timeout , please login again");
            dispatch(
              setToast({
                message: "Session timeout , please login again",
                status: false,
              })
            );
            setTimeout(() => {
              // localStorage.clear();
              clearStorage();
              //   window.location.reload();
              dispatch(setUser(null));
            }, 1000);
          }
        }
      },
    }),
  }),
});

export const { useGetBillPayMutation } = BillpayApiService;
