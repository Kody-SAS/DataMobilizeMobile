import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";


const initialState = {
    notifications: []
}

/**
 * We use AsyncThunk to run async functions with the global state manager, redux
 */
//google signin function
export const getUser = createAsyncThunk('home/user', async () => {

})


export const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload as never)
        },
        deleteNotification: (state, action) => {
            const newNotifications = state.notifications.filter(element => state.notifications.indexOf(element) !== action.payload)
            state.notifications = newNotifications
        },
    }
});

export const {addNotification, deleteNotification} = homeSlice.actions;

//selectors
export const selectNotifications = (state: any) => state.home.notifications

export default homeSlice.reducer;