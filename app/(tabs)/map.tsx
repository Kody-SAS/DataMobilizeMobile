import { StyleSheet, Image, Platform, View } from 'react-native';

import { TextBlock } from '../../components/TextBlock';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useNetInfo } from '@react-native-community/netinfo';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { TextBlockTypeEnum } from '../../type';

export default function Map() {
  const {isConnected} = useNetInfo();
  const {t} = useTranslation();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  
  return (
    <SafeAreaView style={styles.container}>
      <TextBlock type={TextBlockTypeEnum.body} style={{ textAlign: "center" }}>
        {t("provideEmailForgot")}
      </TextBlock>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background.quinary,
    padding: 16
  },
  description: {
    verticalAlign: "middle",
    color: "#FFFFFF",
    paddingHorizontal: 32,
    paddingVertical: 4,
    justifyContent: "center",
    alignItems: "center"
  },
});
