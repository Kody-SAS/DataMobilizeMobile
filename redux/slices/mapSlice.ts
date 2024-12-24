import AsyncStorage from "@react-native-async-storage/async-storage";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";


const initialState = {
    
}

export const checkOnboardingStatus = createAsyncThunk("map/checkOnboardingStatus", async () => {

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
        .addCase(checkOnboardingStatus.fulfilled, (state, action) => {

        })
    },
});

export const {setOnboardingStatus} = mapSlice.actions;

//selectors
export const selectIsOnboarded = (state: any) => state.map.isOnboarded

export default mapSlice.reducer;