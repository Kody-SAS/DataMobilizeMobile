import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import { IncidentReport, QuickReport, ReportType, SafetyPerceptionReport } from "../../type.d";
import { router } from "expo-router";
import i18n from "../../languages";
import ToastMessage from "../../utils/Toast";


const initialState = {
    notifications: [],
    reports: [] as { userId: string; data: SafetyPerceptionReport | QuickReport | IncidentReport }[],
    errorMessage: ""
}

/**
 * We use AsyncThunk to run async functions with the global state manager, redux
 */
//google signin function
export const getUser = createAsyncThunk('home/user', async () => {

})

export const createReportAsync = createAsyncThunk('home/createReportAsync', async ({userId, data}: { userId: string; data: SafetyPerceptionReport | QuickReport | IncidentReport }, thunkAPI) => {
    try {
        const response: Response = await fetch(process.env.EXPO_PUBLIC_API_URL + `/reports`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId, data})
        });
        
        if(response.ok) {
            const json = await response.json();
            console.log(json);
            router.replace("/(tabs)/");
            return json;
        }
        else {
            console.log("Failed to send report");
            return thunkAPI.rejectWithValue(await response.text());
        }
    }
    catch(ex) {
        console.error(ex);
        return thunkAPI.rejectWithValue(ex);
    }
});

export const getAllReports = createAsyncThunk('home/getAllReports', async (_, thunkAPI) => {
    try {
        const response: Response = await fetch(process.env.EXPO_PUBLIC_API_URL + `/reports`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
        
        if(response.ok) {
            const json = await response.json();
            console.log("All reports", json);
            return json;
        }
        else {
            console.log("Failed to send report");
            return thunkAPI.rejectWithValue(await response.text());
        }
    }
    catch(ex) {
        console.error(ex);
        return thunkAPI.rejectWithValue(ex);
    }
})

export const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        clearReports: (state, action) => {
            const length = state.reports.length;
            for(let i = 0; i < length; i++) {
                state.reports.pop();
            }
        },
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload as never)
        },
        deleteNotification: (state, action) => {
            const newNotifications = state.notifications.filter(element => state.notifications.indexOf(element) !== action.payload)
            state.notifications = newNotifications
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(createReportAsync.fulfilled, (state, action) => {
            state.reports.push({... action.payload as any});
            state.errorMessage = "";
            router.push("/(tabs)/");
        })
        .addCase(createReportAsync.rejected, (state, action) => {
            const t = i18n.t;

            state.errorMessage = t("reportError");

            ToastMessage(
                "error",
                t("error"),
                t("failedToCreateReport")
            )
        })
        .addCase(getAllReports.fulfilled, (state, action) => {
            console.log("load", action.payload.reports)
            state.reports = [...action.payload.reports as any];

        })
        .addCase(getAllReports.rejected, (state, action) => {

        })
    }
});

export const {clearReports, addNotification, deleteNotification} = homeSlice.actions;

//selectors
export const selectNotifications = (state: any) => state.home.notifications
export const selectReports = (state: any) => state.home.reports;
export const selectErrorMessage = (state: any) => state.home.errorMessage;

export default homeSlice.reducer;