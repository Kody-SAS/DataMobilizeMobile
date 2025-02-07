import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { registerForForegroundLocationPermissionAsync } from "../../utils/Permissions";
import ToastMessage from "../../utils/Toast";
import { useTranslation } from "react-i18next";
import { Alert, Linking, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Colors } from "../../constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

export default function Map() {
    const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);

    const {t} = useTranslation();

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
            "error",
            t("error"),
            t("locationPermissionDenied")
        )
    }

    useEffect(() => {
        locateUser();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
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
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background.quaternary
    },
    map: {
        flex: 1
    }
})