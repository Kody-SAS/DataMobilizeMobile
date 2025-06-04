import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

// providers
import { Provider as StoreProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

import { useColorScheme } from '../hooks/useColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform, StatusBar } from 'react-native';
import { Colors } from '../constants/Colors';

import { store } from '../redux/store/store';
import { checkOnboardingStatus } from '../redux/slices/onboardingSlice';
import { ActivityIndicator } from 'react-native-paper';
import React from 'react';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
store.dispatch(checkOnboardingStatus())

let persistor = persistStore(store);

export default function RootLayout() {
  const {t} = useTranslation();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const loadingComponent = (
    <ActivityIndicator
      color={Colors.light.background.primary}
      size={48}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 50,
        //jusityContent: "space-around",
        flexWrap: "wrap",
        alignContent: "center",
      }}
    />
  )

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      { Platform.OS == "ios" &&
        <SafeAreaView style={{height:StatusBar.currentHeight, backgroundColor: Colors.light.background.tertiary}}>
          <StatusBar backgroundColor={Colors.light.background.tertiary} translucent={true} barStyle="dark-content" />
        </SafeAreaView>
      }
      <StoreProvider store={store}>
        <ThemeProvider value={DefaultTheme}>
          <PersistGate persistor={persistor} loading={loadingComponent}>
            <Stack>
              <Stack.Screen name='index' options={{headerShown: false}} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(account)" options={{ headerShown: false }} />
              <Stack.Screen name="(onboarding)/onboarding" options={{ headerShown: false }} />
              <Stack.Screen name="(homeStack)" options={{ headerShown: false }} />
              <Stack.Screen name="(mapStack)" options={{ headerShown: false }} />
            </Stack>
            {Platform.OS == 'android' && 
              <StatusBar translucent={true} barStyle="dark-content" backgroundColor={Colors.light.background.tertiary}/>
            }
            <Toast topOffset={120}/>
          </PersistGate>
        </ThemeProvider>
      </StoreProvider>
    </>
  );
}
