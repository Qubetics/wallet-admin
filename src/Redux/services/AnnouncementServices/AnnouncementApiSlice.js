import { apiSlice } from "../../slice/apiSlice";

export const AnnouncementApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAnnouncementNotification: builder.mutation({
      query: (params) => ({
        url: "notification/list",
        method: "POST",
        body: { ...params },
      }),
    }),
    saveAnnouncement: builder.mutation({
      query: (params) => ({
        url: "notification/create",
        method: "POST",
        body: { ...params },
      }),
    }),
    deleteAnnouncement: builder.mutation({
      query: (params) => ({
        url: `notification/delete/${params.id}`,
        method: "DELETE"
      }),
    }),
  }),
});

export const {
  useGetAnnouncementNotificationMutation,
  useSaveAnnouncementMutation,
  useDeleteAnnouncementMutation,
} = AnnouncementApiSlice;
