import { StyleSheet, Image, Platform, View } from 'react-native';

import { TextBlock } from '../../components/TextBlock';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useNetInfo } from '@react-native-community/netinfo';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { TextBlockTypeEnum } from '../../type.d';
import { Searchbar } from 'react-native-paper';
import { useState } from 'react';
import MapView from 'react-native-maps';
import { Spacer } from '../../components/Spacer';

export default function Map() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const {isConnected} = useNetInfo();
  const {t} = useTranslation();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  
  return (
    <SafeAreaView style={styles.container}>
      <TextBlock type={TextBlockTypeEnum.h1} style={{ textAlign: "left" }}>
        {t("exploration")}
      </TextBlock>
      <Spacer variant="large" />
      <TextBlock type={TextBlockTypeEnum.body} style={{ textAlign: "left" }}>
        {t("provideEmailForgot")}
      </TextBlock>
      <Searchbar
        placeholder={t("search")}
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={{ marginVertical: 16 }}
        />
      <MapView />
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
