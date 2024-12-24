/**
 * Used to persist the data when opening and closing the app locally 
 */
import {configureStore, combineReducers} from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer} from 'redux-persist';
import onboardingReducer from '../slices/onboardingSlice';
import accountReducer from '../slices/accountSlice';
import homeReducer from '../slices/homeSlice'
import mapReducer from '../slices/mapSlice'

//configure the persist of the different futures
const onboardingPersistConfig = {
    key: 'root',
    version: 1,
    storage: AsyncStorage
}

const accountPersistConfig = {
    key: 'root',
    version: 1,
    storage: AsyncStorage
}

const homePersistConfig = {
    key: 'root',
    version: 1,
    storage: AsyncStorage,
    // backlist: ['examNight'] // use this if you don't want to persist this screen
}

const mapPersistConfig = {
    key: 'root',
    version: 1,
    storage: AsyncStorage
}

const reducer = combineReducers({
    onboarding: persistReducer(onboardingPersistConfig, onboardingReducer),
    account: persistReducer(accountPersistConfig, accountReducer),
    home: persistReducer(homePersistConfig, homeReducer),
    map: persistReducer(mapPersistConfig, mapReducer)
})


export const store = configureStore({
    reducer: reducer,

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
        serializableCheck: false
    }),
})