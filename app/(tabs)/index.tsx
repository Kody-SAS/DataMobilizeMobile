import { Image, StyleSheet, Platform, View, FlatList, ScrollView } from 'react-native';

import { TextBlock } from '../../components/TextBlock';
import { useEffect } from 'react';
import { registerForPushNotificationsAsync } from '../../utils/Permissions';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/accountSlice';
import { TextBlockTypeEnum, User } from '../../type.d';
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

export default function HomeScreen() {

  //const user: User = useSelector(selectUser);
  const { isConnected } = useNetInfo();
  const { t } = useTranslation();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  const handlePerceptionPress = () => {
    router.push("/(homeStack)/reports");
  }

  const handleRoadIssuePress = () => {
    router.push("/(homeStack)/reports");
  }

  const handleAlertAccidentPress = () => {
    router.push("/(homeStack)/reports");
  }

  const handleAuditPress = () => {
    router.push("/(homeStack)/reports");
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
