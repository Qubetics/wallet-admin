import { clearStorage } from "../../../common/constant/constant";
import { setRequestList } from "../../slice/TransactionRequestSlice";
import { apiSlice } from "../../slice/apiSlice";
import { setToast } from "../../slice/toastSlice";

export const SettingServicesSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    googleAuthEnableDisable: builder.mutation({
      query: (params) => ({
        url: "auth/googleAuthEnabledisable",
        method: "POST",
        body: params,
      }),
      // async onQueryStarted(args, { dispatch, queryFulfilled }) {
      //     try {
      //       const { data } = await queryFulfilled;
      //     } catch (error) {

      //       if(error.error.status==408){
      //         alert("Session timeout , please login again");
      //         setTimeout(() => {
      //           localStorage.clear();
      //           window.location.reload();
      //         }, 1000);
      //       }

      //     }
      //   },
    }),
    getGoogleAuthSecretKey: builder.query({
      query: () => ({
        url: "auth/googleAuthSecretkey",
        method: "GET",
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("data",data)
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
              window.location.reload();
            }, 1000);
          }
        }
      },
    }),

    changePassword: builder.mutation({
      query: (params) => ({
        url: "auth/changePassword",
        method: "POST",
        body: params,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          if (error?.error?.status == 408) {
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
              window.location.reload();
            }, 1000);
          }
        }
      },
    }),
    verify2fa: builder.mutation({
      query: (params) => ({
        url: "auth/google_2fa_verify",
        method: "POST",
        body: params,
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
              window.location.reload();
            }, 1000);
          }
        }
      },
    }),

    appMaintenance: builder.query({
      query: (params) => ({
        url: "wallet/get_app_maintenance_list",
        method: "GET",
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
              window.location.reload();
            }, 1000);
          }
        }
      },
    }),

    enableDisableMaintanance: builder.mutation({
      query: (payload) => ({
        url: "wallet/update_app_maintenance",
        method: "POST",
        body: payload,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          if (error.error.status == 408) {
            dispatch(
              setToast({
                message: "Session timeout , please login again",
                status: false,
              })
            );
            setTimeout(() => {
              clearStorage();
              window.location.reload();
            }, 1000);
          }
        }
      },
    }),

    // getTransactionsRequest: builder.mutation({

    //     query: params => ({

    //         url: '/request_list',
    //         method: 'POST',
    //         body: params,

    //     }),
    // }),

    // swapAction: builder.mutation({
    //     query: params => ({
    //         url: '/allow_swap',
    //         method: 'POST',
    //         body: params

    //     })
    // }),
  }),
});

export const {
  useGoogleAuthEnableDisableMutation,
  useGetGoogleAuthSecretKeyQuery,
  useChangePasswordMutation,
  useVerify2faMutation,
  useLazyAppMaintenanceQuery,
  useEnableDisableMaintananceMutation,
} = SettingServicesSlice;
