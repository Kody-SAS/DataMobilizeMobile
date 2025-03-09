import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { TextBlock } from "../../components/TextBlock";
import { Colors } from "../../constants/Colors";
import { ButtonAction } from "../../components/ButtonAction";
import { ButtonTypeEnum, FontsEnum, FontSizesEnum, TextBlockTypeEnum, User } from "../../type.d";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Spacer } from "../../components/Spacer";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { deleteUser, selectUser, setIsAccountVerified, setUser, updateUser } from "../../redux/slices/accountSlice";
import { router } from "expo-router";
import { Modal, PaperProvider, Portal, TextInput } from "react-native-paper";
import ToastMessage from "../../utils/Toast";
import { useNetInfo } from "@react-native-community/netinfo";

export default function Profile() {
    const {t} = useTranslation();
    const user: User = useSelector(selectUser);    
    const {isConnected} = useNetInfo();
    

    const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
    const [username, setUsername] = useState<string>(user.username);
    const [errorMessage, setErrorMessage] = useState<string>("");
    
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

    const handleEditProfile = () => {
        setIsEditModalVisible(true);
    }

    const handleCancelEdit = () => {
        setIsEditModalVisible(false);
    }

    const handleSaveProfile = () => {
        if (!isConnected) {
            ToastMessage("error", t("error"), t("connectAndTryAgain"));
            return;
        }

        if (!username) {
            setErrorMessage(t("fillTheField"));
            return;
        }

        user.username = username;
        dispatch(updateUser(user));
    }

    const handleLogoutPress = () => {
        Alert.alert(
            t("logout"),
            t("requireLogout"),
            [
                {
                    text: t("cancel"),
                    onPress: () => {},
                    style: 'cancel'
                },
                {
                    text: t("logout"),
                    onPress: () => {
                        setUser({} as User);
                        router.replace("/(account)/");
                    },
                }
            ],
            {
                cancelable: true
            }
        )
    }

    const handleAccountDelete = () => {
        Alert.alert(
            t("warning"),
            t("requireAccountDelete"),
            [
                {
                    text: t("cancel"),
                    onPress: () => {},
                    style: 'cancel'
                },
                {
                    text: t("deleteAccount"),
                    onPress: () => {
                        dispatch(deleteUser(user));
                        setIsAccountVerified(false);
                        router.replace("/(account)/register");
                    },
                    style: 'destructive',
                }
            ],
            {
                cancelable: true
            }
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <PaperProvider>
            <Spacer variant="large"/>
            <TextBlock type={TextBlockTypeEnum.h3}>{user.username}</TextBlock>
            <TextBlock type={TextBlockTypeEnum.caption}>{user.email}</TextBlock>
            <Spacer variant="large"/>
            <Spacer variant="large"/>
            <ButtonAction
                variant={ButtonTypeEnum.tertiary}
                onPress={handleEditProfile}
                content={
                    <View style={styles.buttonContainer}>
                        <MaterialCommunityIcons name="account-edit-outline" size={24} color="black" />
                        <Spacer variant="medium" position="right" />
                        <TextBlock type={TextBlockTypeEnum.title}>{t("editProfile")}</TextBlock>
                    </View>
                }/>
            <Spacer variant="large" />

            <Portal>
                <Modal visible={isEditModalVisible} dismissable={true} contentContainerStyle={styles.editModal}>
                    <View>
                        <TextBlock type={TextBlockTypeEnum.body} style={{ textAlign: "center" }}>
                            {t("editProfile")}
                        </TextBlock>
                        <Spacer variant="large" />
                        <Spacer variant="medium" />
                        <TextInput
                            mode="outlined"
                            value={username}
                            onChangeText={(t) => setUsername(t)}
                            contentStyle={{
                                fontSize: FontSizesEnum.body,
                                fontFamily: FontsEnum.body,
                            }}
                            activeOutlineColor={Colors.light.background.primary}
                            keyboardType="default"
                            placeholder={t("username")}
                            placeholderTextColor={Colors.light.text.secondary}
                        />
                        <Spacer variant="large" />
                        {errorMessage.length > 0 && (
                            <View>
                                <TextBlock type={TextBlockTypeEnum.caption} style={{ color: "red" }}>
                                    {errorMessage}
                                </TextBlock>
                                <Spacer variant="medium" />
                            </View>
                        )}
                        <View style={styles.actionContainer}>
                            <ButtonAction
                                variant={ButtonTypeEnum.tertiary}
                                onPress={handleCancelEdit}
                                content={
                                    <TextBlock>{t("cancel")}</TextBlock>
                                }/>
                            <Spacer variant="large" position="right" />
                            <ButtonAction
                                variant={ButtonTypeEnum.tertiary}
                                onPress={handleSaveProfile}
                                content={
                                    <TextBlock>{t("save")}</TextBlock>
                                }/>
                        </View>
                    </View>
                </Modal>
            </Portal>
            <ButtonAction
                variant={ButtonTypeEnum.tertiary}
                onPress={handleLogoutPress}
                content={
                    <View style={styles.buttonContainer}>
                        <MaterialIcons name="logout" size={24} color="black" />
                        <Spacer variant="medium" position="right" />
                        <TextBlock type={TextBlockTypeEnum.title}>{t("logout")}</TextBlock>
                    </View>
                }/>
            <Spacer variant="large" />
            <ButtonAction
                variant={ButtonTypeEnum.tertiary}
                onPress={handleAccountDelete}
                content={
                    <View style={styles.buttonContainer}>
                        <MaterialCommunityIcons name="account-cancel-outline" size={24} color="black" />
                        <Spacer variant="medium" position="right" />
                        <TextBlock type={TextBlockTypeEnum.title}>{t("deleteAccount")}</TextBlock>
                    </View>
                }/>
            <Spacer variant="large" />
            </PaperProvider>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.light.background.quaternary,
        flex: 1,
        padding: 16
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    editModal: {
        backgroundColor: Colors.light.background.quinary,
        padding: 16,
        margin: 16,
        borderRadius: 8,
        maxHeight: "80%"
    },
    actionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    }
})