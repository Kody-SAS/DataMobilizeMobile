import { Alert, GestureResponderEvent, Image, Linking, ScrollView, StyleSheet, Touchable, TouchableOpacity, View } from "react-native";
import { TextBlock } from "../../components/TextBlock";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Colors } from "../../constants/Colors";
import { useEffect, useState } from "react";
import { requestForegroundPermissionsAsync } from "expo-location";
import { useTranslation } from "react-i18next";
import { ButtonTypeEnum, ConditionType, IncidentSeverity, IncidentReport, IncidentType, QuickReport, ReasonType, ReportType, RoadType, SafetyLevel, SafetyPerceptionReport, SeverityLevel, TextBlockTypeEnum, UserType } from "../../type.d";
import { LocationCard } from "../../components/LocationCard";
import { Spacer } from "../../components/Spacer";
import { SelectedOption, SelectInput } from "../../components/SelectInput";
import { DateInput } from "../../components/DateInput";
import { Checkbox, Modal, PaperProvider, Portal, RadioButton, TextInput } from "react-native-paper";
import { conditionListData, safetyLevelReasons } from "../../utils/DataSeed";
import * as ImagePicker from 'expo-image-picker';
import { ButtonAction } from "../../components/ButtonAction";
import * as Location from 'expo-location';
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/accountSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { addSafetyPerceptionReport, addQuickReport } from "../../redux/slices/mapSlice";
import { isValidReport } from "../../utils/Validation";

export default function Report() {
    const [roadType, setRoadType] = useState<SelectedOption>();
    const [conditionType, setConditionType] = useState<SelectedOption>();
    const [userType, setUserType] = useState<SelectedOption>();
    const [date, setDate] = useState<Date>(new Date(Date.now()));
    const [safety, setSafety] = useState<string>();
    const [incidentType, setIncidentType] = useState<string>();
    const [severity, setSeverity] = useState<string>();
    const [safetyReasons, setSafetyReasons] = useState<{type: ReasonType, list: string[]}[]>([]);
    const [isSafetyModalVisible, setIsSafetyModalVisible] = useState<boolean>(false);
    const [isIncidentTypeModalVisible, setIsIncidentTypeModalVisible] = useState<boolean>(false);
    const [isConditionListModalVisible, setIsConditionListModalVisible] = useState<boolean>(false);
    const [conditionItem, setConditionItem] = useState<string>("");
    const [reportImages, setReportImages] = useState<string[]>([]);
    const [reportError, setReportError] = useState<string>("");
    const [incidentPedestrianNumber, setIncidentPedestrianNumber] = useState<number>(0);
    const [incidentCyclistNumber, setIncidentCyclistNumber] = useState<number>(0);
    const [incidentMotocyclistNumber, setIncidentMotocyclistNumber] = useState<number>(0);
    const [incidentCarNumber, setIncidentCarNumber] = useState<number>(0);
    const [incidentTruckNumber, setIncidentTruckNumber] = useState<number>(0);
    const [incidentBusNumber, setIncidentBusNumber] = useState<number>(0);
    const [incidentCrashSeverity, setIncidentCrashSeverity] = useState<string>();

    const {type} = useLocalSearchParams();
    const {t} = useTranslation();
    const navigation = useNavigation();
    const user = useSelector(selectUser);
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

    const canUserReport = async() => {
        const request = await requestForegroundPermissionsAsync();

        if (request == null) {
            Alert.alert(
                t("error"),
                t("requiresLocationPermessionForReport"),
                [
                    {
                        text: t("goBack"),
                        onPress: () => router.back(),
                    },
                    {
                        text: t("addPermission"),
                        onPress: () => Linking.openSettings(),
                        style: 'cancel',
                    }
                ],
                {
                    cancelable: false
                }
            )
        }
    }

    const changeScreenTitle = () => {
        switch(type) {
            case ReportType.SafetyPerception.toString() : {
                navigation.setOptions({
                    title: t("safetyPerceptionReport")
                });
                break;
            }
            case ReportType.Quick.toString() : {
                navigation.setOptions({
                    title: t("quickReport")
                });
                break;
            }
            case ReportType.Incident.toString() : {
                navigation.setOptions({
                    title: t("incidentReport")
                });
                break;
            }
            case ReportType.Audit.toString() : {
                navigation.setOptions({
                    title: t("auditReport")
                });
                break;
            }
            default: {
                router.replace("/(tabs)/")
                break;
            }
        }
    }

    const roadTypeData : SelectedOption[] = [
        {
            content: t("busStation"),
            imageUrl: require("../../assets/images/intersection.png"),
            data: {type: RoadType.BusStation}
        },
        {
            content: t("busStop"),
            imageUrl: require("../../assets/images/section.png"),
            data: {type: RoadType.BusStop}
        },
        {
            content: t("highway"),
            imageUrl: require("../../assets/images/roundabout.png"),
            data: {type: RoadType.Highway}
        },
        {
            content: t("parkingLot"),
            imageUrl: require("../../assets/images/straight.png"),
            data: {type: RoadType.ParkingLot}
        },
        {
            content: t("roundAbout"),
            imageUrl: require("../../assets/images/turn.png"),
            data: {type: RoadType.RoundAbout}
        },
        {
            content: t("ruralRoad"),
            imageUrl: require("../../assets/images/turn.png"),
            data: {type: RoadType.RuralRoad}
        },
        {
            content: t("signalizedIntersection"),
            imageUrl: require("../../assets/images/turn.png"),
            data: {type: RoadType.SignalizedIntersection}
        },
        {
            content: t("unsignalizedIntersection"),
            imageUrl: require("../../assets/images/turn.png"),
            data: {type: RoadType.UnsignalizedIntersection}
        },
        {
            content: t("urbanRoad"),
            imageUrl: require("../../assets/images/turn.png"),
            data: {type: RoadType.UrbanRoad}
        },
    ]

    const userTypeData : SelectedOption[] = [
        {
            content: t("pedestrian"),
            imageUrl: require("../../assets/images/pedestrian.png"),
            data: {type: UserType.Pedestrian}
        },
        {
            content: t("cyclist"),
            imageUrl: require("../../assets/images/cyclist.png"),
            data: {type: UserType.Cyclist}
        },
        {
            content: t("motocyclist"),
            imageUrl: require("../../assets/images/motocyclist.png"),
            data: {type: UserType.Motocyclist}
        },
        {
            content: t("car"),
            imageUrl: require("../../assets/images/car.png"),
            data: {type: UserType.Car}
        },
        {
            content: t("truck"),
            imageUrl: require("../../assets/images/truck.png"),
            data: {type: UserType.Truck}
        },
        {
            content: t("bus"),
            imageUrl: require("../../assets/images/bus.png"),
            data: {type: UserType.Bus}
        },
    ]

    const conditionTypeData : SelectedOption[] = [
        {
            content: ConditionType.BusStopAndStation.toString(),
            data: {type: ConditionType.BusStopAndStation}
        },
        {
            content: ConditionType.CrosswalksAndPedestrian.toString(),
            data: {type: ConditionType.CrosswalksAndPedestrian}
        },
        {
            content: ConditionType.DrainageIssues.toString(),
            data: {type: ConditionType.DrainageIssues}
        },
        {
            content: ConditionType.ParkingAreas.toString(),
            data: {type: ConditionType.ParkingAreas}
        },
        {
            content: ConditionType.PavementCondition.toString(),
            data: {type: ConditionType.PavementCondition}
        },
        {
            content: ConditionType.RoadGeometry.toString(),
            data: {type: ConditionType.RoadGeometry}
        },
        {
            content: ConditionType.RoadSignage.toString(),
            data: {type: ConditionType.RoadSignage}
        },
        {
            content: ConditionType.RoadsideObstacles.toString(),
            data: {type: ConditionType.RoadsideObstacles}
        },
        {
            content: ConditionType.SidewalkCondition.toString(),
            data: {type: ConditionType.SidewalkCondition}
        },
        {
            content: ConditionType.StreetLighting.toString(),
            data: {type: ConditionType.StreetLighting}
        },
        {
            content: ConditionType.TrafficControlDevices.toString(),
            data: {type: ConditionType.TrafficControlDevices}
        },
        {
            content: ConditionType.TrafficSigns.toString(),
            data: {type: ConditionType.TrafficSigns}
        }
    ]

    const handleSafetyLevelSelection = (value: string) => {
        setIsSafetyModalVisible(true);
        setSafety(value);
    }

    const handleIncidentTypeSelection = (value: string) => {
        setIncidentType(value);
        setIsIncidentTypeModalVisible(true);
    }

    const handleIncidentCrashSeveritySelection = (value: string) => {
        setIncidentCrashSeverity(value);
        setIsIncidentTypeModalVisible(false);
    }

    const handleSeverityLevelSelection = (value: string) => {
        setSeverity(value);
    }

    const handleConditionTypeSelection = () => {
        setIsConditionListModalVisible(true);
    }

    const handleConditionItemSelection = (value: string) => {
        setConditionItem(value);
        setIsConditionListModalVisible(false);
    }

    const handleSafetyReasonPressed = (e: GestureResponderEvent, type: ReasonType, selectedReason: string) => {
        let existingReasons = [...safetyReasons];

        safetyReasons.forEach((item) => {
            if (item.type == type) {
                if (!item.list.includes(selectedReason)) {
                    const newList = [...item.list, selectedReason];
                    const currentIndex = safetyReasons.indexOf(item);
                    existingReasons.splice(currentIndex, 1, {type: type, list: newList});
                }
                else {
                    const newList = item.list.filter(item => item != selectedReason);
                    const currentIndex = safetyReasons.indexOf(item);
                    existingReasons.splice(currentIndex, 1, {type: type, list: newList});
                }
            }
        })

        setSafetyReasons(existingReasons);

        const notFoundReasons = existingReasons.filter(item => item.type == type);

        if (notFoundReasons.length == 0) {
            setSafetyReasons([...existingReasons, {type: type, list: [selectedReason]}]);
        }
    }

    const handleAddImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            quality: 0.3,
        });

        console.log(result);

        if (!result.canceled) {
            if(!reportImages.includes(result.assets[0].uri)) setReportImages([...reportImages, result.assets[0].uri]);
        }
    };

    const handleDeleteImage = (selectedImage: string) => {
        Alert.alert(
            t("warning"),
            t("deleteImageRequest"),
            [
                {
                    text: t("cancel"),
                    onPress: () => {},
                    style: 'cancel'
                },
                {
                    text: t("delete"),
                    onPress: () => {
                        const newList = reportImages.filter(item => item != selectedImage);
                        setReportImages(newList);
                    },
                    style: 'destructive',
                }
            ],
            {
                cancelable: true
            }
        )
    };

    const locateUser = async() => {
        const location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Balanced});
        return location ?? null;
    }

    const handleAddReport = async () => {
        switch(type) {
            case ReportType.SafetyPerception.toString() : {
                const location = await locateUser();
                if(location != null) {
                    const report : SafetyPerceptionReport = {
                        id: user.id + Math.random().toString(),
                        userId: user.id!,
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        createdAt: date,
                        roadType: roadType?.data.type as RoadType,
                        userType: userType?.data.type as UserType,
                        safetyLevel: safety as SafetyLevel,
                        reportType: ReportType.SafetyPerception,
                        reasons: safetyReasons,
                        images: reportImages
                    }

                    if(isValidReport(report, ReportType.SafetyPerception)) {
                        dispatch(addSafetyPerceptionReport(report));
                        setReportError("");
                        router.back();
                    }
                    else {
                        setReportError(t("reportError"));
                    }
                }
                break;
            }
            case ReportType.Quick.toString() : {
                const location = await locateUser();
                if(location != null) {
                    const report : QuickReport = {
                        id: user.id,
                        userId: user.id!,
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        createdAt: date,
                        roadType: roadType?.data.type as RoadType,
                        conditionType: conditionType?.data.type as ConditionType,
                        conditionDescription: conditionItem,
                        severityLevel: severity as SeverityLevel,
                        reportType: ReportType.SafetyPerception,
                        images: reportImages
                    }

                    if(isValidReport(report, ReportType.Quick)) {
                        dispatch(addQuickReport(report));
                        setReportError("");
                        router.back();
                    }
                    else {
                        setReportError(t("reportError"));
                    }
                }
                break;
            }
            case ReportType.Incident.toString() : {
                const location = await locateUser();
                if(location != null) {
                    const report : IncidentReport = {
                        id: user.id,
                        userId: user.id!,
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        createdAt: date,
                        roadType: roadType?.data.type as RoadType,
                        incidentType: incidentType as IncidentType,
                        reportType: ReportType.Incident,
                        description: "",
                        images: reportImages
                    }
                    if(incidentType == IncidentType.Crash) {
                        report.incidentTypeData = {
                            severity: incidentCrashSeverity as IncidentSeverity,
                            count: [
                                { type: UserType.Pedestrian, number: incidentPedestrianNumber },
                                { type: UserType.Cyclist, number: incidentCyclistNumber },
                                { type: UserType.Motocyclist, number: incidentMotocyclistNumber },
                                { type: UserType.Car, number: incidentCarNumber },
                                { type: UserType.Truck, number: incidentTruckNumber },
                                { type: UserType.Bus, number: incidentBusNumber }
                            ]
                        }
                    }

                    if(isValidReport(report, ReportType.Quick)) {
                        dispatch(addQuickReport(report));
                        setReportError("");
                        router.back();
                    }
                    else {
                        setReportError(t("reportError"));
                    }
                }
                break;
            }
            case ReportType.Audit.toString() : {
                router.back();
                break;
            }
            default: 
                break;
        }
    };

    // change screen title
    useEffect(() => {
        changeScreenTitle();
    }, [])

    // can user create a report ?
    useEffect(() => {
        canUserReport();
    }, [])

    // only accept report types
    useEffect(() => {
        if (Object.values(ReportType).indexOf(type as ReportType) < 0) router.back();
    }, [])

    return (
        <PaperProvider>
        <ScrollView style={styles.container}>
            {(type == ReportType.SafetyPerception.toString() || type == ReportType.Quick.toString() || type == ReportType.Incident.toString()) && (
                <>
                    <LocationCard />
                    <Spacer variant="large" />
                    <Spacer variant="medium" />
                </>
            )}
            {(type == ReportType.SafetyPerception.toString() || type == ReportType.Quick.toString() || type == ReportType.Incident.toString()) && (
                <>
                    {/* The road type */}
                    <SelectInput
                        title={t("chooseRoadType")}
                        selectedInput={roadType}
                        setSelectedInput={setRoadType}
                        selectionList={roadTypeData}
                        buttonText={t("change")}
                    />
                    <Spacer variant="large" />
                    <Spacer variant="medium" />
                </>
            )}
            {(type == ReportType.SafetyPerception.toString() || type == ReportType.Quick.toString() || type == ReportType.Incident.toString()) && (
                <>
                    <DateInput
                        date={date}
                        setDate={setDate}
                    />
                    <Spacer variant="large" />
                    <Spacer variant="medium" />
                </>
            )}
            {type == ReportType.Quick.toString() && (
                <>
                    {/* Choosing the condition type */}
                    <SelectInput
                        title={t("chooseConditionType")}
                        selectedInput={conditionType}
                        setSelectedInput={setConditionType}
                        selectionList={conditionTypeData}
                        buttonText={t("change")}
                        onInputSelect={handleConditionTypeSelection}
                        horizontal={false}
                    />
                    <Spacer variant="medium" />
                    {conditionItem && <TextBlock type={TextBlockTypeEnum.body}>{t("description")}: {conditionItem}</TextBlock>}
                    <Spacer variant="large" />
                </>
            )}
            {type == ReportType.SafetyPerception.toString() && (
                <>
                    {/* Choosing the user type */}
                    <SelectInput
                        title={t("chooseUserType")}
                        selectedInput={userType}
                        setSelectedInput={setUserType}
                        selectionList={userTypeData}
                        buttonText={t("change")}
                    />
                    <Spacer variant="large" />
                    <Spacer variant="medium" />
                </>
            )}
            {type == ReportType.SafetyPerception.toString() && userType && (
                <>
                    {/* Choosing the safety level */}
                    <RadioButton.Group 
                        onValueChange={handleSafetyLevelSelection} 
                        value={safety?.toString() ?? ""}>
                        <View style={styles.safetyLevelContainer}>
                            <RadioButton.Item label={t("safe")} value={SafetyLevel.Safe} />
                            <RadioButton.Item label={t("unsafe")} value={SafetyLevel.unSafe} />
                            <RadioButton.Item label={t("veryUnsafe")} value={SafetyLevel.veryUnsafe} />
                        </View>
                    </RadioButton.Group>
                    <Spacer variant="large" />
                    <Spacer variant="medium" />
                </>
            )}
            {type == ReportType.Quick.toString() && conditionItem && (
                <>
                    {/* Choosing the severity level */}
                    <RadioButton.Group 
                        onValueChange={handleSeverityLevelSelection} 
                        value={severity?.toString() ?? ""}>
                        <View style={styles.safetyLevelContainer}>
                            <RadioButton.Item label={t("noRisk")} value={SeverityLevel.NoRisky} />
                            <RadioButton.Item label={t("risky")} value={SeverityLevel.Risky} />
                            <RadioButton.Item label={t("urgentRisk")} value={SeverityLevel.UrgentRisk} />
                        </View>
                    </RadioButton.Group>
                    <Spacer variant="large" />
                    <Spacer variant="medium" />
                </>
            )}

            {type == ReportType.Incident.toString() && (
                <>
                    {/* Choosing the incident type */}
                    <TextBlock type={TextBlockTypeEnum.title}>
                        {t("chooseIncidentType")}
                    </TextBlock>
                    <Spacer variant="medium" />
                    <RadioButton.Group 
                        onValueChange={handleIncidentTypeSelection} 
                        value={incidentType?.toString() ?? ""}>
                        <View style={styles.safetyLevelContainer}>
                            <RadioButton.Item label={t("crash")} value={IncidentType.Crash} />
                            <RadioButton.Item label={t("equipment")} value={IncidentType.Equipment} />
                            <RadioButton.Item label={t("infastructure")} value={IncidentType.Infrastructure} />
                        </View>
                    </RadioButton.Group>
                    <Spacer variant="large" />
                    <Spacer variant="medium" />
                </>
            )}

            {/* Safety reasons for Safety Report */}
            <Portal>
                <Modal visible={isSafetyModalVisible} dismissable={true}>
                    <View style={styles.modalContentContainer}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <TextBlock type={TextBlockTypeEnum.title}>
                                {t("whyDidYouChooseThisLevel")}
                            </TextBlock>

                            <ButtonAction
                                variant={ButtonTypeEnum.tertiary}
                                onPress={() => setIsSafetyModalVisible(false)}
                                content={
                                    <TextBlock type={TextBlockTypeEnum.h5}>X</TextBlock>
                                }/>
                        </View>
                        <Spacer variant="large" />
                        {safetyLevelReasons.map((item, index) => {
                            if(item.userType == userType?.data.type) {
                                return (
                                    <View key={index}>
                                        {item.data.map((safetyLevel, levelKey) => {
                                            if(safetyLevel.type == safety) {
                                                return(
                                                    <ScrollView key={levelKey}>
                                                        {safetyLevel.reasons.map((level, levelKey) => {
                                                            return (
                                                                <View key={levelKey}>
                                                                    <TextBlock type={TextBlockTypeEnum.h4}>{level.type}</TextBlock>
                                                                    <Spacer variant="medium" />
                                                                    {level.list.map((reason, reasonKey) => (
                                                                        <Checkbox.Item 
                                                                            key={reasonKey}
                                                                            label={reason}
                                                                            labelStyle={{flexWrap: "wrap", marginBottom: 8}}
                                                                            onPress={(e) => handleSafetyReasonPressed(e, level.type, reason)}
                                                                            status={safetyReasons.find(item => item.type == level.type)?.list.includes(reason) ? "checked" : "unchecked"} />
                                                                    ))}
                                                                    <Spacer variant='large' />
                                                                    <Spacer variant='medium' />
                                                                </View>
                                                            )
                                                        })}
                                                        <Spacer variant="large" />
                                                        <ButtonAction
                                                            variant={ButtonTypeEnum.primary}
                                                            onPress={() => setIsSafetyModalVisible(false)}
                                                            content={
                                                                <TextBlock style={{color: "white"}}>OK</TextBlock>
                                                            }/>
                                                        <Spacer variant="large" />
                                                        <Spacer variant="large" />
                                                        <Spacer variant="large" />
                                                        <Spacer variant="large" />
                                                    </ScrollView>
                                                
                                                )
                                            }
                                        })}
                                        <Spacer variant="medium" />
                                    </View>
                                )
                            }
                        })}
                    </View>
                </Modal>

                {/* Conditions list modal for Quick Report condition type */}
                <Modal visible={isConditionListModalVisible} dismissable={true}>
                    <View style={styles.modalContentContainer}>
                        <TextBlock type={TextBlockTypeEnum.h5}>{t("whyConditionType")}: {conditionType?.content} ?</TextBlock>
                        <RadioButton.Group onValueChange={handleConditionItemSelection} value={conditionItem}>
                            {conditionListData.map((item, index) => {
                                if (item.type == conditionType?.data.type) {
                                    return (
                                        <View key={index}>
                                            {item.list.map((condition, conditionKey) => (
                                                <RadioButton.Item 
                                                    key={conditionKey}
                                                    label={condition}
                                                    value={condition}
                                                />
                                            ))}
                                            <Spacer variant="large" />
                                        </View>
                                    )
                                }
                            })}
                        </RadioButton.Group>
                    </View>
                </Modal>

                <Modal visible={isIncidentTypeModalVisible} dismissable={true}>
                    <View style={styles.modalContentContainer}>
                        {incidentType == IncidentType.Crash.toString() && (
                            <>
                                <TextBlock type={TextBlockTypeEnum.h5} style={{fontWeight: '700'}}>{t("whyIncidentType")}: {incidentType} ?</TextBlock>
                                <Spacer variant="medium" />
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <TextBlock type={TextBlockTypeEnum.title}>
                                        {t("incidentPedestrianNumber")}
                                    </TextBlock>
                                    <TextInput
                                        keyboardType="numeric"
                                        value={incidentPedestrianNumber.toString()}
                                        onChangeText={(text) => setIncidentPedestrianNumber(parseInt(text))}
                                        style={{width: 50, height: 40, borderRadius: 8, backgroundColor: Colors.light.background.secondary, padding: 8}}
                                    />
                                </View>
                                <Spacer variant="large" />
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <TextBlock type={TextBlockTypeEnum.title}>
                                        {t("incidentCyclistNumber")}
                                    </TextBlock>
                                    <TextInput
                                        keyboardType="numeric"
                                        value={incidentCyclistNumber.toString()}
                                        onChangeText={(text) => setIncidentCyclistNumber(parseInt(text))}
                                        style={{width: 50, height: 40, borderRadius: 8, backgroundColor: Colors.light.background.secondary, padding: 8}}
                                    />
                                </View>
                                <Spacer variant="large" />
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <TextBlock type={TextBlockTypeEnum.title}>
                                        {t("incidentMotocyclistNumber")}
                                    </TextBlock>
                                    <TextInput
                                        keyboardType="numeric"
                                        value={incidentMotocyclistNumber.toString()}
                                        onChangeText={(text) => setIncidentMotocyclistNumber(parseInt(text))}
                                        style={{width: 50, height: 40, borderRadius: 8, backgroundColor: Colors.light.background.secondary, padding: 8}}
                                    />
                                </View>
                                <Spacer variant="large" />
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <TextBlock type={TextBlockTypeEnum.title}>
                                        {t("incidentCarNumber")}
                                    </TextBlock>
                                    <TextInput
                                        keyboardType="numeric"
                                        value={incidentCarNumber.toString()}
                                        onChangeText={(text) => setIncidentCarNumber(parseInt(text))}
                                        style={{width: 50, height: 40, borderRadius: 8, backgroundColor: Colors.light.background.secondary, padding: 8}}
                                    />
                                </View>
                                <Spacer variant="large" />
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <TextBlock type={TextBlockTypeEnum.title}>
                                        {t("incidentTruckNumber")}
                                    </TextBlock>
                                    <TextInput
                                        keyboardType="numeric"
                                        value={incidentTruckNumber.toString()}
                                        onChangeText={(text) => setIncidentTruckNumber(parseInt(text))}
                                        style={{width: 50, height: 40, borderRadius: 8, backgroundColor: Colors.light.background.secondary, padding: 8}}
                                    />
                                </View>
                                <Spacer variant="large" />
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <TextBlock type={TextBlockTypeEnum.title}>
                                        {t("incidentBusNumber")}
                                    </TextBlock>
                                    <TextInput
                                        keyboardType="numeric"
                                        value={incidentBusNumber.toString()}
                                        onChangeText={(text) => setIncidentBusNumber(parseInt(text))}
                                        style={{width: 50, height: 40, borderRadius: 8, backgroundColor: Colors.light.background.secondary, padding: 8}}
                                    />
                                </View>
                                <Spacer variant="large" />
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <TextBlock type={TextBlockTypeEnum.title}>
                                        {t("incidentBusNumber")}
                                    </TextBlock>
                                    <TextInput
                                        keyboardType="numeric"
                                        value={incidentBusNumber.toString()}
                                        onChangeText={(text) => setIncidentBusNumber(parseInt(text))}
                                        style={{width: 50, height: 40, borderRadius: 8, backgroundColor: Colors.light.background.secondary, padding: 8}}
                                    />
                                </View>
                                <Spacer variant="large" />
                                <TextBlock type={TextBlockTypeEnum.title}>{t("selectIncidentCrashSeverity")}</TextBlock>
                                <RadioButton.Group 
                                    onValueChange={handleIncidentCrashSeveritySelection} 
                                    value={incidentCrashSeverity?.toString() ?? ""}>
                                    <View style={styles.safetyLevelContainer}>
                                        <RadioButton.Item label={t("fatal")} value={IncidentSeverity.Fatal} />
                                        <RadioButton.Item label={t("minorInjury")} value={IncidentSeverity.MinorInjury} />
                                        <RadioButton.Item label={t("seriousInjury")} value={IncidentSeverity.SeriousInjury} />
                                        <RadioButton.Item label={t("materialDamage")} value={IncidentSeverity.MaterialDamage} />
                                    </View>
                                </RadioButton.Group>
                                <Spacer variant="large" />
                            </>
                        )}
                        <TextBlock type={TextBlockTypeEnum.h5}>{t("whyIncidentType")}: {incidentType} ?</TextBlock>
                        <ButtonAction
                            variant={ButtonTypeEnum.primary}
                            onPress={() => setIsIncidentTypeModalVisible(false)}
                            content={
                                <TextBlock style={{color: "white"}}>OK</TextBlock>
                            }/>
                    </View>
                </Modal>
            </Portal>

            {(type == ReportType.SafetyPerception.toString() || type == ReportType.Quick.toString() || type == ReportType.Incident.toString()) && (
                <>
                    {/* Comment section */}
                    <View>
                        <TextBlock type={TextBlockTypeEnum.title}>
                            {t("additionalComment")}
                        </TextBlock>
                        <Spacer variant="medium" />
                        <TextInput
                            multiline
                            maxLength={250}
                            style={{backgroundColor: Colors.light.background.secondary, padding: 8, borderRadius: 8}}
                            placeholder={t("commentPlaceholder")}
                        />
                    </View>
                    <Spacer variant="large" />
                    <Spacer variant="medium" />
                </>
            )}

            {(type == ReportType.SafetyPerception.toString() || type == ReportType.Quick.toString() || type == ReportType.Incident.toString()) && (
                <>
                    {/* Image picker section */}
                    <View>
                        <TextBlock type={TextBlockTypeEnum.title}>
                            {t("addImages")}
                        </TextBlock>
                        <Spacer variant="medium" />
                        <View style={styles.imagesContainer}>
                            {reportImages.map((image, index) => {
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        activeOpacity={0.8}
                                        onPress={() => handleDeleteImage(image)}>
                                        <Image
                                            key={index}
                                            source={{uri: image}}
                                            width={74}
                                            height={60}
                                            resizeMode="contain"
                                            style={{borderRadius: 8}}
                                        />
                                    </TouchableOpacity>
                                )
                            })}
                            {
                                reportImages.length < 2 && (
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={handleAddImage}
                                        style={{width: 74, height: 60, borderRadius: 8, backgroundColor: Colors.light.background.tertiary, justifyContent: 'center', alignItems: 'center'}}>
                                        <TextBlock type={TextBlockTypeEnum.title}>
                                            +
                                        </TextBlock>
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                    </View>
                    <Spacer variant="large" />
                    <Spacer variant="medium" />
                </>
            )}

            {reportError && <TextBlock type={TextBlockTypeEnum.caption} style={{color: 'red'}}>{reportError}</TextBlock>}
            <Spacer variant="medium" />
            <ButtonAction 
                variant={ButtonTypeEnum.primary}
                onPress={handleAddReport}
                content={
                    <TextBlock style={{color: Colors.light.background.quaternary}}>{t("addReport")}</TextBlock>
                }
            />
            <Spacer variant="large" />
            <Spacer variant="large" />
            <Spacer variant="large" />
            <Spacer variant="large" />
        </ScrollView>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background.quinary,
        padding: 16
    },
    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    safetyLevelContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    imagesContainer: {
        gap: 8,
        flexDirection: 'row',
    },
    modalContentContainer: {
        margin: 16,
        padding: 16,
        backgroundColor: Colors.light.background.quinary,
        borderRadius: 8,
        maxHeight: "85%",
        overflow: 'hidden'
    }
});