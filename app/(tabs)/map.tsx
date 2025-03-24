import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, Platform, View } from 'react-native';

import { TextBlock } from '../../components/TextBlock';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useNetInfo } from '@react-native-community/netinfo';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { SafetyPerceptionReport, TextBlockTypeEnum } from '../../type.d';
import { FAB, Searchbar } from 'react-native-paper';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Spacer } from '../../components/Spacer';
import { registerForForegroundLocationPermissionAsync } from '../../utils/Permissions';
import * as Location from 'expo-location';
import ToastMessage from '../../utils/Toast';
import { selectSafetyReports } from '../../redux/slices/mapSlice';

export default function Map() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  const {isConnected} = useNetInfo();
  const {t} = useTranslation();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const safetyReports: SafetyPerceptionReport[] = useSelector(selectSafetyReports);

  const locateUser = async() => {
    const foregroundPermissionStatus = await registerForForegroundLocationPermissionAsync();
    if (foregroundPermissionStatus) {
      console.log('Permission granted');
      const location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Balanced});
      setCurrentLocation(location);
      return;
    }
    console.log('Permission denied');
    ToastMessage(
      "info",
      t("info"),
      t("locationPermissionDenied")
    )
  }

  useEffect(() => {
    locateUser();
  }, []);
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.introContainer}>
        {!isSearchFocused && (
          <>
            <TextBlock type={TextBlockTypeEnum.h1} style={{ textAlign: "left" }}>
              {t("exploration")}
            </TextBlock>
            <Spacer variant="large" />
            <TextBlock type={TextBlockTypeEnum.body} style={{ textAlign: "left" }}>
              {t("provideEmailForgot")}
            </TextBlock>
          </>
        )}
        <Searchbar
          placeholder={t("search")}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{ marginVertical: 16 }}
          onFocus={() => setIsSearchFocused((old: boolean) => !old)}
          onEndEditing={() => setIsSearchFocused((old: boolean) => !old)}
          />
      </View>
      <MapView 
        style={styles.mapContainer}
        initialRegion={{
          latitude: currentLocation?.coords.latitude ?? 6,
          longitude: currentLocation?.coords.longitude ?? 12,
          latitudeDelta: 5,
          longitudeDelta: 5
        }}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
      >
        {/* {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude
            }}
            title="You are here"
            description="Your current location"
          />
        )} */}
        {safetyReports.map((report, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: report.latitude,
              longitude: report.longitude
            }}
            title={"Safety Report"}
            description={report.comment}
          >
            <Image
              source={require('../../assets/images/safetymarker.png')}
              style={{ width: 40, height: 40 }}
            />
          </Marker>
        ))}
      </MapView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background.quinary,
  },
  introContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8
  },
  description: {
    verticalAlign: "middle",
    color: "#FFFFFF",
    paddingHorizontal: 32,
    paddingVertical: 4,
    justifyContent: "center",
    alignItems: "center"
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
