import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, Platform, View, TouchableOpacity, ScrollView, FlatList, Dimensions } from 'react-native';

import { TextBlock } from '../../components/TextBlock';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useNetInfo } from '@react-native-community/netinfo';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { ButtonTypeEnum, ConditionType, IncidentCrashData, IncidentEquipmentData, IncidentInfrastructureData, IncidentReport, IncidentSeverity, IncidentType, QuickReport, ReportType, SafetyLevel, SafetyPerceptionReport, SeverityLevel, TextBlockTypeEnum, UserType } from '../../type.d';
import { Checkbox, DataTable, FAB, Provider, RadioButton, Searchbar } from 'react-native-paper';
import MapView, { MAP_TYPES, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Spacer } from '../../components/Spacer';
import { registerForForegroundLocationPermissionAsync } from '../../utils/Permissions';
import * as Location from 'expo-location';
import ToastMessage from '../../utils/Toast';
import { MaterialCommunityIcons, MaterialIcons, Octicons } from '@expo/vector-icons';
import { ButtonAction } from '../../components/ButtonAction';
import { DateInput } from '../../components/DateInput';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { conditionListData } from '../../utils/DataSeed';
import { selectUser } from '../../redux/slices/accountSlice';
import { clearReports, getAllReports, selectReports } from '../../redux/slices/homeSlice';

const conditionIssues : {label: string, status: "checked" | "unchecked"}[] = conditionListData.map(
  (condition) => ({
    label: condition.type,
    status: "checked"
  })
)

const severityOptions : {label: string, status: "checked" | "unchecked"}[] = Object.values(SeverityLevel).map((level, index) => ({
  label: level,
  status: "checked"
}));

const incidentTypeData : {label: string, status: "checked" | "unchecked"}[] = Object.values(IncidentType).map((type, index) => ({
  label: type,
  status: "checked"
}));

const incidentSeverityData : {label: string, status: "checked" | "unchecked"}[] = Object.values(IncidentSeverity).map((type, index) => ({
  label: type,
  status: "checked"
}));

export default function Map() {
  const [safetyReports, setSafetyReports] = useState<SafetyPerceptionReport[]>([]);
  const [quickReports, setQuickReports] = useState<QuickReport[]>([]);
  const [incidentReports, setIncidentReports] = useState<IncidentReport[]>([]);
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
  const [incidentStartDate, setIncidentStartDate] = useState<Date>(new Date(Date.now() - 604800000)); // 7 days ago
  const [incidentEndDate, setIncidentEndDate] = useState<Date>(new Date(Date.now() + 86400000)); // 1 days from now
  const [isPedestrianSafetyChecked, setIsPedestrianSafetyChecked] = useState<boolean>(true);
  const [isCyclistSafetyChecked, setIsCyclistSafetyChecked] = useState<boolean>(true);
  const [isMotorcyclistSafetyChecked, setIsMotorcyclistSafetyChecked] = useState<boolean>(true);
  const [isCarSafetyChecked, setIsCarSafetyChecked] = useState<boolean>(true);
  const [isBusSafetyChecked, setIsBusSafetyChecked] = useState<boolean>(true);
  const [isTruckSafetyChecked, setIsTruckSafetyChecked] = useState<boolean>(true);
  const [isSafetyDateError, setIsSafetyDateError] = useState<boolean>(false);
  const [isIncidentDateError, setIsIncidentDateError] = useState<boolean>(false);
  const [isQuickDateError, setIsQuickDateError] = useState<boolean>(false);
  const [isSafeSafetyChecked, setIsSafeSafetyChecked] = useState<boolean>(true);
  const [isUnsafeSafetyChecked, setIsUnsafeSafetyChecked] = useState<boolean>(true);
  const [isVeryUnsafeSafetyChecked, setIsVeryUnsafeSafetyChecked] = useState<boolean>(true);
  const [isSafetyFilterModified, setIsSafetyFilterModified] = useState<boolean>(false);
  const [currentOpenedReport, setCurrentOpenedReport] = useState<SafetyPerceptionReport | QuickReport | IncidentReport | null>(null);
  const [filteredSafetyReports, setFilteredSafetyReports] = useState<SafetyPerceptionReport[]>([]);
  const [filteredQuickReports, setFilteredQuickReports] = useState<QuickReport[]>([]);
  const [filteredIncidentReports, setFilteredIncidentReports] = useState<IncidentReport[]>([]);
  const [quickConditionIssues, setQuickConditionIssues] = useState<{label: string, status: "checked" | "unchecked"}[]>(conditionIssues);
  const [quickSeverityOptions, setQuickSeverityOptions] = useState<{label: string, status: "checked" | "unchecked"}[]>(severityOptions);
  const [incidentTypeOptions, setIncidentTypeOptions] = useState<{label: string, status: "checked" | "unchecked"}[]>(incidentTypeData);
  const [incidentSeverityOptions, setIncidentSeverityOptions] = useState<{label: string, status: "checked" | "unchecked"}[]>(incidentSeverityData);
  const [isQuickFilterModified, setIsQuickFilterModified] = useState<boolean>(false);
  const [isIncidentFilterModified, setIsIncidentFilterModified] = useState<boolean>(false);
  const [isStatisticsViewVisible, setIsStatisticsViewVisible] = useState<boolean>(false);
  const [selectedStatisticsTab, setSelectedStatisticsTab] = useState<ReportType.SafetyPerception | ReportType.Quick | ReportType.Incident>(isSafeSafetyChecked ? ReportType.SafetyPerception : (isIncidentChecked ? ReportType.Incident : ReportType.Quick));
  const [quickStatPage, setQuickStatPage] = useState<number>(0);
  const [numberOfItemsPerQuickStatPageList] = useState([4, 5, 6]);
  const [itemsPerQuickStatPage, onItemsPerQuickStatPageChange] = useState(
    numberOfItemsPerQuickStatPageList[0]
  );

  const quickStatFrom = quickStatPage * itemsPerQuickStatPage;
  const quickStatTo = Math.min((quickStatPage + 1) * itemsPerQuickStatPage, Object.values(ConditionType).length);

  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);
  const mapRef = React.useRef<MapView>(null);
  const snapPoints = React.useMemo(() => ['50%', '85%'], []);

  const {isConnected} = useNetInfo();
  const {t} = useTranslation();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const user = useSelector(selectUser);
  const allReports = useSelector(selectReports);

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
    setIsStatisticsViewVisible(false);
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
    setIsStatisticsViewVisible(false);
    setIsMapTypeSelectViewVisible(false);
  }
  const handleToggleSafetyFilter = () => {
    setIsFullMap(true);
    setIsSafetyFilterVisible((old: boolean) => !old);
    setIsQuickFilterVisible(false);
    setIsIncidentFilterVisible(false);
    setIsReportSelectVisible(false);
    setIsStatisticsViewVisible(false);
    setIsMapTypeSelectViewVisible(false);
  }
  const handleToggleQuickFilter = () => {
    setIsFullMap(true);
    setIsQuickFilterVisible((old: boolean) => !old);
    setIsSafetyFilterVisible(false);
    setIsIncidentFilterVisible(false);
    setIsReportSelectVisible(false);
    setIsStatisticsViewVisible(false);
    setIsMapTypeSelectViewVisible(false);
  }
  const handleToggleIncidentFilter = () => {
    setIsFullMap(true);
    setIsIncidentFilterVisible((old: boolean) => !old);
    setIsSafetyFilterVisible(false);
    setIsQuickFilterVisible(false);
    setIsReportSelectVisible(false);
    setIsStatisticsViewVisible(false);
    setIsMapTypeSelectViewVisible(false);
  }

  const handleToggleStatisticsView = () => {
    setIsStatisticsViewVisible((old: boolean) => !old);
    setIsFullMap(true);
    setIsIncidentFilterVisible(false);
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

  const handleToggleIncidentType = (index: number) => {
    const updatedIncidentTypeOptions = [...incidentTypeOptions];
    updatedIncidentTypeOptions[index].status = updatedIncidentTypeOptions[index].status === "checked" ? "unchecked" : "checked";
    setIncidentTypeOptions(updatedIncidentTypeOptions);
    setIsIncidentFilterModified(true);
  }

  const handleToggleIncidentSeverity = (index: number) => {
    const updatedIncidentSeverityOptions = [...incidentSeverityOptions];
    updatedIncidentSeverityOptions[index].status = updatedIncidentSeverityOptions[index].status === "checked" ? "unchecked" : "checked";
    setIncidentSeverityOptions(updatedIncidentSeverityOptions);
    setIsIncidentFilterModified(true);
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
    setIsStatisticsViewVisible(false);
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
      const isDateInRange = reportDate >= quickStartDate && reportDate <= quickEndDate;
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
    setIsStatisticsViewVisible(false);
    setIsMapTypeSelectViewVisible(false);
    setFilteredQuickReports(filteredReports);
  }

  const handleIncidentFilter = () => {
    // Check if the start date is after the end date
    if (incidentStartDate > incidentEndDate) {
      setIsIncidentDateError(true);
      return;
    } else {
      setIsIncidentDateError(false);
    }

    const filteredReports = incidentReports.filter((report) => {
      const reportDate = new Date(report.createdAt);
      const isDateInRange = reportDate >= incidentStartDate && reportDate <= incidentEndDate;
      const isValidIncidentType = incidentTypeOptions.some((type, index) => {
        return type.status === "checked" && report.incidentType == type.label;
      });
      const isValidIncidentSeverity = incidentSeverityOptions.some((severity, index) => {
        return severity.status === "checked" && report.incidentTypeData?.severity == severity.label;
      });

      return (
        isDateInRange &&
        isValidIncidentType &&
        isValidIncidentSeverity
      );
    })

    // Update the state with the filtered reports
    setIsFullMap(true);
    setIsSafetyFilterVisible(false);
    setIsQuickFilterVisible(false);
    setIsIncidentFilterVisible(false);
    setIsReportSelectVisible(false);
    setIsSafetyFilterModified(false);
    setIsStatisticsViewVisible(false);
    setIsMapTypeSelectViewVisible(false);
    setFilteredIncidentReports(filteredReports);
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

  const handleMarkerReportPress = (report: SafetyPerceptionReport | QuickReport | IncidentReport) => {
    setCurrentOpenedReport(report);
    bottomSheetModalRef.current?.present();
  }


  // initialise all the reports
  useEffect(() => {
    setSafetyReports(allReports.filter((report: { userId: string; data: SafetyPerceptionReport | QuickReport | IncidentReport }) => (report?.data?.reportType == ReportType.SafetyPerception)).map((item: any) => item.data));
    setQuickReports(allReports.filter((report: { userId: string; data: SafetyPerceptionReport | QuickReport | IncidentReport }) => (report?.data?.reportType == ReportType.Quick)).map((item: any) => item.data));
    setIncidentReports(allReports.filter((report: { userId: string; data: SafetyPerceptionReport | QuickReport | IncidentReport }) => (report?.data?.reportType == ReportType.Incident)).map((item: any) => item.data));
    locateUser();
    handleSafetyFilter();
    handleQuickFilter();
    handleIncidentFilter();
  }, [allReports])

  useEffect(() => {
    //dispatch(clearReports(null)); // for development only
    dispatch(getAllReports());
    
  }, []);

  // update the default statistics view
  useEffect(() => {
    if (isSafeSafetyChecked) {
      setSelectedStatisticsTab(ReportType.SafetyPerception);
      return;
    }
    else if (isQuickChecked) {
      setSelectedStatisticsTab(ReportType.Quick);
      return;
    }
    else {
      setSelectedStatisticsTab(ReportType.Incident);
      return;
    }
    
  }, [isSafeSafetyChecked, isQuickChecked, isIncidentChecked])

  // update the quick stat stat view
  useEffect(() => {
    setQuickStatPage(0);
  }, [itemsPerQuickStatPage]);
  
  return (
    <SafeAreaView style={styles.container}>
      <Provider>
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
                labelStyle={{fontSize: 14}}
                status={isSafetyChecked ? 'checked' : 'unchecked'}
                onPress={() => setIsSafetyChecked(!isSafetyChecked)}/>
              <Checkbox.Item
                label={t("quickReport")}
                labelStyle={{fontSize: 14}}
                status={isQuickChecked ? 'checked' : 'unchecked'}
                onPress={() => setIsQuickChecked(!isQuickChecked)}/>
              <Checkbox.Item
                label={t("incidentReport")}
                labelStyle={{fontSize: 14}}
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
          <View style={{ position: "absolute", top: 64, left: 16, flexDirection: "row", gap: 8, justifyContent: "flex-start", width: "auto", height: "auto", zIndex: 99 }}>
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
                    labelStyle={{fontSize: 14}}
                    position='leading'
                    status={isPedestrianSafetyChecked ? "checked" : 'unchecked'}
                    onPress={handleTogglePedestrianSafety}/>
                  <Checkbox.Item
                    label={t("cyclist")}
                    labelStyle={{fontSize: 14}}
                    status={isCyclistSafetyChecked ? "checked" : 'unchecked'}
                    onPress={handleToggleCyclistSafety}/>
                </View>
                <View style={{ flexDirection: 'row', gap: 4, justifyContent: "space-between", width: "auto", height: "auto" }}>
                  <Checkbox.Item
                    label={t("motorcyclist")}
                    labelStyle={{fontSize: 14}}
                    position='leading'
                    status={isMotorcyclistSafetyChecked ? "checked" : 'unchecked'}
                    onPress={handleToggleMotocyclistSafety}/>
                  <Checkbox.Item
                    label={t("car")}
                    labelStyle={{fontSize: 14}}
                    status={isCarSafetyChecked ? "checked" : 'unchecked'}
                    onPress={handleToggleCarSafety}/>
                </View>
                <View style={{ flexDirection: 'row', gap: 4, justifyContent: "space-between", width: "auto", height: "auto" }}>
                  <Checkbox.Item
                    label={t("bus")}
                    labelStyle={{fontSize: 14}}
                    position='leading'
                    status={isBusSafetyChecked ? "checked" : 'unchecked'}
                    onPress={handleToggleBusSafety}/>
                  <Checkbox.Item
                    label={t("truck")}
                    labelStyle={{fontSize: 14}}
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
                    labelStyle={{fontSize: 14}}
                    status={isSafeSafetyChecked ? "checked" : "unchecked"}
                    onPress={handleToggleSafeSafety} />
                  <Checkbox.Item 
                    label={t("unsafe")} 
                    labelStyle={{fontSize: 14}}
                    status={isUnsafeSafetyChecked ? "checked" : "unchecked"}
                    onPress={handleToggleUnsafeSafety} />
                  <Checkbox.Item 
                    label={t("veryUnsafe")} 
                    labelStyle={{fontSize: 14}}
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
                {isQuickDateError && <TextBlock type={TextBlockTypeEnum.body} style={{color: "red"}}>{t("dateError")}</TextBlock>}
                <Spacer variant="large" />
                <TextBlock type={TextBlockTypeEnum.title}>{t('selectSeverityLevel')}</TextBlock>
                <View style={{ justifyContent: "flex-start", width: "auto", height: "auto" }}>
                  {quickSeverityOptions.map((severity, index) => (
                    <Checkbox.Item 
                      key={index}
                      label={severity.label}
                      labelStyle={{fontSize: 14}}
                      status={severity.status}
                      onPress={(e) => handleToggleQuickSeverity(index)} />
                  ))}
                </View>
                <Spacer variant="large" />
                <TextBlock type={TextBlockTypeEnum.title}>{t('selectConditionType')}</TextBlock>
                <ScrollView style={{ maxHeight: 150 }}>
                  {quickConditionIssues.map((condition, index) => (
                    <Checkbox.Item
                      key={index}
                      label={condition.label}
                      labelStyle={{fontSize: 14}}
                      status={condition.status}
                      onPress={(e) => handleToggleQuickConditionIssue(index)}
                    />
                  ))}
                </ScrollView>
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
              <View style={{ backgroundColor: Colors.light.background.quinary, borderRadius: 8, padding: 12, bottom: 100, width: "auto", height: "auto", maxWidth: 300 }}>
                <TextBlock type={TextBlockTypeEnum.title}>{t('defineFilter')}</TextBlock>
                <TextBlock type={TextBlockTypeEnum.title}>{t('selectDateInterval')}</TextBlock>
                <Spacer variant="medium" />
                <View style={{ flexDirection: "row", gap: 64, justifyContent: "flex-start", width: "auto", height: "auto" }}>
                  <DateInput
                    placeholder={t("startDate")}
                    date={incidentStartDate}
                    setDate={setIncidentStartDate}
                    mode={"date"}
                    onChange={() => setIsIncidentFilterModified(true)}
                  />
                  <DateInput
                    placeholder={t("endDate")}
                    date={incidentEndDate}
                    setDate={setIncidentEndDate}
                    mode={"date"}
                    onChange={() => setIsIncidentFilterModified(true)}
                  />
                </View>
                {isIncidentDateError && <TextBlock type={TextBlockTypeEnum.body} style={{color: "red"}}>{t("dateError")}</TextBlock>}
                <Spacer variant="large" />
                <TextBlock type={TextBlockTypeEnum.title}>{t('selectIncidentType')}</TextBlock>
                <View>
                  {incidentTypeOptions.map((type, index) => (
                    <Checkbox.Item
                      key={index}
                      label={type.label}
                      labelStyle={{fontSize: 14}}
                      status={type.status}
                      onPress={(e) => handleToggleIncidentType(index)}
                    />
                  ))}
                </View>
                <Spacer variant="large" />
                <TextBlock type={TextBlockTypeEnum.title}>{t('selectIncidentSeverity')}</TextBlock>
                <View>
                  {incidentSeverityOptions.map((severity, index) => (
                    <Checkbox.Item
                      key={index}
                      label={severity.label}
                      labelStyle={{fontSize: 14}}
                      status={severity.status}
                      onPress={(e) => handleToggleIncidentSeverity(index)}
                    />
                  ))}
                </View>
                <Spacer variant="large" />
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <ButtonAction
                    variant={ButtonTypeEnum.secondary}
                    content={<TextBlock type={TextBlockTypeEnum.body} style={{paddingHorizontal: 30, paddingVertical: 4}}>{t("close")}</TextBlock>}
                    onPress={handleToggleIncidentFilter}/>
                  <ButtonAction
                    variant={ButtonTypeEnum.primary}
                    content={<TextBlock type={TextBlockTypeEnum.body} style={{color: "white", paddingHorizontal: 30, paddingVertical: 4}}>{t("apply")}</TextBlock>}
                    disabled={!isIncidentFilterModified}
                    onPress={handleIncidentFilter}/>
                </View>
              </View>
            )}
          </View>
        )}

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
                    <RadioButton.Item label={t("satellite")} labelStyle={{fontSize: 14}} value={MAP_TYPES.SATELLITE} />
                    <RadioButton.Item label={t("standard")} labelStyle={{fontSize: 14}} value={MAP_TYPES.STANDARD} />
                    <RadioButton.Item label={t("terrain")} labelStyle={{fontSize: 14}} value={MAP_TYPES.TERRAIN} />
                  </View>
              </RadioButton.Group>
            </View>
          )}
        </View>

        {/* Show the filter statistics of the reports selected */}
        {(isSafetyChecked || isIncidentChecked || isQuickChecked) && (
          <View style={{ position: "absolute", bottom: 64, left: 16, flexDirection: "row", alignItems: "flex-end", gap: 8, zIndex: 99 }}>
            <TouchableOpacity
              style={{backgroundColor: isStatisticsViewVisible ? Colors.light.background.primary : Colors.light.background.quinary, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12, height: 40 }}
              onPress={handleToggleStatisticsView}>
              <Octicons name="number" size={24} color={isStatisticsViewVisible ? "white" : "black"} />
            </TouchableOpacity>

            {isStatisticsViewVisible && (
              <View style={{ backgroundColor: Colors.light.background.quinary, borderRadius: 8, padding: 12, gap: 8, width: "100%", height: "auto", zIndex: 99, maxWidth: 0.8*Dimensions.get('window').width }}>
                <TextBlock type={TextBlockTypeEnum.title}>{t('visualizeYourData')}</TextBlock>
                <View style={{flexDirection: 'row'}}>
                  {isSafeSafetyChecked && (
                    <TouchableOpacity
                      onPress={() => setSelectedStatisticsTab(ReportType.SafetyPerception)}
                      style={{borderBottomColor: selectedStatisticsTab == ReportType.SafetyPerception ? Colors.light.background.primary : undefined, borderBottomWidth: selectedStatisticsTab == ReportType.SafetyPerception ? 4 : undefined, marginHorizontal: 4, padding: 4}}>
                      <TextBlock style={{color: selectedStatisticsTab == ReportType.SafetyPerception ? Colors.light.background.primary : undefined }}>Safety Perception</TextBlock>
                    </TouchableOpacity>
                  )}
                  {isQuickChecked && (
                    <TouchableOpacity
                      onPress={() => setSelectedStatisticsTab(ReportType.Quick)}
                      style={{borderBottomColor: selectedStatisticsTab == ReportType.Quick ? Colors.light.background.primary : undefined, borderBottomWidth: selectedStatisticsTab == ReportType.Quick? 4 : undefined, marginHorizontal: 4, padding: 4}}>
                      <TextBlock style={{color: selectedStatisticsTab == ReportType.Quick ? Colors.light.background.primary : undefined }}>Quick</TextBlock>
                    </TouchableOpacity>
                  )}
                  {isIncidentChecked && (
                    <TouchableOpacity
                      onPress={() => setSelectedStatisticsTab(ReportType.Incident)}
                      style={{borderBottomColor: selectedStatisticsTab == ReportType.Incident ? Colors.light.background.primary : undefined, borderBottomWidth: selectedStatisticsTab == ReportType.Incident ? 4 : undefined, marginHorizontal: 4, padding: 4}}>
                      <TextBlock style={{color: selectedStatisticsTab == ReportType.Incident ? Colors.light.background.primary : undefined }}>Incident</TextBlock>
                    </TouchableOpacity>
                  )}
                </View>
                {selectedStatisticsTab == ReportType.SafetyPerception && (
                  <View>
                    <DataTable>
                      <DataTable.Header>
                        <DataTable.Title textStyle={{fontSize: 12}}>User</DataTable.Title>
                        <DataTable.Title textStyle={{fontSize: 12}} numeric>{t('safe')}</DataTable.Title>
                        <DataTable.Title textStyle={{fontSize: 12}} numeric>{t('unsafe')}</DataTable.Title>
                        <DataTable.Title textStyle={{fontSize: 12}} numeric>{t('veryUnsafe')}</DataTable.Title>
                        <DataTable.Title textStyle={{fontSize: 12}} numeric>{t('total')}</DataTable.Title>
                      </DataTable.Header>

                      {Object.values(UserType).map(val => {
                        return {
                          name: val.toString(),
                          safe: filteredSafetyReports.filter(rep => (rep.safetyLevel == SafetyLevel.Safe) && (rep.userType == val)).length,
                          unSafe: filteredSafetyReports.filter(rep => (rep.safetyLevel == SafetyLevel.unSafe) && (rep.userType == val)).length,
                          veryUnsafe: filteredSafetyReports.filter(rep => (rep.safetyLevel == SafetyLevel.veryUnsafe) && (rep.userType == val)).length,
                          total: filteredSafetyReports.filter(rep => rep.userType == val).length
                        }
                      }).map((item, key) => (
                        <DataTable.Row key={key}>
                          <DataTable.Cell textStyle={{fontSize: 12}}>{item.name}</DataTable.Cell>
                          <DataTable.Cell textStyle={{fontSize: 12}} numeric>{item.safe}</DataTable.Cell>
                          <DataTable.Cell textStyle={{fontSize: 12}} numeric>{item.unSafe}</DataTable.Cell>
                          <DataTable.Cell textStyle={{fontSize: 12}} numeric>{item.veryUnsafe}</DataTable.Cell>
                          <DataTable.Cell textStyle={{fontSize: 12}} numeric>{item.total}</DataTable.Cell>
                        </DataTable.Row>
                      ))}

                      <DataTable.Pagination
                        page={0}
                        numberOfPages={1}
                        onPageChange={() => {}}
                      />
                    </DataTable>
                    <Spacer variant='medium' />
                    <TextBlock type={TextBlockTypeEnum.title}>Total reports: {filteredSafetyReports.length}</TextBlock>
                  </View>
                )}
                {selectedStatisticsTab == ReportType.Quick && (
                  <View>
                    <DataTable>
                      <DataTable.Header>
                        <DataTable.Title textStyle={{fontSize: 12}}>Condition</DataTable.Title>
                        <DataTable.Title textStyle={{fontSize: 12}} numeric>{t('total')}</DataTable.Title>
                      </DataTable.Header>

                      {Object.values(ConditionType).map(val => {
                        return {
                          name: val.toString(),
                          total: filteredQuickReports.filter(rep => (rep.conditionType == val)).length,
                        }
                      }).slice(quickStatFrom, quickStatTo).map((item, key) => (
                        <DataTable.Row key={key}>
                          <DataTable.Cell textStyle={{fontSize: 12}}>{item.name}</DataTable.Cell>
                          <DataTable.Cell textStyle={{fontSize: 12}} numeric>{item.total}</DataTable.Cell>
                        </DataTable.Row>
                      ))}

                      <DataTable.Pagination
                        page={quickStatPage}
                        numberOfPages={Math.ceil(Object.values(ConditionType).length / itemsPerQuickStatPage)}
                        onPageChange={(page) => setQuickStatPage(page)}
                        label={`${quickStatFrom + 1}-${quickStatTo} of ${Object.values(ConditionType).length}`}
                        numberOfItemsPerPageList={numberOfItemsPerQuickStatPageList}
                        numberOfItemsPerPage={itemsPerQuickStatPage}
                        onItemsPerPageChange={onItemsPerQuickStatPageChange}
                        showFastPaginationControls
                        selectPageDropdownLabel={'Rows per page'}
                      />
                    </DataTable>
                    <Spacer variant='medium' />
                    <TextBlock type={TextBlockTypeEnum.title}>Total reports: {filteredQuickReports.length}</TextBlock>
                  </View>
                )}
                {selectedStatisticsTab == ReportType.Incident && (
                  <View>
                    <DataTable>
                      <DataTable.Header>
                        <DataTable.Title textStyle={{fontSize: 12}}>Report type</DataTable.Title>
                        <DataTable.Title textStyle={{fontSize: 12}} numeric>{t('total')}</DataTable.Title>
                      </DataTable.Header>

                      {Object.values(IncidentType).map(val => {
                        return {
                          name: val.toString(),
                          total: filteredIncidentReports.filter(rep => (rep.incidentType == val)).length,
                        }
                      }).map((item, key) => (
                        <DataTable.Row key={key}>
                          <DataTable.Cell textStyle={{fontSize: 12}}>{item.name}</DataTable.Cell>
                          <DataTable.Cell textStyle={{fontSize: 12}} numeric>{item.total}</DataTable.Cell>
                        </DataTable.Row>
                      ))}

                      <DataTable.Pagination
                        page={0}
                        numberOfPages={1}
                        onPageChange={() => {}}
                      />
                    </DataTable>
                    <Spacer variant='medium' />
                    <TextBlock type={TextBlockTypeEnum.title}>Total reports: {filteredIncidentReports.length}</TextBlock>
                  </View>
                )}
              </View>
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
        {isSafetyChecked && filteredSafetyReports.map((report, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: report.latitude,
              longitude: report.longitude
            }}
            title={"Safety Report"}
            description={report.comment}
            onPress={() => handleMarkerReportPress(report)}
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
        {isQuickChecked && filteredQuickReports.map((report, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: report.latitude,
              longitude: report.longitude
            }}
            title={'Quick Report'}
            description={report.comment}
            onPress={() => handleMarkerReportPress(report)}>
              <View style={{justifyContent: "center", alignItems: "center", backgroundColor: "white", borderRadius: 8}}>
                {report.conditionType === ConditionType.BusStopAndStation && <Image source={require("../../assets/images/conditionTypes/busStopAndStation.png")} style={{width: 40, height: 40}} resizeMode='contain' resizeMethod="resize" />}
                {report.conditionType === ConditionType.CrosswalksAndPedestrian && <Image source={require("../../assets/images/conditionTypes/crosswalksAndPedestrian.png")} style={{width: 40, height: 40}} resizeMode='contain' />}
                {report.conditionType === ConditionType.DrainageIssues && <Image source={require("../../assets/images/conditionTypes/drainageIssues.png")} style={{width: 40, height: 40}} resizeMode='contain' />}
                {report.conditionType === ConditionType.ParkingAreas && <Image source={require("../../assets/images/conditionTypes/parkingAreas.png")} style={{width: 40, height: 40}} resizeMode='contain' />}
                {report.conditionType === ConditionType.PavementCondition && <Image source={require("../../assets/images/conditionTypes/pavementCondition.png")} style={{width: 40, height: 40}} resizeMode='contain' />}
                {report.conditionType === ConditionType.RoadGeometry && <Image source={require("../../assets/images/conditionTypes/roadGeometry.png")} style={{width: 40, height: 40}} resizeMode='contain' />}
                {report.conditionType === ConditionType.RoadSignage && <Image source={require("../../assets/images/conditionTypes/roadSignage.png")} style={{width: 40, height: 40}} resizeMode='contain' />}
                {report.conditionType === ConditionType.RoadsideObstacles && <Image source={require("../../assets/images/conditionTypes/roadsideObstacles.png")} style={{width: 40, height: 40}} resizeMode='contain' />}
                {report.conditionType === ConditionType.SidewalkCondition && <Image source={require("../../assets/images/conditionTypes/sidewalkCondition.png")} style={{width: 40, height: 40}} resizeMode='contain' />}
                {report.conditionType === ConditionType.StreetLighting && <Image source={require("../../assets/images/conditionTypes/streetLighting.png")} style={{width: 40, height: 40}} resizeMode='contain' />}
                {report.conditionType === ConditionType.TrafficControlDevices && <Image source={require("../../assets/images/conditionTypes/trafficControlDevices.png")} style={{width: 40, height: 40}} resizeMode='contain' />}
                {report.conditionType === ConditionType.TrafficSigns && <Image source={require("../../assets/images/conditionTypes/trafficSigns.png")} style={{width: 40, height: 40}} resizeMode='contain' />}
              </View>
            </Marker>
        ))}
        {isIncidentChecked && filteredIncidentReports.map((report, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: report.latitude,
              longitude: report.longitude
            }}
            title={'Incident Report'}
            description={report.comment}
            onPress={() => handleMarkerReportPress(report)}>
              <View style={{justifyContent: "center", alignItems: "center", backgroundColor: "white", borderRadius: 8}}>
                {report.incidentType === IncidentType.Crash && <Image source={require("../../assets/images/incidentTypes/crash.png")} style={{width: 40, height: 40}} resizeMode='contain' />}
                {report.incidentType === IncidentType.Equipment && <Image source={require("../../assets/images/incidentTypes/equipment.png")} style={{width: 40, height: 40}} resizeMode='contain' />}
                {report.incidentType === IncidentType.Infrastructure && <Image source={require("../../assets/images/incidentTypes/infrastructure.png")} style={{width: 40, height: 40}} resizeMode='contain' />}
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
                  <TextBlock type={TextBlockTypeEnum.body}>{t("createdAt")}: {new Date((currentOpenedReport as SafetyPerceptionReport).createdAt).toLocaleTimeString(user?.localisation, {weekday: "short", year: "numeric", month: "long", day: "numeric",})}</TextBlock>
                  <Spacer variant="medium" />
                  <TextBlock type={TextBlockTypeEnum.body}>{t("roadType")}: {(currentOpenedReport as SafetyPerceptionReport).roadType}</TextBlock>
                  <Spacer variant="medium" />
                  <TextBlock type={TextBlockTypeEnum.body}>{t("comment")}: {(currentOpenedReport as SafetyPerceptionReport).comment}</TextBlock>
                  <Spacer variant="medium" />
                  <Spacer variant="large" />
                  <View style={{ flexDirection: "row", gap: 8, justifyContent: "flex-start", width: "auto", height: "auto" }}>
                    {(currentOpenedReport as SafetyPerceptionReport).images.map((image, index) => (
                      <Image
                        key={index}
                        source={{ uri: 'data:image/jpeg;base64,' + image.base64 }}
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
                  <TextBlock type={TextBlockTypeEnum.body}>{t("createdAt")}: {new Date((currentOpenedReport as QuickReport).createdAt).toLocaleTimeString(user?.localisation, {weekday: "short", year: "numeric", month: "long", day: "numeric",})}</TextBlock>
                  <Spacer variant="medium" />
                  <TextBlock type={TextBlockTypeEnum.body}>{t("comment")}: {(currentOpenedReport as QuickReport).comment}</TextBlock>
                  <Spacer variant="medium" />
                  <Spacer variant="large" />
                  <View style={{ flexDirection: "row", gap: 8, justifyContent: "flex-start", width: "auto", height: "auto" }}>
                    {(currentOpenedReport as QuickReport).images.map((image, index) => (
                      <Image
                        key={index}
                        source={{ uri: 'data:image/jpeg;base64,' + image.base64 }}
                        style={{ width: 150, height: 150, borderRadius: 8, marginBottom: 8 }}
                      />
                    ))}
                  </View>
                </View>
              )}

              {currentOpenedReport.reportType === ReportType.Incident && (
                <View>
                  <TextBlock type={TextBlockTypeEnum.h4} style={{fontWeight: '700'}}>{t("incidentReport")}</TextBlock>
                  <Spacer variant="medium" />
                  <Spacer variant="large" />
                  <TextBlock type={TextBlockTypeEnum.body}>{t("incidentType")}: {(currentOpenedReport as IncidentReport).incidentType}</TextBlock>
                  <Spacer variant="medium" />
                  <TextBlock type={TextBlockTypeEnum.body}>{t("createdAt")}: {new Date((currentOpenedReport as IncidentReport).createdAt).toLocaleTimeString(user?.localisation, {weekday: "short", year: "numeric", month: "long", day: "numeric",})}</TextBlock>
                  <Spacer variant="medium" />
                  {(currentOpenedReport as IncidentReport).incidentType == IncidentType.Crash && (
                    <>
                      <TextBlock type={TextBlockTypeEnum.body}>{t("incidentTypeData")}: {(currentOpenedReport as IncidentReport).incidentTypeData?.severity}</TextBlock>
                      <Spacer variant="medium" />
                      <TextBlock type={TextBlockTypeEnum.body}>{t("incidentTypeData")}: {((currentOpenedReport as IncidentReport).incidentTypeData as IncidentCrashData)?.count.map((item) => `${item.type}: ${item.number}`).join(",\n ")}</TextBlock>
                      <Spacer variant="medium" />
                    </>
                  )}
                  {(currentOpenedReport as IncidentReport).incidentType == IncidentType.Infrastructure && (
                    <>
                      <TextBlock type={TextBlockTypeEnum.body}>{t("incidentTypeData")}: {(currentOpenedReport as IncidentReport).incidentTypeData?.severity}</TextBlock>
                      <Spacer variant="medium" />
                      <TextBlock type={TextBlockTypeEnum.body}>{t("incidentTypeData")}: {((currentOpenedReport as IncidentReport).incidentTypeData as IncidentInfrastructureData)?.reasons.join(",\n ")}</TextBlock>
                      <Spacer variant="medium" />
                    </>
                  )}
                  {(currentOpenedReport as IncidentReport).incidentType == IncidentType.Equipment && (
                    <>
                      <TextBlock type={TextBlockTypeEnum.body}>{t("incidentTypeData")}: {(currentOpenedReport as IncidentReport).incidentTypeData?.severity}</TextBlock>
                      <Spacer variant="medium" />
                      <TextBlock type={TextBlockTypeEnum.body}>{t("incidentTypeData")}: {((currentOpenedReport as IncidentReport).incidentTypeData as IncidentEquipmentData)?.reasons.join(",\n ")}</TextBlock>
                      <Spacer variant="medium" />
                    </>
                  )}
                  <Spacer variant="medium" />
                  <TextBlock type={TextBlockTypeEnum.body}>{t("incidentDescription")}: {(currentOpenedReport as IncidentReport).description}</TextBlock>
                  <Spacer variant="medium" />
                  <TextBlock type={TextBlockTypeEnum.body}>{t("comment")}: {(currentOpenedReport as IncidentReport).comment}</TextBlock>
                  <Spacer variant="large" />
                  <View style={{ flexDirection: "row", gap: 8, justifyContent: "flex-start", width: "auto", height: "auto" }}>
                    {(currentOpenedReport as IncidentReport).images.map((image, index) => (
                      <Image
                        key={index}
                        source={{ uri: 'data:image/jpeg;base64,' + image.base64 }}
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
      </Provider>
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
