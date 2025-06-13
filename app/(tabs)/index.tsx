import { Image, StyleSheet, Platform, View, FlatList, ScrollView, Alert, Share } from 'react-native';

import { TextBlock } from '../../components/TextBlock';
import { useEffect } from 'react';
import { registerForPushNotificationsAsync } from '../../utils/Permissions';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/accountSlice';
import { ReportType, TextBlockTypeEnum, User } from '../../type.d';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useNetInfo } from '@react-native-community/netinfo';
import ToastMessage from '../../utils/Toast';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Spacer } from '../../components/Spacer';
import { ReportCard } from '../../components/ReportCard';
import { LocationCard } from '../../components/LocationCard';
import { router } from 'expo-router';
import { MoreOptionCard } from '../../components/MoreOptionCard';
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';

export default function HomeScreen() {

  //const user: User = useSelector(selectUser);
  const { isConnected } = useNetInfo();
  const { t } = useTranslation();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  const handlePerceptionPress = () => {
    router.push({pathname: "/(homeStack)/report", params: {type: ReportType.SafetyPerception}});
  }

  const handleRoadIssuePress = () => {
    router.push({pathname: "/(homeStack)/report", params: {type: ReportType.Quick}});
  }

  const handleAlertAccidentPress = () => {
    router.push({pathname: "/(homeStack)/report", params: {type: ReportType.Incident}});
  }

  const handleAuditPress = () => {
    router.push({pathname: "/(homeStack)/report", params: {type: ReportType.Audit}});
  }

  const handleNavigateToFindSupport = () => {
    router.push("/(homeStack)/findsupport");
  }

  const handleShareLocation = async () => {
    const location = await locateUser();

    if (location == null) {
      console.log("location is null");
      Alert.alert(
        t("error"),
        t("requiresLocationPermessionForReport"),
        [
          {
              text: t("goBack"),
              onPress: () => {},
          },
          {
              text: t("addPermission"),
              onPress: () => Linking.openSettings(),
              style: 'cancel',
          }
        ],
        {
          cancelable: true
        }
      )
      return;
    }

    const url = `https://www.google.com/maps?q=${location.coords.latitude},${location.coords.longitude}`;
    await Share.share(
      {
        url,
        title: "Share your location",
        message: `Here's my location: ${url}`,

      }
    );
  }

  const locateUser = async() => {
    const location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Balanced});
    return location ?? null;
  }

  const handleShortestPath = () => {
    ToastMessage(
      "info",
      t("info"),
      t("comingSoon")
    )
  }

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(data => {
        //user.expoPushToken = data;
      })
      .catch(error => {
        ToastMessage(
          "info",
          t("info"),
          t("failedToGetNotificationToken")
        )
      })
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require("../../assets/images/logo.png")} style={styles.logo} resizeMode='contain' />
      <ScrollView>
        <Spacer variant="large" />
        <TextBlock type={TextBlockTypeEnum.h3}>{t("homeHeading")}</TextBlock>
        <Spacer variant="large" />
        <View style={styles.cardContainer}>
          <ReportCard
            imageUrl={require('../../assets/images/perception.png')}
            title={t("perceptionTitle")}
            onPress={handlePerceptionPress}
            />
          <ReportCard
            imageUrl={require('../../assets/images/roadissue.png')}
            title={t("roadissueTitle")}
            onPress={handleRoadIssuePress}
            />
        </View>
        <Spacer variant="large" />
        <Spacer variant="large" />
        <Spacer variant="large" />
        <Spacer variant="large" />
        <View style={styles.cardContainer}>
          <ReportCard
            imageUrl={require('../../assets/images/alertaccident.png')}
            title={t("alertaccidentTitle")}
            onPress={handleAlertAccidentPress}
            />
          <ReportCard
            imageUrl={require('../../assets/images/audit.png')}
            title={t("auditTitle")}
            onPress={handleAuditPress}
            />
        </View>
        <Spacer variant="large" />
        <Spacer variant="large" />
        <Spacer variant="large" />
        <Spacer variant="large" />
        <Spacer variant="large" />
        <View style={styles.divider} />
        <Spacer variant="large" />
        <LocationCard />
        <Spacer variant="large" />
        <View style={styles.divider} />
        <Spacer variant="large" />
        <TextBlock type={TextBlockTypeEnum.h3}>{t("stayAlertAndProactive")}</TextBlock>
        <Spacer variant="large" />
        <View style={styles.cardContainer}>
          <MoreOptionCard
            imageUrl={require('../../assets/images/findsupport.png')}
            title={t("findSupport")}
            onPress={handleNavigateToFindSupport}
            />
          <MoreOptionCard
            imageUrl={require('../../assets/images/sharelocation.png')}
            title={t("shareLocation")}
            onPress={handleShareLocation}
            />
          <MoreOptionCard
            imageUrl={require('../../assets/images/shortestpath.png')}
            title={t("shortestPath")}
            onPress={handleShortestPath}
            />
        </View>
        <Spacer variant="large" />
        <Spacer variant="large" />
        <Spacer variant="large" />
        <Spacer variant="large" />
        <Spacer variant="large" />
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.light.background.quinary
  },
  logo: {
    width: 140,
    height: 40
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: Colors.light.background.tertiary
  }
});
