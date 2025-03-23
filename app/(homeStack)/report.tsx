import { Alert, GestureResponderEvent, Image, Linking, ScrollView, StyleSheet, Touchable, TouchableOpacity, View } from "react-native";
import { TextBlock } from "../../components/TextBlock";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Colors } from "../../constants/Colors";
import { useEffect, useState } from "react";
import { requestForegroundPermissionsAsync } from "expo-location";
import { useTranslation } from "react-i18next";
import { ButtonTypeEnum, ReportType, RoadType, SafetyLevel, TextBlockTypeEnum, UserType } from "../../type.d";
import { LocationCard } from "../../components/LocationCard";
import { Spacer } from "../../components/Spacer";
import { SelectedOption, SelectInput } from "../../components/SelectInput";
import { DateInput } from "../../components/DateInput";
import { Checkbox, Modal, PaperProvider, Portal, RadioButton, TextInput } from "react-native-paper";
import { safetyLevelReasons } from "../../utils/DataSeed";
import * as ImagePicker from 'expo-image-picker';
import { ButtonAction } from "../../components/ButtonAction";

export default function Report() {
    const [roadType, setRoadType] = useState<SelectedOption>();
    const [userType, setUserType] = useState<SelectedOption>();
    const [date, setDate] = useState<Date>(new Date(Date.now()));
    const [safety, setSafety] = useState<string>();
    const [safetyReasons, setSafetyReasons] = useState<string[]>([]);
    const [isSafetyModalVisible, setIsSafetyModalVisible] = useState<boolean>(false);
    const [reportImages, setReportImages] = useState<string[]>([]);

    const {type} = useLocalSearchParams();
    const {t} = useTranslation();
    const navigation = useNavigation();

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

    const handleSafetyLevelSelection = (value: string) => {
        setIsSafetyModalVisible(true);
        setSafety(value);
    }

    const handleSafetyReasonPressed = (e: GestureResponderEvent, selectedReason: string) => {
        if(!safetyReasons.includes(selectedReason)) {
            setSafetyReasons([...safetyReasons, selectedReason]);
        }
        else {
            const newList = [...safetyReasons].filter(item => item != selectedReason);
            setSafetyReasons(newList);
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

    const handleAddReport = () => {

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
            {type == ReportType.SafetyPerception.toString() && (
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

            {/* Safety reasons */}
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
                                                                            onPress={(e) => handleSafetyReasonPressed(e, reason)}
                                                                            status={safetyReasons.includes(reason) ? "checked" : "unchecked"} />
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