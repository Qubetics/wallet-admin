import { createSlice } from "@reduxjs/toolkit"

const AnnouncementSlice = createSlice({
    name: 'Announcement',
    initialState: { announcementList: [], announcementListMeta: {} },
    reducers: {
        setAnnouncementList: (state, action) => {
            state.announcementList = action?.payload
        },
        setAnnouncementListMeta: (state, action) => {
            state.announcementListMeta = action?.payload
        }
    },
})

export const { setAnnouncementList, setAnnouncementListMeta } = AnnouncementSlice.actions

export default AnnouncementSlice.reducer