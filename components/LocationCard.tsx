import { View, StyleSheet } from "react-native"
import { TextBlock } from "./TextBlock"
import { useTranslation } from "react-i18next";
import { ButtonAction } from "./ButtonAction";
import { ButtonTypeEnum, TextBlockTypeEnum } from "../type.d";
import { Spacer } from "./Spacer";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { Colors } from "../constants/Colors";
import { useEffect, useState } from "react";
import { registerForForegroundLocationPermissionAsync } from "../utils/Permissions";
import ToastMessage from "../utils/Toast";
import * as Location from 'expo-location';
import { router } from "expo-router";

export type LocationCardProps = {
    coordinates?: {latitude: number, longitude: number}[];
}

export const LocationCard = ({coordinates}: LocationCardProps) => {
    const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
    const {t} = useTranslation();
    const handleMapNavigation = async() => {
        const foregroundPermissionStatus = await registerForForegroundLocationPermissionAsync();
        if (foregroundPermissionStatus) {
            console.log('Permission granted');
            router.push({pathname: "/(homeStack)/map", params: {coordinates: JSON.stringify(coordinates)}});
            return;
        }
        console.log('Permission denied');
        ToastMessage(
            "info",
            t("info"),
            t("locationPermissionDenied")
        )
    }

    const locateUser = async() => {
        const location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Balanced});
        setCurrentLocation(location);
    }

    useEffect(() => {
        registerForForegroundLocationPermissionAsync()
        .then(data => {
            if (data != null) {
                console.log("Location permission granted");
                locateUser();
            }
        });
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
                    latitudeDelta: 0.5,
                    longitudeDelta: 0.5
                }}
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
            {(coordinates && coordinates.length > 0) && (
                <Polyline
                    coordinates={coordinates}
                    strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                    strokeColors={['#7F0000']}
                    strokeWidth={6}
                    />
            )}
            </MapView>
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
        height: 150
    }
})