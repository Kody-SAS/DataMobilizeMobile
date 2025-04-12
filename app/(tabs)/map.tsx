import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, Platform, View, TouchableOpacity } from 'react-native';

import { TextBlock } from '../../components/TextBlock';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useNetInfo } from '@react-native-community/netinfo';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { ButtonTypeEnum, IncidentReport, QuickReport, SafetyPerceptionReport, TextBlockTypeEnum } from '../../type.d';
import { Checkbox, FAB, Searchbar } from 'react-native-paper';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Spacer } from '../../components/Spacer';
import { registerForForegroundLocationPermissionAsync } from '../../utils/Permissions';
import * as Location from 'expo-location';
import ToastMessage from '../../utils/Toast';
import { selectIncidentReports, selectQuickReports, selectSafetyReports } from '../../redux/slices/mapSlice';
import { MaterialCommunityIcons, MaterialIcons, Octicons } from '@expo/vector-icons';
import { ButtonAction } from '../../components/ButtonAction';
import { DateInput } from '../../components/DateInput';

export default function Map() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [isFullMap, setIsFullMap] = useState<boolean>(false);
  const [isSafetyChecked, setIsSafetyChecked] = useState<boolean>(false);
  const [isQuickChecked, setIsQuickChecked] = useState<boolean>(false);
  const [isIncidentChecked, setIsIncidentChecked] = useState<boolean>(false);
  const [isReportSelectVisible, setIsReportSelectVisible] = useState<boolean>(false);
  const [isSafetyFilterVisible, setIsSafetyFilterVisible] = useState<boolean>(false);
  const [isQuickFilterVisible, setIsQuickFilterVisible] = useState<boolean>(false);
  const [isIncidentFilterVisible, setIsIncidentFilterVisible] = useState<boolean>(false);
  const [safetyStartDate, setSafetyStartDate] = useState<Date>(new Date(Date.now()));
  const [safetyEndDate, setSafetyEndDate] = useState<Date>(new Date(Date.now()));

  const {isConnected} = useNetInfo();
  const {t} = useTranslation();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const safetyReports: SafetyPerceptionReport[] = useSelector(selectSafetyReports);
  const quickReports: QuickReport[] = useSelector(selectQuickReports);
  const incidentRports: IncidentReport[] = useSelector(selectIncidentReports);

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

  const handleToggleReportSelectView = () => {
    setIsReportSelectVisible((old: boolean) => !old);
  }
  const handleToggleSafetyFilter = () => {
    setIsSafetyFilterVisible((old: boolean) => !old);
  }
  const handleToggleQuickFilter = () => {
    setIsQuickFilterVisible((old: boolean) => !old);
  }
  const handleToggleIncidentFilter = () => {
    setIsIncidentFilterVisible((old: boolean) => !old);
  }

  useEffect(() => {
    locateUser();
  }, []);
  
  return (
    <SafeAreaView style={styles.container}>
      {isFullMap && (
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
      )}
      <View
        style={styles.mapContainer}>
         {/* Full screen map button */}
         <TouchableOpacity
          style={{ position: "relative", top: 16, right: 16, backgroundColor: isFullMap ? Colors.light.background.primary : Colors.light.background.quinary, borderRadius: 8, padding: 8 }}
          onPress={() => setIsFullMap(!isFullMap)}>
          <MaterialIcons name={isFullMap ? "zoom-in-map" : "zoom-out-map"} size={20} color={isFullMap ? "black" : "white"} />
        </TouchableOpacity>

        {/* Select the type of report to display */}
        <View style={{ position: "relative", top: 16, left: 16, flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            style={{backgroundColor: Colors.light.background.quinary, borderRadius: 8, padding: 8 }}
            onPress={handleToggleReportSelectView}>
            <Octicons name="multi-select" size={24} color="black" />
          </TouchableOpacity>
          {isReportSelectVisible && ( 
            <View style={{ backgroundColor: Colors.light.background.quinary, borderRadius: 8, padding: 12, gap: 8, justifyContent: "flex-start", width: "auto", height: "auto" }}>
              {/* List of reports */}
              <TextBlock type={TextBlockTypeEnum.title}>{t('selectReportToDisplay')}</TextBlock>
              <Checkbox.Item
                label={t("safetyReport")}
                status={isSafetyChecked ? 'checked' : 'unchecked'}
                onPress={() => setIsSafetyChecked(!isSafetyChecked)}/>
              <Checkbox.Item
                label={t("quickReport")}
                status={isQuickChecked ? 'checked' : 'unchecked'}
                onPress={() => setIsQuickChecked(!isQuickChecked)}/>
              <Checkbox.Item
                label={t("incidentReport")}
                status={isIncidentChecked ? 'checked' : 'unchecked'}
                onPress={() => setIsIncidentChecked(!isIncidentChecked)}/> 
              <ButtonAction
                variant={ButtonTypeEnum.secondary}
                content={<TextBlock type={TextBlockTypeEnum.body}>{t("close")}</TextBlock>}
                onPress={handleToggleReportSelectView}/>
            </View>
          )}
        </View>

        {/* Filter the safety reports */}
        {isSafetyChecked && (
          <View style={{ position: "relative", top: 64, left: 16, flexDirection: "row", gap: 8, justifyContent: "flex-start", width: "auto", height: "auto" }}>
            <TouchableOpacity
              style={{backgroundColor: Colors.light.background.quinary, borderRadius: 8, padding: 8 }}
              onPress={handleToggleSafetyFilter}>
              <Octicons name="multi-select" size={24} color="black" />
            </TouchableOpacity>
            {isSafetyFilterVisible && ( 
              <View style={{ backgroundColor: Colors.light.background.quinary, borderRadius: 8, padding: 12, justifyContent: "flex-start", width: "auto", height: "auto" }}>
                <TextBlock type={TextBlockTypeEnum.title}>{t('defineFilter')}</TextBlock>
                <TextBlock type={TextBlockTypeEnum.body}>{t('selectUserType')}</TextBlock>
                <View style={{ flexDirection: "row", gap: 8, justifyContent: "flex-start", width: "auto", height: "auto" }}>
                  <Checkbox.Item
                    label={"🧍🏽‍♂️"}
                    status={'unchecked'}
                    onPress={() => {}}/>
                  <Checkbox.Item
                    label={"🚴🏽"}
                    status={'unchecked'}
                    onPress={() => {}}/>
                  <Checkbox.Item
                    label={"🏍️"}
                    status={'unchecked'}
                    onPress={() => {}}/>
                  <Checkbox.Item
                    label={"🚗"}
                    status={'unchecked'}
                    onPress={() => {}}/>
                  <Checkbox.Item
                    label={"🚌"}
                    status={'unchecked'}
                    onPress={() => {}}/>
                  <Checkbox.Item
                    label={"🚚"}
                    status={'unchecked'}
                    onPress={() => {}}/>
                </View>
                <Spacer variant="large" />
                <TextBlock type={TextBlockTypeEnum.body}>{t('selectDateInterval')}</TextBlock>
                <View style={{ flexDirection: "row", gap: 8, justifyContent: "flex-start", width: "auto", height: "auto" }}>
                  <DateInput
                    placeholder={t("startDate")}
                    date={safetyStartDate}
                    setDate={setSafetyStartDate}
                    mode={"date"}
                  />
                  <DateInput
                    placeholder={t("endDate")}
                    date={safetyEndDate}
                    setDate={setSafetyEndDate}
                    mode={"date"}
                  />
                </View>
                <Spacer variant="large" />
                <TextBlock type={TextBlockTypeEnum.body}>{t('selectSafetyLevel')}</TextBlock>
                <View style={{ gap: 8, justifyContent: "flex-start", width: "auto", height: "auto" }}>
                  <Checkbox.Item
                    label={t("safe")}
                    status={'unchecked'}
                    onPress={() => {}}/>
                  <Checkbox.Item
                    label={t("unSafe")}
                    status={'unchecked'}
                    onPress={() => {}}/>
                  <Checkbox.Item
                    label={t("veryUnsafe")}
                    status={'unchecked'}
                    onPress={() => {}}/>
                </View>
                <ButtonAction
                  variant={ButtonTypeEnum.secondary}
                  content={<TextBlock type={TextBlockTypeEnum.body}>{t("close")}</TextBlock>}
                  onPress={handleToggleSafetyFilter}/>
              </View>
            )}
          </View>
        )}

        {/* Filter the quick reports */}
        {isQuickChecked && (
          <View style={{ position: "relative", top: 112, left: 16, flexDirection: "row", gap: 8, justifyContent: "flex-start", width: "auto", height: "auto" }}>
            <TouchableOpacity
              style={{backgroundColor: Colors.light.background.quinary, borderRadius: 8, padding: 8 }}
              onPress={handleToggleQuickFilter}>
              <MaterialCommunityIcons name="clock-fast" size={24} color="black" />
            </TouchableOpacity>
            {isQuickFilterVisible && ( 
              <View style={{ backgroundColor: Colors.light.background.quinary, borderRadius: 8, padding: 12, justifyContent: "flex-start", width: "auto", height: "auto" }}>
                <TextBlock type={TextBlockTypeEnum.title}>{t('defineFilter')}</TextBlock>
                <TextBlock type={TextBlockTypeEnum.body}>{t('selectUserType')}</TextBlock>
                <View style={{ flexDirection: "row", gap: 8, justifyContent: "flex-start", width: "auto", height: "auto" }}>

                </View>
                  
                <Spacer variant="large" />
                <ButtonAction
                  variant={ButtonTypeEnum.secondary}
                  content={<TextBlock type={TextBlockTypeEnum.body}>{t("close")}</TextBlock>}
                  onPress={handleToggleQuickFilter}/>
              </View>
            )}
          </View>
        )}

        {/* Filter the incident reports */}
        {isIncidentChecked && (
          <View style={{ position: "absolute", top: 160, left: 16, flexDirection: "row", gap: 8, justifyContent: "flex-start", width: "auto", height: "auto" }}>
            <TouchableOpacity
              style={{backgroundColor: Colors.light.background.quinary, borderRadius: 8, padding: 8 }}
              onPress={handleToggleIncidentFilter}>
              <MaterialIcons name="error-outline" size={24} color="black" />
            </TouchableOpacity>
            {isIncidentFilterVisible && ( 
              <View style={{ backgroundColor: Colors.light.background.quinary, borderRadius: 8, padding: 12, justifyContent: "flex-start", width: "auto", height: "auto" }}>
                <TextBlock type={TextBlockTypeEnum.title}>{t('defineFilter')}</TextBlock>
                <TextBlock type={TextBlockTypeEnum.body}>{t('selectUserType')}</TextBlock>
                <View style={{ flexDirection: "row", gap: 8, justifyContent: "flex-start", width: "auto", height: "auto" }}>

                </View>
                  
                <Spacer variant="large" />
                <ButtonAction
                  variant={ButtonTypeEnum.secondary}
                  content={<TextBlock type={TextBlockTypeEnum.body}>{t("close")}</TextBlock>}
                  onPress={handleToggleIncidentFilter}/>
              </View>
            )}
          </View>
        )}

      <MapView 
        initialRegion={{
          latitude: currentLocation?.coords.latitude ?? 6,
          longitude: currentLocation?.coords.longitude ?? 12,
          latitudeDelta: 5,
          longitudeDelta: 5
        }}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
      >
       
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude
            }}
            title="You are here"
            description="Your current location"
          />
        )}
        {isSafetyChecked && safetyReports.map((report, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: report.latitude,
              longitude: report.longitude
            }}
            title={"Safety Report"}
            description={report.comment}
          >
            <View style={{justifyContent: "center", alignItems: "center"}}>
              <TextBlock type={TextBlockTypeEnum.h3}>🧍🏽‍♂️</TextBlock>
              <Spacer variant="small" />
              <View style={{backgroundColor: Colors.light.background.primary, width: 32, height: 8 }} />
            </View>
          </Marker>
        ))}
      </MapView>
      </View>
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
