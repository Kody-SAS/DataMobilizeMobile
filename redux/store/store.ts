/**
 * Used to persist the data when opening and closing the app locally 
 */
import {configureStore, combineReducers} from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer} from 'redux-persist';
import homeReducer from '../slices/homeSlice'

//configure the persist of the different futures
const homePersistConfig = {
    key: 'root',
    version: 1,
    storage: AsyncStorage,
    // backlist: ['examNight'] // use this if you don't want to persist this screen
}


const reducer = combineReducers({
    home: persistReducer(homePersistConfig, homeReducer),
})


export const store = configureStore({
    reducer: reducer,

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
        serializableCheck: false
    }),
})