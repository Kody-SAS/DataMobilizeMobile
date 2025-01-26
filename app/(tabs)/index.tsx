import { Image, StyleSheet, Platform, View, FlatList } from 'react-native';

import { TextBlock } from '../../components/TextBlock';
import { useEffect } from 'react';
import { registerForPushNotificationsAsync } from '../../utils/Permissions';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/accountSlice';
import { TextBlockTypeEnum, User } from '../../type';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useNetInfo } from '@react-native-community/netinfo';
import ToastMessage from '../../utils/Toast';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Spacer } from '../../components/Spacer';
import { ReportCard } from '../../components/ReportCard';
import { LocationCard } from '../../components/LocationCard';

export default function HomeScreen() {

  const user: User = useSelector(selectUser);
  const { isConnected } = useNetInfo();
  const { t } = useTranslation();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  const handlePerceptionPress = () => {

  }

  const handleRoadIssuePress = () => {

  }

  const handleAlertAccidentPress = () => {

  }

  const handleAuditPress = () => {

  }

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(data => {
        user.expoPushToken = data;
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
      <Image source={require("../../assets/images/logo.png")} style={styles.logo} />
      <Spacer variant="large" />
      <TextBlock type={TextBlockTypeEnum.h3}>{t("homeHeading")}</TextBlock>
      <Spacer variant="medium" />
      <View style={styles.cardContainer}>
        <ReportCard
          imageUrl='../../assets/images/perception.png'
          title={t("perceptionTitle")}
          onPress={handlePerceptionPress}
          />
        <ReportCard
          imageUrl='../../assets/images/roadissue.png'
          title={t("roadissueTitle")}
          onPress={handleRoadIssuePress}
          />
      </View>
      <Spacer variant="medium" />
      <View>
        <ReportCard
          imageUrl='../../assets/images/alertaccident.png'
          title={t("alertaccidentTitle")}
          onPress={handleAlertAccidentPress}
          />
        <ReportCard
          imageUrl='../../assets/images/audit.png'
          title={t("auditTitle")}
          onPress={handleAuditPress}
          />
      </View>
      <Spacer variant="large" />
      <View style={styles.divider} />
      <LocationCard />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.light.background.quinary
  },
  logo: {
    width: 140,
    height: 40
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: Colors.light.background.tertiary
  }
});
