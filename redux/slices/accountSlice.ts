import AsyncStorage from "@react-native-async-storage/async-storage";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import ToastMessage from "../../utils/Toast";
import i18n from "../../languages";
import { CreateUser, ForgotUser, LoginUser, User, VerifyUser } from "../../type";
import { router } from "expo-router";
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const initialState = {
    createUser: {} as CreateUser,
    user: null as User | null,
    forgotUser: {} as ForgotUser,
    isAccountVerified: false,
    isGuess: false,
}

export const getUser = createAsyncThunk("account/getUser", async (userId: string, thunkAPI) => {
    try {
        const response = await fetch(process.env.EXPO_PUBLIC_API_URL + `/users/${userId}`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if(response.ok) {
            const json = await response.json();
            console.log(json);
            return json;
        }
        else {
            console.log("Failed to get user");
            return thunkAPI.rejectWithValue(await response.text());
        }
    }
    catch (ex) {
        console.error(ex);
        return thunkAPI.rejectWithValue(ex);
    }
})

export const sendValidationCode = createAsyncThunk("account/sendValidationCode", async (user: CreateUser, thunkAPI) => {
    
    try {
        console.log("Sending create user request", JSON.stringify(user), "env: " + process.env.EXPO_PUBLIC_API_URL);
        const response = await fetch(process.env.EXPO_PUBLIC_API_URL + "/users/register", {
            method: "POST", 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })

        if (response.ok) {
            const json = await response.json();
            console.log(json);
            return json;
        }
        else {
            console.log("Failed to send create user request");
            return thunkAPI.rejectWithValue(await response.text());
        }
    }
    catch (ex) {
        console.error(ex);
        return thunkAPI.rejectWithValue(ex);
    }
})

export const validateCode = createAsyncThunk("account/validateCode", async(verifyUser: VerifyUser, thunkAPI) => {
    try {
        const response: Response = await fetch(process.env.EXPO_PUBLIC_API_URL + `/users/verify/${verifyUser.userId}`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({code: verifyUser.code})
        });

        if(response.ok) {
            const json = await response.json();
            console.log(json);
            router.replace("/(tabs)/");
            return json;
        }
        else {
            console.log("Failed to validate user");
            return thunkAPI.rejectWithValue(await response.text());
        }
    }
    catch (ex) {
        console.error(ex);
        return thunkAPI.rejectWithValue(ex);
    }
})

export const loginUser = createAsyncThunk("account/loginUser", async(loginUser: LoginUser, thunkAPI) => {
    try {
        const response = await fetch(process.env.EXPO_PUBLIC_API_URL + "/users/login", {
            method: "POST", 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginUser)
        })

        if (response.ok) {
            const json = await response.json();
            console.log(json);
            return json;
        }
        else {
            console.log("Failed to login user");
            return thunkAPI.rejectWithValue(await response.text());
        }
    }
    catch (ex) {
        console.error(ex);
        return thunkAPI.rejectWithValue(ex);
    }
})

export const updateUser = createAsyncThunk("account/updateUser", async(user: User, thunkAPI) => {
    try {
        const response: Response = await fetch(process.env.EXPO_PUBLIC_API_URL + `/users/${user.id}`, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        
        if(response.ok) {
            const json = await response.json();
            console.log(json);
            return json;
        }
        else {
            console.log("Failed to send update user");
            return thunkAPI.rejectWithValue(await response.text());
        }
    }
    catch(ex) {
        console.error(ex);
        return thunkAPI.rejectWithValue(ex);
    }
})

export const deleteUser = createAsyncThunk("account/deleteUser", async(user: User, thunkAPI) => {
    try {
        const response: Response = await fetch(process.env.EXPO_PUBLIC_API_URL + `/users/${user.id}`, {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        if(response.ok) {
            const json = await response.json();
            console.log(json);
            return json;
        }
        else {
            console.log("Failed to delete user");
            return thunkAPI.rejectWithValue(await response.text());
        }
    }
    catch(ex) {
        console.error(ex);
        return thunkAPI.rejectWithValue(ex);
    }
})

export const sendForgotPasswordCode = createAsyncThunk("account/sendForgotPasswordCode", async(email: string, thunkAPI) => {
    try {
        const response: Response = await fetch(process.env.EXPO_PUBLIC_API_URL + "/users/requestpasswordreset", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email})
        });

        if (response.ok) {
            const json = await response.json();
            console.log(json);
            return json;
        }
        else {
            console.log("Failed to send reactivation code to user");
            return thunkAPI.rejectWithValue(await response.text());
        }
    }
    catch(ex) {
        console.error(ex);
        return thunkAPI.rejectWithValue(ex);
    }
})

export const validateForgotPasswordCode = createAsyncThunk("account/validateForgotPasswordCode", async({userId, code}: {userId: string, code: string}, thunkAPI) => {
    try {
        const response: Response = await fetch(process.env.EXPO_PUBLIC_API_URL + `/users/${userId}/validcodeforpasswordreset`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({code})
        });

        if (response.ok) {
            return;
        }
        else {
            console.log("Failed to send reactivation code to user");
            return thunkAPI.rejectWithValue(await response.text());
        }
    }
    catch(ex) {
        console.error(ex);
        return thunkAPI.rejectWithValue(ex);
    }
})

export const changePassword = createAsyncThunk("account/changePassword", async({userId, password}: {userId: string, password: string}, thunkAPI) => {
    try {
        const response: Response = await fetch(process.env.EXPO_PUBLIC_API_URL + `/users/${userId}/resetpassword`, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({password})
        });
        
        if(response.ok) {
            const json = await response.json();
            console.log(json);
            router.replace("/(tabs)/");
            return json;
        }
        else {
            console.log("Failed to send update user");
            return thunkAPI.rejectWithValue(await response.text());
        }
    }
    catch(ex) {
        console.error(ex);
        return thunkAPI.rejectWithValue(ex);
    }
})

export const signInWithGoogle = createAsyncThunk("account/signInWithGoogle", async(_, thunkAPI) => {
    try {
        GoogleSignin.configure({
            offlineAccess: true,
            
            webClientId: process.env.EXPO_PUBLIC_GOOGLE_ID_CLIENT, // from Google Console,
        });
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        const idToken = (await GoogleSignin.getTokens()).idToken;

        // Send the ID token to your Node.js backend
        const response: Response = await fetch(process.env.EXPO_PUBLIC_API_URL + `/users/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
        });

        if(response.ok) {
            const json = await response.json();
            console.log(json);
            router.replace("/(tabs)/");
            return json;
        }
        else {
            console.log("Failed to sign in user with google");
            return thunkAPI.rejectWithValue(await response.text());
        }

    } catch (error) {
        console.error('Google Sign-In Error', error);
    }
});

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setCreateUser: (state, action) => {
            state.createUser = action.payload as CreateUser;
        },
        setUser: (state, action) => {
            //state.isOnboarded = true
            console.log("payload", action.payload);
            state.user = action.payload as User | null;
        },
        setIsGuess: (state, action) => {
            state.isGuess = action.payload as boolean;
        },
        setIsAccountVerified: (state, action) => {
            state.isAccountVerified = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(sendValidationCode.fulfilled, (state, action) => {
            const t = i18n.t;

            console.log("send code succeeded")
            ToastMessage("success", t("success"), t("codeSentToEmail"));

            state.user = {... action.payload as any};
            const createUser = state.createUser as CreateUser;
            const user = state.user as User;
            const data = JSON.stringify({createUser, user});
            
            router.push({ pathname: "/(account)/verify", params: {data}});
        })
        .addCase(sendValidationCode.rejected, (state, action) => {
            const t = i18n.t;
            console.log("failed to send code")
            ToastMessage(
                "error",
                t("error"),
                t("failedToSendCode")
            )
        })
        .addCase(validateCode.fulfilled, (state, action) => {
            const t = i18n.t;

            state.isAccountVerified = true;
            state.user = {... action.payload as any};
            
            ToastMessage("success", t("success"), t("accountCreated"));
            
        })
        .addCase(validateCode.rejected, (state, action) => {
            const t = i18n.t;

            ToastMessage(
                "error",
                t("error"),
                t("failedToValidateCode")
            )
        })
        .addCase(updateUser.fulfilled, (state, action) => {
            state.user = {... action.payload as any};
        })
        .addCase(sendForgotPasswordCode.fulfilled, (state, action) => {
            const t = i18n.t;

            state.forgotUser = {... action.payload as any};
            console.log("forgot user", JSON.stringify({... action.payload as any}));
            router.push({pathname: "/(account)/verifyforgot", params: {data: JSON.stringify(state.forgotUser)}});
        })
        .addCase(sendForgotPasswordCode.rejected, (state, action) => {
            const t = i18n.t;
            console.log("failed to send code")
            ToastMessage(
                "error",
                t("error"),
                t("failedToSendCode")
            )
        })
        .addCase(validateForgotPasswordCode.fulfilled, (state, action) => {
            router.push({pathname: "/(account)/changepassword", params: {data: JSON.stringify(state.forgotUser)}});
        })
        .addCase(validateForgotPasswordCode.rejected, (state, action) => {
            const t = i18n.t;

            ToastMessage(
                "error",
                t("error"),
                t("failedToValidateCode")
            )
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.user = {... action.payload as any};
            state.isAccountVerified = true;

            if (!state.user?.isVerified) {
                const t = i18n.t;
                ToastMessage("success", t("success"), t("accountNotVerified"));
                const data = JSON.stringify({createUser: state.createUser, user: state.user});
                router.push({pathname: "/(account)/verify", params: {data}});
                return;
            }
            router.replace("/(tabs)/");
        })
        .addCase(loginUser.rejected, (state, action) => {
            const t = i18n.t;

            ToastMessage(
                "error",
                t("error"),
                t("failedToLogin")
            )
        })
        .addCase(changePassword.fulfilled, (state, action) => {
            const t = i18n.t;

            state.isAccountVerified = true;
            state.user = {... action.payload as any};
            
            ToastMessage("success", t("success"), t("accountCreated"));
        })
        .addCase(changePassword.rejected, (state, action) => {
            const t = i18n.t;

            ToastMessage(
                "error",
                t("error"),
                t("failedToChangePassword")
            )
        })
        .addCase(signInWithGoogle.fulfilled, (state, action) => {
            if (action.payload == undefined) return;
            state.user = action.payload as User | null;
            state.isAccountVerified = true;
            router.push("/(tabs)/");
        })
        .addCase(signInWithGoogle.rejected, (state, action) => {
            const t = i18n.t;
            state.user = null;

            ToastMessage("info", t("info"), t("comingSoon"));
            return;
            // ToastMessage(
            //     "error",
            //     t("error"),
            //     t("failedToLogin")
            // )
        })
    },
});

export const {setCreateUser, setUser, setIsGuess, setIsAccountVerified} = accountSlice.actions;

//selectors
export const selectCreateUser = (state: any) => state.account.createUser as CreateUser;
export const selectUser = (state: any) => state.account.user as User | null;
export const selectForgotUser = (state: any) => state.account.forgotUser as ForgotUser
export const selectIsAccountVerified = (state: any) => state.account.isAccountVerified as boolean;
export const selectIsGuess = (state: any) => state.account.isGuess as boolean;

export default accountSlice.reducer;