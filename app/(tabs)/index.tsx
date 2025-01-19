import { Image, StyleSheet, Platform, View } from 'react-native';

import { TextBlock } from '../../components/TextBlock';
import { useEffect } from 'react';
import { registerForPushNotificationsAsync } from '../../utils/Permissions';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/accountSlice';
import { User } from '../../type';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useNetInfo } from '@react-native-community/netinfo';
import ToastMessage from '../../utils/Toast';

export default function HomeScreen() {

  const user: User = useSelector(selectUser);
  const {isConnected} = useNetInfo();
  const {t} = useTranslation();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

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
  })
  return (
    <View>
      <TextBlock>Home screen</TextBlock>
    </View>
  );
}

const styles = StyleSheet.create({

});
