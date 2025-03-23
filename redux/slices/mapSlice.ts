import AsyncStorage from "@react-native-async-storage/async-storage";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";


const initialState = {
    safetyPerceptionReports: [],
    incidentReports: [],
    quickReports: [],
    auditReports: [],
}

export const getAllReports = createAsyncThunk("map/getAllReports", async () => {

})

export const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        addSafetyPerceptionReport: (state, action) => {
            state.safetyPerceptionReports.push(action.payload as never)
        },
        addIncidentReport: (state, action) => {
            state.incidentReports.push(action.payload as never)
        },
        addQuickReport: (state, action) => {
            state.quickReports.push(action.payload as never)
        },
        addAuditReport: (state, action) => {
            state.auditReports.push(action.payload as never
        )
    },
    extraReducers: (builder) => {
        builder
        .addCase(getAllReports.fulfilled, (state, action) => {

        })
        .addCase(getAllReports.rejected, (state, action) => {

        })
    },
});

export const {
    addSafetyPerceptionReport,
    addIncidentReport,
    addQuickReport,
    addAuditReport
} = mapSlice.actions;

//selectors
export const selectSafetyReports = (state: any) => state.map.safetyPerceptionReports;
export const selectIncidentReports = (state: any) => state.map.incidentReports;
export const selectQuickReports = (state: any) => state.map.quickReports;
export const selectAuditReports = (state: any) => state.map.auditReports;

export default mapSlice.reducer;