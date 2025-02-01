import { View, StyleSheet } from "react-native"
import { TextBlock } from "./TextBlock"
import { useTranslation } from "react-i18next";
import { ButtonAction } from "./ButtonAction";
import { ButtonTypeEnum, TextBlockTypeEnum } from "../type.d";
import { Spacer } from "./Spacer";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { Colors } from "../constants/Colors";
import { useEffect, useState } from "react";
import { registerForForegroundLocationPermissionAsync } from "../utils/Permissions";
import ToastMessage from "../utils/Toast";
import * as Location from 'expo-location';

export const LocationCard = () => {
    const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
    const {t} = useTranslation();
    const handleMapNavigation = async() => {
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
        registerForForegroundLocationPermissionAsync();
    }, [])
    return (
        <View>
            <View style={styles.header}>
                <TextBlock>{t("yourLocation")}</TextBlock>
                <ButtonAction
                    onPress={handleMapNavigation}
                    variant={ButtonTypeEnum.quarternary}
                    content={
                        <TextBlock type={TextBlockTypeEnum.body} style={{color: Colors.light.background.primary}}>{t("viewOnMap")}</TextBlock>
                    }
                    />
            </View>
            <Spacer variant="medium" />
            <MapView 
                style={styles.map} 
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                initialRegion={{
                    latitude: currentLocation?.coords.latitude ?? 6,
                    longitude: currentLocation?.coords.longitude ?? 12,
                    latitudeDelta: 5,
                    longitudeDelta: 5
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    map: {
        width: "100%",
        height: 140
    }
})