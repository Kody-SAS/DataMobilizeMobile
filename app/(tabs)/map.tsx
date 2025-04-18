import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, Platform, View, TouchableOpacity, ScrollView } from 'react-native';

import { TextBlock } from '../../components/TextBlock';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useNetInfo } from '@react-native-community/netinfo';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { ButtonTypeEnum, IncidentReport, QuickReport, SafetyLevel, SafetyPerceptionReport, TextBlockTypeEnum, UserType } from '../../type.d';
import { Checkbox, FAB, RadioButton, Searchbar } from 'react-native-paper';
import MapView, { MAP_TYPES, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Spacer } from '../../components/Spacer';
import { registerForForegroundLocationPermissionAsync } from '../../utils/Permissions';
import * as Location from 'expo-location';
import ToastMessage from '../../utils/Toast';
import { clearReports, selectIncidentReports, selectQuickReports, selectSafetyReports } from '../../redux/slices/mapSlice';
import { MaterialCommunityIcons, MaterialIcons, Octicons } from '@expo/vector-icons';
import { ButtonAction } from '../../components/ButtonAction';
import { DateInput } from '../../components/DateInput';

export default function Map() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [isFullMap, setIsFullMap] = useState<boolean>(false);
  const [isSafetyChecked, setIsSafetyChecked] = useState<boolean>(true);
  const [isQuickChecked, setIsQuickChecked] = useState<boolean>(true);
  const [isIncidentChecked, setIsIncidentChecked] = useState<boolean>(true);
  const [isAuditChecked, setIsAuditChecked] = useState<boolean>(true);
  const [isReportSelectVisible, setIsReportSelectVisible] = useState<boolean>(false);
  const [isSafetyFilterVisible, setIsSafetyFilterVisible] = useState<boolean>(false);
  const [isQuickFilterVisible, setIsQuickFilterVisible] = useState<boolean>(false);
  const [isIncidentFilterVisible, setIsIncidentFilterVisible] = useState<boolean>(false);
  const [isAuditFilterVisible, setIsAuditFilterVisible] = useState<boolean>(false);
  const [safetyStartDate, setSafetyStartDate] = useState<Date>(new Date(Date.now()));
  const [safetyEndDate, setSafetyEndDate] = useState<Date>(new Date(Date.now()));
  const [isPedestrianSafetyChecked, setIsPedestrianSafetyChecked] = useState<boolean>(false);
  const [isCyclistSafetyChecked, setIsCyclistSafetyChecked] = useState<boolean>(false);
  const [isMotorcyclistSafetyChecked, setIsMotorcyclistSafetyChecked] = useState<boolean>(false);
  const [isCarSafetyChecked, setIsCarSafetyChecked] = useState<boolean>(false);
  const [isBusSafetyChecked, setIsBusSafetyChecked] = useState<boolean>(false);
  const [isTruckSafetyChecked, setIsTruckSafetyChecked] = useState<boolean>(false);
  const [isSafetyDateError, setIsSafetyDateError] = useState<boolean>(false);
  const [isSafeSafetyChecked, setIsSafeSafetyChecked] = useState<boolean>(true);
  const [isUnsafeSafetyChecked, setIsUnsafeSafetyChecked] = useState<boolean>(true);
  const [isVeryUnsafeSafetyChecked, setIsVeryUnsafeSafetyChecked] = useState<boolean>(true);
  const [isSafetyFilterModified, setIsSafetyFilterModified] = useState<boolean>(false);
  const [filteredSafetyReports, setFilteredSafetyReports] = useState<SafetyPerceptionReport[]>([]);
  const [isQuickFilterModified, setIsQuickFilterModified] = useState<boolean>(false);
  const [isIncidentFilterModified, setIsIncidentFilterModified] = useState<boolean>(false);
  const [isAuditFilterModified, setIsAuditFilterModified] = useState<boolean>(false);

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
    setIsFullMap(true);
    setIsReportSelectVisible((old: boolean) => !old);
    setIsSafetyFilterVisible(false);
    setIsQuickFilterVisible(false);
    setIsIncidentFilterVisible(false);
    setIsAuditFilterVisible(false);
  }
  const handleToggleSafetyFilter = () => {
    setIsFullMap(true);
    setIsSafetyFilterVisible((old: boolean) => !old);
    setIsQuickFilterVisible(false);
    setIsIncidentFilterVisible(false);
    setIsAuditFilterVisible(false);
    setIsReportSelectVisible(false);
  }
  const handleToggleQuickFilter = () => {
    setIsFullMap(true);
    setIsQuickFilterVisible((old: boolean) => !old);
    setIsSafetyFilterVisible(false);
    setIsIncidentFilterVisible(false);
    setIsAuditFilterVisible(false);
    setIsReportSelectVisible(false);
  }
  const handleToggleIncidentFilter = () => {
    setIsFullMap(true);
    setIsIncidentFilterVisible((old: boolean) => !old);
    setIsSafetyFilterVisible(false);
    setIsQuickFilterVisible(false);
    setIsAuditFilterVisible(false);
    setIsReportSelectVisible(false);
  }

  const handleToggleAuditFilter = () => {
    setIsFullMap(true);
    setIsAuditFilterVisible((old: boolean) => !old);
    setIsSafetyFilterVisible(false);
    setIsQuickFilterVisible(false);
    setIsIncidentFilterVisible(false);
    setIsReportSelectVisible(false);
  }

  const handleTogglePedestrianSafety = () => {
    setIsPedestrianSafetyChecked((old: boolean) => !old);
    setIsSafetyFilterModified(true);
  }

  const handleToggleCyclistSafety = () => {
    setIsCyclistSafetyChecked((old: boolean) => !old);
    setIsSafetyFilterModified(true);
  }

  const handleToggleMotocyclistSafety = () => {
    setIsMotorcyclistSafetyChecked((old: boolean) => !old);
    setIsSafetyFilterModified(true);
  }

  const handleToggleCarSafety = () => {
    setIsCarSafetyChecked((old: boolean) => !old);
    setIsSafetyFilterModified(true);
  }

  const handleToggleBusSafety = () => {
    setIsBusSafetyChecked((old: boolean) => !old);
    setIsSafetyFilterModified(true);
  }

  const handleToggleTruckSafety = () => {
    setIsTruckSafetyChecked((old: boolean) => !old);
    setIsSafetyFilterModified(true);
  }

  const handleToggleSafeSafety = () => {
    setIsSafeSafetyChecked((old: boolean) => !old);
    setIsSafetyFilterModified(true);
  }

  const handleToggleUnsafeSafety = () => {
    setIsUnsafeSafetyChecked((old: boolean) => !old);
    setIsSafetyFilterModified(true);
  }

  const handleToggleVeryUnsafeSafety = () => {
    setIsVeryUnsafeSafetyChecked((old: boolean) => !old);
    setIsSafetyFilterModified(true);
  }

  const handleSafetyFilter = () => {
    // Check if the start date is after the end date
    if (safetyStartDate > safetyEndDate) {
      setIsSafetyDateError(true);
      return;
    } else {
      setIsSafetyDateError(false);
    }
    // Filter the safety reports based on the selected filters
    const filteredReports = safetyReports.filter((report) => {
      const reportDate = new Date(report.createdAt);
      const isDateInRange = reportDate >= safetyStartDate && reportDate <= safetyEndDate;
      const isPedestrian = isPedestrianSafetyChecked ? report.userType === UserType.Pedestrian : false;
      const isCyclist = isCyclistSafetyChecked ? report.userType === UserType.Cyclist : false;
      const isMotorcyclist = isMotorcyclistSafetyChecked ? report.userType === UserType.Motocyclist : false;
      const isCar = isCarSafetyChecked ? report.userType === UserType.Car : false;
      const isBus = isBusSafetyChecked ? report.userType === UserType.Bus : false;
      const isTruck = isTruckSafetyChecked ? report.userType === UserType.Truck : false;
      const isValidSafetyLevel = ((report.safetyLevel === SafetyLevel.Safe) && isSafeSafetyChecked) ||
                                  ((report.safetyLevel === SafetyLevel.unSafe) && isUnsafeSafetyChecked) ||
                                  ((report.safetyLevel === SafetyLevel.veryUnsafe) && isVeryUnsafeSafetyChecked)
      return (
        isDateInRange &&
        (isPedestrian || isCyclist || isMotorcyclist || isCar || isBus || isTruck) &&
        (isValidSafetyLevel)
      );
    });

    // Update the state with the filtered reports
    setIsFullMap(true);
    setIsSafetyFilterVisible(false);
    setIsQuickFilterVisible(false);
    setIsIncidentFilterVisible(false);
    setIsAuditFilterVisible(false);
    setIsReportSelectVisible(false);
    setIsSafetyFilterModified(false);
    console.log("Filtered reports: ", filteredReports);
    console.log("Safety reports: ", safetyReports);
    setFilteredSafetyReports(filteredReports);
  }


  useEffect(() => {
    // dispatch(clearReports(null)); // for development only
    locateUser();
  }, []);
  
  return (
    <SafeAreaView style={styles.container}>
      {!isFullMap && (
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
          style={{ position: "absolute", top: 12, right: 72, backgroundColor: isFullMap ? Colors.light.background.primary : Colors.light.background.quinary, borderRadius: 8, padding: 8, zIndex: 99 }}
          onPress={() => setIsFullMap(!isFullMap)}>
          <MaterialIcons name={isFullMap ? "zoom-in-map" : "zoom-out-map"} size={24} color={isFullMap ? "white" : "black"} />
        </TouchableOpacity>

        {/* Select the type of report to display */}
        <View style={{ position: "absolute", top: 12, left: 16, flexDirection: "row", gap: 8, zIndex: 99 }}>
          <TouchableOpacity
            style={{backgroundColor: isReportSelectVisible ? Colors.light.background.primary : Colors.light.background.quinary, borderRadius: 8, padding: 8, height: 40 }}
            onPress={handleToggleReportSelectView}>
            <Octicons name="multi-select" size={24} color={isReportSelectVisible ? "white" : "black"} />
          </TouchableOpacity>
          {isReportSelectVisible && ( 
            <ScrollView style={{ backgroundColor: Colors.light.background.quinary, borderRadius: 8, padding: 12, gap: 8, width: "auto", height: "auto", zIndex: 99, maxWidth: 250 }}
            contentContainerStyle={{ justifyContent: "flex-start"}}>
              {/* List of reports */}
              <TextBlock type={TextBlockTypeEnum.title} style={{fontWeight: '700'}}>{t('selectReportToDisplay')}</TextBlock>
              <Checkbox.Item
                label={t("safetyPerceptionReport")}
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
              <Checkbox.Item
                label={t("auditReport")}
                status={isAuditChecked ? 'checked' : 'unchecked'}
                onPress={() => setIsAuditChecked(!isAuditChecked)}/> 
              <ButtonAction
                variant={ButtonTypeEnum.secondary}
                content={<TextBlock type={TextBlockTypeEnum.body}>{t("close")}</TextBlock>}
                onPress={handleToggleReportSelectView}/>
            </ScrollView>
          )}
        </View>

        {/* Filter the safety reports */}
        {isSafetyChecked && (
          <View style={{ position: "absolute", top: 64, left: 16, flexDirection: "row", gap: 8, justifyContent: "flex-start", width: "auto", height: "auto", zIndex: 99}}>
            <TouchableOpacity
              style={{backgroundColor: isSafetyFilterVisible ? Colors.light.background.primary : Colors.light.background.quinary, borderRadius: 8, padding: 8, height: 40 }}
              onPress={handleToggleSafetyFilter}>
              <MaterialIcons name="safety-check" size={24} color={isSafetyFilterVisible ? "white" : "black"} />
            </TouchableOpacity>
            {isSafetyFilterVisible && ( 
              <ScrollView style={{ backgroundColor: Colors.light.background.quinary, borderRadius: 8, padding: 12, width: "auto", height: "auto", maxWidth: 300 }}
              contentContainerStyle={{ justifyContent: "flex-start" }}>
                <TextBlock type={TextBlockTypeEnum.title} style={{fontWeight: '700'}}>{t('defineFilter')}</TextBlock>
                <Spacer variant="large" />
                <TextBlock type={TextBlockTypeEnum.title}>{t('selectUserType')}</TextBlock>
                <View style={{ flexDirection: 'row', gap: 4, justifyContent: "space-between", width: "auto", height: "auto" }}>
                  <Checkbox.Item
                    label={t("pedestrian")}
                    position='leading'
                    status={isPedestrianSafetyChecked ? "checked" : 'unchecked'}
                    onPress={handleTogglePedestrianSafety}/>
                  <Checkbox.Item
                    label={t("cyclist")}
                    status={isCyclistSafetyChecked ? "checked" : 'unchecked'}
                    onPress={handleToggleCyclistSafety}/>
                </View>
                <View style={{ flexDirection: 'row', gap: 4, justifyContent: "space-between", width: "auto", height: "auto" }}>
                  <Checkbox.Item
                    label={t("motorcyclist")}
                    position='leading'
                    status={isMotorcyclistSafetyChecked ? "checked" : 'unchecked'}
                    onPress={handleToggleMotocyclistSafety}/>
                  <Checkbox.Item
                    label={t("car")}
                    status={isCarSafetyChecked ? "checked" : 'unchecked'}
                    onPress={handleToggleCarSafety}/>
                </View>
                <View style={{ flexDirection: 'row', gap: 4, justifyContent: "space-between", width: "auto", height: "auto" }}>
                  <Checkbox.Item
                    label={t("bus")}
                    position='leading'
                    status={isBusSafetyChecked ? "checked" : 'unchecked'}
                    onPress={handleToggleBusSafety}/>
                  <Checkbox.Item
                    label={t("truck")}
                    status={isTruckSafetyChecked ? "checked" : 'unchecked'}
                    onPress={handleToggleTruckSafety}/>
                </View>
                <Spacer variant="large" />
                <TextBlock type={TextBlockTypeEnum.title}>{t('selectDateInterval')}</TextBlock>
                <Spacer variant="medium" />
                <View style={{ flexDirection: "row", gap: 64, justifyContent: "flex-start", width: "auto", height: "auto" }}>
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
                {isSafetyDateError && <TextBlock type={TextBlockTypeEnum.body} style={{color: "red"}}>{t("safetyDateError")}</TextBlock>}
                <Spacer variant="large" />
                <TextBlock type={TextBlockTypeEnum.title}>{t('selectSafetyLevel')}</TextBlock>
                <View style={{ justifyContent: "flex-start", width: "auto", height: "auto" }}>
                  <Checkbox.Item 
                    label={t("safe")}
                    status={isSafeSafetyChecked ? "checked" : "unchecked"}
                    onPress={handleToggleSafeSafety} />
                  <Checkbox.Item 
                    label={t("unsafe")} 
                    status={isUnsafeSafetyChecked ? "checked" : "unchecked"}
                    onPress={handleToggleUnsafeSafety} />
                  <Checkbox.Item 
                    label={t("veryUnsafe")} 
                    status={isVeryUnsafeSafetyChecked ? "checked" : "unchecked"}
                    onPress={handleToggleVeryUnsafeSafety} />
                </View>
                <Spacer variant="large" />
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <ButtonAction
                    variant={ButtonTypeEnum.secondary}
                    content={<TextBlock type={TextBlockTypeEnum.body} style={{paddingHorizontal: 30, paddingVertical: 4}}>{t("close")}</TextBlock>}
                    onPress={handleToggleSafetyFilter}/>
                  <ButtonAction
                    variant={ButtonTypeEnum.primary}
                    content={<TextBlock type={TextBlockTypeEnum.body} style={{color: "white", paddingHorizontal: 30, paddingVertical: 4}}>{t("apply")}</TextBlock>}
                    disabled={!isSafetyFilterModified}
                    onPress={handleSafetyFilter}/>
                </View>
              </ScrollView>
            )}
          </View>
        )}

        {/* Filter the quick reports */}
        {isQuickChecked && (
          <View style={{ position: "absolute", top: 112, left: 16, flexDirection: "row", gap: 8, justifyContent: "flex-start", width: "auto", height: "auto", zIndex: 99 }}>
            <TouchableOpacity
              style={{backgroundColor: isQuickFilterVisible ? Colors.light.background.primary : Colors.light.background.quinary, borderRadius: 8, padding: 8, height: 40 }}
              onPress={handleToggleQuickFilter}>
              <MaterialCommunityIcons name="clock-fast" size={24} color={isQuickFilterVisible ? "white" : "black"} />
            </TouchableOpacity>
            {isQuickFilterVisible && ( 
              <ScrollView style={{ backgroundColor: Colors.light.background.quinary, borderRadius: 8, padding: 12, width: "auto", height: "auto", maxWidth: 300 }}
              contentContainerStyle={{ justifyContent: "flex-start"}}>
                <TextBlock type={TextBlockTypeEnum.title}>{t('defineFilter')}</TextBlock>
                <TextBlock type={TextBlockTypeEnum.body}>{t('selectUserType')}</TextBlock>
                <View style={{ flexDirection: "row", gap: 8, justifyContent: "flex-start", width: "auto", height: "auto" }}>

                </View>
                  
                <Spacer variant="large" />
                <ButtonAction
                  variant={ButtonTypeEnum.secondary}
                  content={<TextBlock type={TextBlockTypeEnum.body}>{t("close")}</TextBlock>}
                  onPress={handleToggleQuickFilter}/>
              </ScrollView>
            )}
          </View>
        )}

        {/* Filter the incident reports */}
        {isIncidentChecked && (
          <View style={{ position: "absolute", top: 160, left: 16, flexDirection: "row", gap: 8, justifyContent: "flex-start", width: "auto", height: "auto", zIndex: 99 }}>
            <TouchableOpacity
              style={{backgroundColor: isIncidentFilterVisible ? Colors.light.background.primary : Colors.light.background.quinary, borderRadius: 8, padding: 8, height: 40 }}
              onPress={handleToggleIncidentFilter}>
              <MaterialIcons name="error-outline" size={24} color={isIncidentFilterVisible ? "white" : "black"} />
            </TouchableOpacity>
            {isIncidentFilterVisible && ( 
              <ScrollView style={{ backgroundColor: Colors.light.background.quinary, borderRadius: 8, padding: 12, width: "auto", height: "auto", maxWidth: 300 }}
              contentContainerStyle={{ justifyContent: "flex-start"}}>
                <TextBlock type={TextBlockTypeEnum.title}>{t('defineFilter')}</TextBlock>
                <TextBlock type={TextBlockTypeEnum.body}>{t('selectUserType')}</TextBlock>
                <View style={{ flexDirection: "row", gap: 8, justifyContent: "flex-start", width: "auto", height: "auto" }}>

                </View>
                  
                <Spacer variant="large" />
                <ButtonAction
                  variant={ButtonTypeEnum.secondary}
                  content={<TextBlock type={TextBlockTypeEnum.body}>{t("close")}</TextBlock>}
                  onPress={handleToggleIncidentFilter}/>
              </ScrollView>
            )}
          </View>
        )}

        {/* Filter the audit reports */}
        {isAuditChecked && (
          <View style={{ position: "absolute", top: 208, left: 16, flexDirection: "row", gap: 8, justifyContent: "flex-start", width: "auto", height: "auto", zIndex: 99 }}>
            <TouchableOpacity
              style={{backgroundColor: isAuditFilterVisible ? Colors.light.background.primary : Colors.light.background.quinary, borderRadius: 8, padding: 8, height: 40 }}
              onPress={handleToggleAuditFilter}>
              <MaterialIcons name="receipt-long" size={24} color={isAuditFilterVisible ? "white" : "black"} />
            </TouchableOpacity>
            {isAuditFilterVisible && ( 
              <ScrollView style={{ backgroundColor: Colors.light.background.quinary, borderRadius: 8, padding: 12, width: "auto", height: "auto", maxWidth: 300 }}
              contentContainerStyle={{ justifyContent: "flex-start"}}>
                <TextBlock type={TextBlockTypeEnum.title}>{t('defineFilter')}</TextBlock>
                <TextBlock type={TextBlockTypeEnum.body}>{t('selectUserType')}</TextBlock>
                <View style={{ flexDirection: "row", gap: 8, justifyContent: "flex-start", width: "auto", height: "auto" }}>

                </View>
                  
                <Spacer variant="large" />
                <ButtonAction
                  variant={ButtonTypeEnum.secondary}
                  content={<TextBlock type={TextBlockTypeEnum.body}>{t("close")}</TextBlock>}
                  onPress={handleToggleAuditFilter}/>
              </ScrollView>
            )}
          </View>
        )}

      <MapView 
        style={styles.mapView}
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
        {isSafetyChecked && filteredSafetyReports.map((report, index) => (
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
    backgroundColor: '#F5FCFF',
  },
  mapView: {
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
