import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, Platform, View, TouchableOpacity, ScrollView, FlatList } from 'react-native';

import { TextBlock } from '../../components/TextBlock';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useNetInfo } from '@react-native-community/netinfo';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { ButtonTypeEnum, IncidentReport, QuickReport, ReportType, SafetyLevel, SafetyPerceptionReport, TextBlockTypeEnum, UserType } from '../../type.d';
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
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { conditionListData } from '../../utils/DataSeed';
import { selectUser } from '../../redux/slices/accountSlice';

const conditionIssues : {label: string, status: "checked" | "unchecked"}[] = conditionListData.map(
  (condition) => ({
    label: condition.type,
    status: "checked"
  })
)

const severityOptions : {label: string, status: "checked" | "unchecked"}[] = Object.values(SafetyLevel).map((level, index) => ({
  label: level,
  status: "checked"
}));

const dateOptions = {
  weekday: "short",
  year: "numeric",
  month: "long",
  day: "numeric",
};

export default function Map() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [locationPredictions, setLocationPredictions] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [isFullMap, setIsFullMap] = useState<boolean>(false);
  const [isMapTypeSelectViewVisible, setIsMapTypeSelectViewVisible] = useState<boolean>(false);
  const [mapType, setMapType] = useState<string>(MAP_TYPES.SATELLITE);
  const [isSafetyChecked, setIsSafetyChecked] = useState<boolean>(true);
  const [isQuickChecked, setIsQuickChecked] = useState<boolean>(true);
  const [isIncidentChecked, setIsIncidentChecked] = useState<boolean>(true);
  const [isReportSelectVisible, setIsReportSelectVisible] = useState<boolean>(false);
  const [isSafetyFilterVisible, setIsSafetyFilterVisible] = useState<boolean>(false);
  const [isQuickFilterVisible, setIsQuickFilterVisible] = useState<boolean>(false);
  const [isIncidentFilterVisible, setIsIncidentFilterVisible] = useState<boolean>(false);
  const [safetyStartDate, setSafetyStartDate] = useState<Date>(new Date(Date.now() - 604800000)); // 7 days ago
  const [safetyEndDate, setSafetyEndDate] = useState<Date>(new Date(Date.now() + 86400000)); // 1 days from now
  const [quickStartDate, setQuickStartDate] = useState<Date>(new Date(Date.now() - 604800000)); // 7 days ago
  const [quickEndDate, setQuickEndDate] = useState<Date>(new Date(Date.now() + 86400000)); // 1 days from now
  const [isPedestrianSafetyChecked, setIsPedestrianSafetyChecked] = useState<boolean>(false);
  const [isCyclistSafetyChecked, setIsCyclistSafetyChecked] = useState<boolean>(false);
  const [isMotorcyclistSafetyChecked, setIsMotorcyclistSafetyChecked] = useState<boolean>(false);
  const [isCarSafetyChecked, setIsCarSafetyChecked] = useState<boolean>(false);
  const [isBusSafetyChecked, setIsBusSafetyChecked] = useState<boolean>(false);
  const [isTruckSafetyChecked, setIsTruckSafetyChecked] = useState<boolean>(false);
  const [isSafetyDateError, setIsSafetyDateError] = useState<boolean>(false);
  const [isQuickDateError, setIsQuickDateError] = useState<boolean>(false);
  const [isSafeSafetyChecked, setIsSafeSafetyChecked] = useState<boolean>(true);
  const [isUnsafeSafetyChecked, setIsUnsafeSafetyChecked] = useState<boolean>(true);
  const [isVeryUnsafeSafetyChecked, setIsVeryUnsafeSafetyChecked] = useState<boolean>(true);
  const [isSafetyFilterModified, setIsSafetyFilterModified] = useState<boolean>(false);
  const [currentOpenedReport, setCurrentOpenedReport] = useState<SafetyPerceptionReport | QuickReport | IncidentReport | null>(null);
  const [filteredSafetyReports, setFilteredSafetyReports] = useState<SafetyPerceptionReport[]>([]);
  const [filteredQuickReports, setFilteredQuickReports] = useState<QuickReport[]>([]);
  const [quickConditionIssues, setQuickConditionIssues] = useState<{label: string, status: "checked" | "unchecked"}[]>(conditionIssues);
  const [quickSeverityOptions, setQuickSeverityOptions] = useState<{label: string, status: "checked" | "unchecked"}[]>(severityOptions);
  const [isQuickFilterModified, setIsQuickFilterModified] = useState<boolean>(false);
  const [isIncidentFilterModified, setIsIncidentFilterModified] = useState<boolean>(false);
  const [isStatisticsBtnVisible, setIsStatisticsBtnVisible] = useState<boolean>(true);

  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);
  const mapRef = React.useRef<MapView>(null);
  const snapPoints = React.useMemo(() => ['50%', '85%'], []);

  const {isConnected} = useNetInfo();
  const {t} = useTranslation();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const user = useSelector(selectUser);
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

  const handleLocationPrediction = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const response = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`);
      const data = await response.json();
      setLocationPredictions(data.predictions.slice(0, 5));
    } else {
      setLocationPredictions([]);
    }
  }

  const handleSelectLocation = async (placeId: string) => {
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`);
    const data = await response.json();
    const { lat, lng } = data.result.geometry.location;
    setSelectedLocation({ latitude: lat, longitude: lng });
    mapRef.current?.animateToRegion({
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    });
    setSearchQuery(data.result.formatted_address);
    setLocationPredictions([]);
    setIsSearchFocused(false);
  }

  const handleToggleMapTypeSelectView = () => {
    setIsMapTypeSelectViewVisible((old: boolean) => !old);
    setIsFullMap(true);
    setIsReportSelectVisible(false);
    setIsSafetyFilterVisible(false);
    setIsQuickFilterVisible(false);
    setIsIncidentFilterVisible(false);
  }

  const handleMapTypeSelection = (value: string) => {
    setMapType(value);
    setIsMapTypeSelectViewVisible(false);
  }

  const stringToMapType = (value: string) => {
    return Object.values(MAP_TYPES).find(type => type === value) ?? MAP_TYPES.SATELLITE;
  }

  const handleToggleReportSelectView = () => {
    setIsFullMap(true);
    setIsReportSelectVisible((old: boolean) => !old);
    setIsSafetyFilterVisible(false);
    setIsQuickFilterVisible(false);
    setIsIncidentFilterVisible(false);
    setIsMapTypeSelectViewVisible(false);
  }
  const handleToggleSafetyFilter = () => {
    setIsFullMap(true);
    setIsSafetyFilterVisible((old: boolean) => !old);
    setIsQuickFilterVisible(false);
    setIsIncidentFilterVisible(false);
    setIsReportSelectVisible(false);
    setIsMapTypeSelectViewVisible(false);
  }
  const handleToggleQuickFilter = () => {
    setIsFullMap(true);
    setIsQuickFilterVisible((old: boolean) => !old);
    setIsSafetyFilterVisible(false);
    setIsIncidentFilterVisible(false);
    setIsReportSelectVisible(false);
    setIsMapTypeSelectViewVisible(false);
  }
  const handleToggleIncidentFilter = () => {
    setIsFullMap(true);
    setIsIncidentFilterVisible((old: boolean) => !old);
    setIsSafetyFilterVisible(false);
    setIsQuickFilterVisible(false);
    setIsReportSelectVisible(false);
    setIsMapTypeSelectViewVisible(false);
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

  const handleToggleQuickConditionIssue = (index: number) => {
    const updatedConditionIssues = [...quickConditionIssues];
    updatedConditionIssues[index].status = updatedConditionIssues[index].status === "checked" ? "unchecked" : "checked";
    setQuickConditionIssues(updatedConditionIssues);
    setIsQuickFilterModified(true);
  }

  const handleToggleQuickSeverity = (index: number) => {
    const updatedSeverityOptions = [...quickSeverityOptions];
    updatedSeverityOptions[index].status = updatedSeverityOptions[index].status === "checked" ? "unchecked" : "checked";
    setQuickSeverityOptions(updatedSeverityOptions);
    setIsQuickFilterModified(true);
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
    setIsReportSelectVisible(false);
    setIsSafetyFilterModified(false);
    setIsMapTypeSelectViewVisible(false);
    setFilteredSafetyReports(filteredReports);
  }

  const handleQuickFilter = () => {
    // Check if the start date is after the end date
    if (quickStartDate > quickEndDate) {
      setIsQuickDateError(true);
      return;
    } else {
      setIsQuickDateError(false);
    }

    const filteredReports = quickReports.filter((report) => {
      const reportDate = new Date(report.createdAt);
      const isDateInRange = reportDate >= safetyStartDate && reportDate <= safetyEndDate;
      const isValidCondition = quickConditionIssues.some((condition, index) => {
        return condition.status === "checked" && report.conditionType == condition.label;
      });
      const isValidSeverity = quickSeverityOptions.some((severity, index) => {
        return severity.status === "checked" && report.severityLevel == severity.label;
      });

      return (
        isDateInRange &&
        isValidCondition &&
        isValidSeverity
      );
    })

    // Update the state with the filtered reports
    setIsFullMap(true);
    setIsSafetyFilterVisible(false);
    setIsQuickFilterVisible(false);
    setIsIncidentFilterVisible(false);
    setIsReportSelectVisible(false);
    setIsSafetyFilterModified(false);
    setIsMapTypeSelectViewVisible(false);
    setFilteredQuickReports(filteredReports);
  }

  const determineSafetyStyle = (safetyLevel: SafetyLevel) => {
    switch (safetyLevel) {
      case SafetyLevel.Safe:
        return "green";
      case SafetyLevel.unSafe:
        return "yellow";
      case SafetyLevel.veryUnsafe:
        return "red";   
      default:
        return "gray";
    }
  }

  const handleMarkerSafetyPress = (report: SafetyPerceptionReport | QuickReport | IncidentReport) => {
    setCurrentOpenedReport(report);
    bottomSheetModalRef.current?.present();
  }


  useEffect(() => {
    // dispatch(clearReports(null)); // for development only
    locateUser();
  }, []);
  
  return (
    <SafeAreaView style={styles.container}>
      <GestureHandlerRootView style={styles.container}>
      <BottomSheetModalProvider>
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
          <View style={{ gap: 8, position: "relative" }}>
            <Searchbar
              placeholder={t("search")}
              value={searchQuery}
              onChangeText={handleLocationPrediction}
              style={{ marginVertical: 16 }}
              onFocus={() => setIsSearchFocused((old: boolean) => !old)}
              onEndEditing={() => setIsSearchFocused((old: boolean) => !old)}
              />
            {locationPredictions.length > 0 && (
              <FlatList
                data={locationPredictions}
                keyExtractor={(item) => item.place_id}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    onPress={() => handleSelectLocation(item.place_id)}>
                    <View style={{ padding: 12 }}>
                        <TextBlock type={TextBlockTypeEnum.body}>{item.description}</TextBlock>
                    </View>
                    <View style={{ borderBottomWidth: 1.5, borderBottomColor: Colors.light.background.senary }}/>
                  </TouchableOpacity>
                )}
                style={{
                  position: "absolute",
                  top: 60,
                  left: 16,
                  right: 16,
                  backgroundColor: Colors.light.background.quinary,
                  borderRadius: 8,
                  padding: 8,
                  zIndex: 99
                }}
              />
            )}
          </View>
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

        {/* Select map type button */}
        <View style={{ position: "absolute", bottom: 12, left: 16, flexDirection: "row", alignItems: "flex-end", gap: 8, zIndex: 99 }}>
          <TouchableOpacity
            style={{backgroundColor: isMapTypeSelectViewVisible ? Colors.light.background.primary : Colors.light.background.quinary, borderRadius: 8, padding: 8, height: 40 }}
            onPress={handleToggleMapTypeSelectView}>
            <Octicons name="book" size={24} color={isMapTypeSelectViewVisible ? "white" : "black"} />
          </TouchableOpacity>

          {isMapTypeSelectViewVisible && (
            <View style={{ backgroundColor: Colors.light.background.quinary, borderRadius: 8, padding: 12, gap: 8, width: "auto", height: "auto", zIndex: 99, maxWidth: 250 }}>
              <RadioButton.Group 
                  onValueChange={handleMapTypeSelection} 
                  value={mapType}>
                  <View>
                    <RadioButton.Item label={t("satellite")} value={MAP_TYPES.SATELLITE} />
                    <RadioButton.Item label={t("standard")} value={MAP_TYPES.STANDARD} />
                    <RadioButton.Item label={t("terrain")} value={MAP_TYPES.TERRAIN} />
                  </View>
              </RadioButton.Group>
            </View>
          )}
        </View>

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
                    onChange={() => setIsSafetyFilterModified(true)}
                  />
                  <DateInput
                    placeholder={t("endDate")}
                    date={safetyEndDate}
                    setDate={setSafetyEndDate}
                    mode={"date"}
                    onChange={() => setIsSafetyFilterModified(true)}
                  />
                </View>
                {isSafetyDateError && <TextBlock type={TextBlockTypeEnum.body} style={{color: "red"}}>{t("dateError")}</TextBlock>}
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
              <View style={{ backgroundColor: Colors.light.background.quinary, borderRadius: 8, padding: 12, width: "auto", height: "auto", maxWidth: 300 }} >
                <TextBlock type={TextBlockTypeEnum.title}>{t('defineFilter')}</TextBlock>
                <TextBlock type={TextBlockTypeEnum.title}>{t('selectDateInterval')}</TextBlock>
                <Spacer variant="medium" />
                <View style={{ flexDirection: "row", gap: 64, justifyContent: "flex-start", width: "auto", height: "auto" }}>
                  <DateInput
                    placeholder={t("startDate")}
                    date={quickStartDate}
                    setDate={setQuickStartDate}
                    mode={"date"}
                    onChange={() => setIsQuickFilterModified(true)}
                  />
                  <DateInput
                    placeholder={t("endDate")}
                    date={quickEndDate}
                    setDate={setQuickEndDate}
                    mode={"date"}
                    onChange={() => setIsQuickFilterModified(true)}
                  />
                </View>
                {isSafetyDateError && <TextBlock type={TextBlockTypeEnum.body} style={{color: "red"}}>{t("dateError")}</TextBlock>}
                <Spacer variant="large" />
                <TextBlock type={TextBlockTypeEnum.title}>{t('selectSeverityLevel')}</TextBlock>
                <View style={{ justifyContent: "flex-start", width: "auto", height: "auto" }}>
                  {quickSeverityOptions.map((severity, index) => (
                    <Checkbox.Item 
                      key={index}
                      label={severity.label}
                      status={severity.status}
                      onPress={(e) => handleToggleQuickSeverity(index)} />
                  ))}
                </View>
                <Spacer variant="large" />
                <TextBlock type={TextBlockTypeEnum.title}>{t('selectConditionType')}</TextBlock>
                <ScrollView style={{ maxHeight: 200 }}>
                  {quickConditionIssues.map((condition, index) => (
                    <Checkbox.Item
                      key={index}
                      label={condition.label}
                      status={condition.status}
                      onPress={(e) => handleToggleQuickConditionIssue(index)}
                    />
                  ))}
                </ScrollView>
                <Spacer variant="large" />
                <Spacer variant="large" />
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <ButtonAction
                    variant={ButtonTypeEnum.secondary}
                    content={<TextBlock type={TextBlockTypeEnum.body} style={{paddingHorizontal: 30, paddingVertical: 4}}>{t("close")}</TextBlock>}
                    onPress={handleToggleQuickFilter}/>
                  <ButtonAction
                    variant={ButtonTypeEnum.primary}
                    content={<TextBlock type={TextBlockTypeEnum.body} style={{color: "white", paddingHorizontal: 30, paddingVertical: 4}}>{t("apply")}</TextBlock>}
                    disabled={!isQuickFilterModified}
                    onPress={handleQuickFilter}/>
                </View>
              </View>
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

      <MapView 
        ref={mapRef}
        style={styles.mapView}
        mapType={stringToMapType(mapType)}
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
            onPress={() => handleMarkerSafetyPress(report)}
          >
            <View style={{justifyContent: "center", alignItems: "center", backgroundColor: "white", borderRadius: 8}}>
              {report.userType == UserType.Pedestrian && <MaterialCommunityIcons name="human" size={30} color={determineSafetyStyle(report.safetyLevel)} />}
              {report.userType == UserType.Cyclist && <MaterialCommunityIcons name="bike" size={30} color={determineSafetyStyle(report.safetyLevel)} />}
              {report.userType == UserType.Motocyclist && <MaterialCommunityIcons name="motorbike" size={24} color={determineSafetyStyle(report.safetyLevel)} />}
              {report.userType == UserType.Car && <MaterialCommunityIcons name="car" size={30} color={determineSafetyStyle(report.safetyLevel)} />}
              {report.userType == UserType.Bus && <MaterialCommunityIcons name="bus" size={30} color={determineSafetyStyle(report.safetyLevel)} />}
              {report.userType == UserType.Truck && <MaterialCommunityIcons name="truck" size={30} color={determineSafetyStyle(report.safetyLevel)} />}
            </View>
          </Marker>
        ))}
      </MapView>
      </View>
      <BottomSheetModal
        ref={bottomSheetModalRef} 
        snapPoints={snapPoints}
        >
        <BottomSheetView style={{ flex: 1, padding: 16 }}>
          {currentOpenedReport && (
            <>
              {currentOpenedReport.reportType === ReportType.SafetyPerception && (
                <View>
                  <TextBlock type={TextBlockTypeEnum.h4} style={{fontWeight: '700'}}>{t("safetyPerceptionReport")}</TextBlock>
                  <Spacer variant="medium" />
                  <Spacer variant="large" />
                  <TextBlock type={TextBlockTypeEnum.body}>{t("userType")}: {(currentOpenedReport as SafetyPerceptionReport).userType}</TextBlock>
                  <Spacer variant="medium" />
                  <TextBlock type={TextBlockTypeEnum.body}>{t("safetyLevel")}: {(currentOpenedReport as SafetyPerceptionReport).safetyLevel}</TextBlock>
                  <Spacer variant="medium" />
                  <TextBlock type={TextBlockTypeEnum.body}>{t("comment")}: {(currentOpenedReport as SafetyPerceptionReport).comment}</TextBlock>
                  <Spacer variant="medium" />
                  <TextBlock type={TextBlockTypeEnum.body}>{t("createdAt")}: {(currentOpenedReport as SafetyPerceptionReport).createdAt.toLocaleString(user?.localisation, {weekday: "short", year: "numeric", month: "long", day: "numeric",})}</TextBlock>
                  <Spacer variant="medium" />
                  <TextBlock type={TextBlockTypeEnum.body}>{t("roadType")}: {(currentOpenedReport as SafetyPerceptionReport).roadType}</TextBlock>
                  <Spacer variant="medium" />
                  <Spacer variant="large" />
                  <View style={{ flexDirection: "row", gap: 8, justifyContent: "flex-start", width: "auto", height: "auto" }}>
                    {(currentOpenedReport as SafetyPerceptionReport).images.map((image, index) => (
                      <Image
                        key={index}
                        source={{ uri: image }}
                        style={{ width: 150, height: 150, borderRadius: 8, marginBottom: 8 }}
                      />
                    ))}
                  </View>
                </View>
              )}

              {currentOpenedReport.reportType === ReportType.Quick && (
                <View>
                  <TextBlock type={TextBlockTypeEnum.h4} style={{fontWeight: '700'}}>{t("quickReport")}</TextBlock>
                  <Spacer variant="medium" />
                  <Spacer variant="large" />
                  <TextBlock type={TextBlockTypeEnum.body}>{t("roadType")}: {(currentOpenedReport as QuickReport).roadType}</TextBlock>
                  <Spacer variant="medium" />
                  <TextBlock type={TextBlockTypeEnum.body}>{t("conditionType")}: {(currentOpenedReport as QuickReport).conditionType}</TextBlock>
                  <Spacer variant="medium" />
                  <TextBlock type={TextBlockTypeEnum.body}>{t("conditionDescription")}: {(currentOpenedReport as QuickReport).conditionDescription}</TextBlock>
                  <Spacer variant="medium" />
                  <TextBlock type={TextBlockTypeEnum.body}>{t("severityLevel")}: {(currentOpenedReport as QuickReport).severityLevel}</TextBlock>
                  <Spacer variant="medium" />
                  <TextBlock type={TextBlockTypeEnum.body}>{t("createdAt")}: {(currentOpenedReport as QuickReport).createdAt.toLocaleString(user?.localisation, {weekday: "short", year: "numeric", month: "long", day: "numeric",})}</TextBlock>
                  <Spacer variant="medium" />
                  <Spacer variant="large" />
                  <View style={{ flexDirection: "row", gap: 8, justifyContent: "flex-start", width: "auto", height: "auto" }}>
                    {(currentOpenedReport as SafetyPerceptionReport).images.map((image, index) => (
                      <Image
                        key={index}
                        source={{ uri: image }}
                        style={{ width: 150, height: 150, borderRadius: 8, marginBottom: 8 }}
                      />
                    ))}
                  </View>
                </View>
              )}
            </>
          )}
        </BottomSheetView>
      </BottomSheetModal>
      </BottomSheetModalProvider>
      </GestureHandlerRootView>
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
