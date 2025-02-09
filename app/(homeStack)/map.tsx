import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { registerForForegroundLocationPermissionAsync } from "../../utils/Permissions";
import ToastMessage from "../../utils/Toast";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Colors } from "../../constants/Colors";
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
        <View style={styles.container}>
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
    container: {
        flex: 1,
        backgroundColor: Colors.light.background.quaternary
    },
    map: {
        flex: 1
    }
})