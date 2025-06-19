import { apiSlice } from "../../slice/apiSlice";

export const BannerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBannerList: builder.mutation({
      query: (params) => ({
        url: "banner/getBannerList",
        method: "POST",
        body: { ...params },
      }),
    }),
    saveBanner: builder.mutation({
      query: (formData) => ({
        url: "banner/createBanner",
        method: "POST",
        body: formData,
        formData: true
      }),
    }),
    deleteBanner: builder.mutation({
      query: (params) => ({
        url: `banner/deleteBanner/${params.id}`,
        method: "DELETE"
      }),
    }),
  }),
});

export const {
  useGetBannerListMutation,
  useSaveBannerMutation,
  useDeleteBannerMutation,
} = BannerApiSlice;
