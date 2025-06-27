import AsyncStorage from "@react-native-async-storage/async-storage";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";


const initialState = {
    isOnboarded: false
}

export const checkOnboardingStatus = createAsyncThunk("onboarding/checkOnboardingStatus", async () => {
    const res = await AsyncStorage.getItem("onboardingStatus")

    return res != null ? JSON.parse(res) : false
})

export const onboardingSlice = createSlice({
    name: 'onboarding',
    initialState,
    reducers: {
        setOnboardingStatus: (state, action) => {
            //state.isOnboarded = false;
            state.isOnboarded = action.payload;
            //state.isOnboarded = !state.isOnboarded //for dev purpose
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(checkOnboardingStatus.fulfilled, (state, action) => {
            state.isOnboarded = action.payload;
        })
    },
});

export const {setOnboardingStatus} = onboardingSlice.actions;

//selectors
export const selectIsOnboarded = (state: any) => state.onboarding.isOnboarded

export default onboardingSlice.reducer;