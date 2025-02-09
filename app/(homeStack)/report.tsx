import { Alert, Linking, StyleSheet, View } from "react-native";
import { TextBlock } from "../../components/TextBlock";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Colors } from "../../constants/Colors";
import { useEffect, useState } from "react";
import { requestForegroundPermissionsAsync } from "expo-location";
import { useTranslation } from "react-i18next";
import { ReportType, RoadType, UserType } from "../../type.d";
import { LocationCard } from "../../components/LocationCard";
import { Spacer } from "../../components/Spacer";
import { SelectedOption, SelectInput } from "../../components/SelectInput";
import { DateInput } from "../../components/DateInput";

export default function Report() {
    const [roadType, setRoadType] = useState<SelectedOption>();
    const [userType, setUserType] = useState<SelectedOption>();
    const [date, setDate] = useState<Date>(new Date(Date.now()));

    const {type} = useLocalSearchParams();
    const {t} = useTranslation();
    const navigation = useNavigation();

    const canUserReport = async() => {
        const request = await requestForegroundPermissionsAsync();

        if (request == null) {
            Alert.alert(
                "error",
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
            content: t("intersection"),
            imageUrl: require("../../assets/images/intersection.png"),
            data: {type: RoadType.Intersection}
        },
        {
            content: t("section"),
            imageUrl: require("../../assets/images/section.png"),
            data: {type: RoadType.Section}
        },
        {
            content: t("roundAbout"),
            imageUrl: require("../../assets/images/roundabout.png"),
            data: {type: RoadType.RoundAbout}
        },
        {
            content: t("straight"),
            imageUrl: require("../../assets/images/straight.png"),
            data: {type: RoadType.Straight}
        },
        {
            content: t("turn"),
            imageUrl: require("../../assets/images/turn.png"),
            data: {type: RoadType.Turn}
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

    // change screen title
    useEffect(() => {
        changeScreenTitle();
    }, [])

    // can user create a report ?
    useEffect(() => {
        canUserReport();
    }, [])
    return (
        <View style={styles.container}>
            <LocationCard />
            <Spacer variant="large" />
            <Spacer variant="medium" />
            <SelectInput
                title={t("chooseRoadType")}
                selectedInput={roadType}
                setSelectedInput={setRoadType}
                selectionList={roadTypeData}
                buttonText={t("change")}
            />
            <Spacer variant="large" />
            <Spacer variant="medium" />
            <DateInput
                date={date}
                setDate={setDate}
            />
            <Spacer variant="large" />
            <Spacer variant="medium" />
            <SelectInput
                title={t("chooseUserType")}
                selectedInput={userType}
                setSelectedInput={setUserType}
                selectionList={userTypeData}
                buttonText={t("change")}
            />
        </View>
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
    }
});