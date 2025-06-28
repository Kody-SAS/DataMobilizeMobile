import AsyncStorage from "@react-native-async-storage/async-storage";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";


const initialState = {
    isOnboarded: false
}

export const checkOnboardingStatus = createAsyncThunk("onboarding/checkOnboardingStatus", async () => {
    const res = await AsyncStorage.getItem("onboardingStatus")

    return res != null ? true : false
})

export const onboardingSlice = createSlice({
    name: 'onboarding',
    initialState,
    reducers: {
        setOnboardingStatus: (state, action) => {
            //state.isOnboarded = false;
            state.isOnboarded = action.payload;
            AsyncStorage.setItem("onboardingStatus", JSON.stringify(true)).then(() => console.log("Onboarding status saved"));
            //state.isOnboarded = !state.isOnboarded //for dev purpose
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(checkOnboardingStatus.fulfilled, (state, action) => {
            state.isOnboarded = action.payload as boolean;
        })
    },
});

export const {setOnboardingStatus} = onboardingSlice.actions;

//selectors
export const selectIsOnboarded = (state: any) => state.onboarding.isOnboarded

export default onboardingSlice.reducer;