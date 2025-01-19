import AsyncStorage from "@react-native-async-storage/async-storage";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import ToastMessage from "../../utils/Toast";
import i18n from "../../languages";
import { CreateUser, ForgotUser, LoginUser, User, VerifyUser } from "../../type";
import { router } from "expo-router";


const initialState = {
    createUser: {} as CreateUser,
    user: {} as User,
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
            console.log("Failed to get user", await response.json());
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
            console.log("Failed to send create user request", await response.json());
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
            return json;
        }
        else {
            console.log("Failed to validate user:", await response.json());
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
            console.log("Failed to login user", await response.json());
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
            console.log("Failed to send update user:", await response.json());
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
            console.log("Failed to delete user:", await response.json());
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
        const response: Response = await fetch(process.env.EXPO_PUBLIC_API_URL + "/users/forgot", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(email)
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
        const response: Response = await fetch(process.env.EXPO_PUBLIC_API_URL + `/users/forgot/${userId}`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(code)
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
        const response: Response = await fetch(process.env.EXPO_PUBLIC_API_URL + `/users/changepassword/${userId}`, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(password)
        });
        
        if(response.ok) {
            const json = await response.json();
            console.log(json);
            return json;
        }
        else {
            console.log("Failed to send update user:", await response.json());
            return thunkAPI.rejectWithValue(await response.text());
        }
    }
    catch(ex) {
        console.error(ex);
        return thunkAPI.rejectWithValue(ex);
    }
})

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setCreateUser: (state, action) => {
            state.createUser = action.payload as CreateUser;
        },
        setUser: (state, action) => {
            //state.isOnboarded = true
            state.user = action.payload
        },
        setIsGuess: (state, action) => {
            state.isGuess = action.payload as boolean;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(sendValidationCode.fulfilled, (state, action) => {
            console.log("send code succeeded")
            state.user = {... action.payload as any};

            router.push("/(account)/verify");
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
            router.replace("/(tabs)/");
            
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
            router.push("/(account)/verifyforgot");
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
            router.push("/(account)/changepassword");
        })
        .addCase(validateForgotPasswordCode.rejected, (state, action) => {
            const t = i18n.t;

            ToastMessage(
                "error",
                t("error"),
                t("failedToValidateCode")
            )
        })
        .addCase(changePassword.fulfilled, (state, action) => {
            const t = i18n.t;

            state.isAccountVerified = true;
            state.user = {... action.payload as any};
            
            ToastMessage("success", t("success"), t("accountCreated"));
            router.replace("/(tabs)/");
        })
        .addCase(changePassword.rejected, (state, action) => {
            const t = i18n.t;

            ToastMessage(
                "error",
                t("error"),
                t("failedToChangePassword")
            )
        })
    },
});

export const {setCreateUser, setUser, setIsGuess} = accountSlice.actions;

//selectors
export const selectCreateUser = (state: any) => state.account.createUser as CreateUser;
export const selectUser = (state: any) => state.account.user as User;
export const selectForgotUser = (state: any) => state.account.forgotUser as ForgotUser
export const selectIsAccountVerified = (state: any) => state.account.isAccountVerified as boolean;
export const selectIsGuess = (state: any) => state.account.isGuess as boolean;

export default accountSlice.reducer;