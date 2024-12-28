import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useRef, useEffect } from 'react';
import {Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts as useInter} from "@expo-google-fonts/inter"
import { Redirect, router, SplashScreen, useNavigation } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsOnboarded, setOnboardingStatus } from '../redux/slices/onboardingSlice';
import { LogBox } from 'react-native';
import "../languages"
import { selectIsAccountVerified, selectUser } from '../redux/slices/accountSlice';
LogBox.ignoreLogs(['new NativeEventEmitter']);


export default function App() {
  const [fontsLoaded] = useInter({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold
  })

  const isOnboarded = useSelector(selectIsOnboarded);
  const isAccountVerified = useSelector(selectIsAccountVerified);

  const navigation = useNavigation()
  const dispatch = useDispatch()

  useEffect(() => {
    navigation.setOptions({
      headerShown: false
    })
    SplashScreen.hideAsync();

    // for dev purpose
    dispatch(setOnboardingStatus());
  }, [])

  if (!fontsLoaded) return null;

  if (!isOnboarded) {
    return <Redirect href="/(onboarding)/onboarding" />
  }
  else{
    if (isAccountVerified) return <Redirect href="/(tabs)/" />
    else return <Redirect href="/(account)/" />
  }
}