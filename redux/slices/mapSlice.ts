import AsyncStorage from "@react-native-async-storage/async-storage";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";


const initialState = {
    reports: [],
    incidents: [],
}

export const getAllReports = createAsyncThunk("map/getAllReports", async () => {

})

export const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        setOnboardingStatus: (state) => {

        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(getAllReports.fulfilled, (state, action) => {

        })
        .addCase(getAllReports.rejected, (state, action) => {

        })
    },
});

export const {setOnboardingStatus} = mapSlice.actions;

//selectors
export const selectReports = (state: any) => state.map.reports;
export const selectIncidents = (state: any) => state.map.incidents;

export default mapSlice.reducer;