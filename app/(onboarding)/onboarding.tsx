import { Dimensions, FlatList, Image, StyleSheet, useColorScheme, View } from "react-native";
import { Spacer } from "../../components/Spacer";
import { TextBlock } from "../../components/TextBlock";
import { useTranslation } from "react-i18next";
import { ButtonAction } from "../../components/ButtonAction";
import { ButtonTypeEnum, TextBlockTypeEnum } from "../../type.d";
import { Colors } from "../../constants/Colors";
import { useDispatch } from "react-redux";
import { setOnboardingStatus } from "../../redux/slices/onboardingSlice";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function onboarding() {
    const [currentPage, setCurrentPage] = useState<number>(0);

    // translate text
    const { t } = useTranslation();
    const theme = useColorScheme() ?? "light";
    const dispatch = useDispatch()
    const listRef = useRef<FlatList>(null);

    const handlePageChange = () => {
        setCurrentPage((prevPage) => {
            if (prevPage < onbonardingData.length - 1) {
                listRef.current?.scrollToIndex({
                    index: prevPage + 1,
                    animated: true,
                });
                return prevPage + 1;
            } else {
                finishOnboarding();
                return prevPage; // Stay on the last page
            }
        });
    }

    const finishOnboarding = async () => {
        dispatch(setOnboardingStatus(true));
        AsyncStorage.setItem("onboardingStatus", JSON.stringify(true)).then(() => console.log("Onboarding status saved"));
        router.replace("/(account)/register")
    }

    const onbonardingData = [
        {
            title: t("onboardingTitle1"),
            description: t("onboardingDescription1"),
            image: require("../../assets/images/onboarding1.png")
        },
        {
            title: t("onboardingTitle2"),
            description: t("onboardingDescription2"),
            image: require("../../assets/images/onboarding2.png")
        },
        {
            title: t("onboardingTitle3"),
            description: t("onboardingDescription3"),
            image: require("../../assets/images/onboarding3.png")
        }
    ]

    return (
        <SafeAreaView>
        <View style={{width: Dimensions.get("window").width, height: Dimensions.get("window").height, backgroundColor: Colors.light.background.quinary}}>
        <FlatList
            ref={listRef}
            data={onbonardingData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
                <View style={styles.container}>
                    <Image 
                        source={item.image}
                        style={styles.illustration}
                        resizeMode="stretch"
                    />
                    <View style={{paddingHorizontal: 16}}>
                        <Spacer position="bottom" variant="large" />    
                        <TextBlock type={TextBlockTypeEnum.h1}>
                            {item.title}
                        </TextBlock>
                        <Spacer position="bottom" variant="large" />    
                        <Spacer position="bottom" variant="medium" />
                        <TextBlock type={TextBlockTypeEnum.title} style={{fontWeight: '200', opacity: 0.8, color: "#898989"}}>
                            {item.description}
                        </TextBlock>
                        <Spacer position="bottom" variant="large" />
                        {/* Indicator of the current page */}
                        <View style={{flexDirection: "row", justifyContent: "center"}}>
                            {onbonardingData.map((_, i) => (
                                <View 
                                    key={i} 
                                    style={{
                                        width: i === index ? 21 : 6,
                                        height: 6,
                                        borderRadius: 3,
                                        backgroundColor: i === index ? Colors.light.text.primary : Colors.light.text.secondary,
                                        marginHorizontal: 5
                                    }} />
                            ))}
                        </View>
                        <Spacer position="bottom" variant="large" />
                    </View>
                    <ButtonAction 
                        onPress={handlePageChange}
                        variant={ButtonTypeEnum.primary}
                        style={{width: "90%", alignSelf: "center"}}
                        content={
                            <TextBlock type={TextBlockTypeEnum.h4} style={styles.description}>
                                {index == onbonardingData.length - 1 ? t("start") : t("next")}
                            </TextBlock>
                        }
                    />
                </View>
            )}
            contentContainerStyle={{flexGrow: 1, justifyContent: "center"}}
            horizontal
            snapToStart
            scrollEnabled={false}
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false} />
            </View>
            </SafeAreaView>
        // <View style={styles.container}>
            
        //     <Spacer position="bottom" variant="large" />
        //     <Image 
        //         source={require("../../assets/images/onboarding.jpg")}
        //         style={styles.illustration}
        //         resizeMode="center"
        //     />
        //     <TextBlock type={TextBlockTypeEnum.h1} style={{textAlign: "center", color: "#898989"}}>
        //         DATA MOBILIZE
        //     </TextBlock>
        //     <Spacer position="bottom" variant="large" />
        //     <Spacer position="bottom" variant="medium" />
        //     <TextBlock type={TextBlockTypeEnum.h4} style={{textAlign: "center"}}>
        //         {t("onboardingMessage")}
        //     </TextBlock>
        //     <Spacer position="bottom" variant="large" />
        //     <Spacer position="bottom" variant="large" />
        //     <Spacer position="bottom" variant="large" />
        //     <ButtonAction 
        //         onPress={handlePageChange}
        //         variant={ButtonTypeEnum.primary}
        //         style={{width: "90%"}}
        //         content={
        //             <TextBlock type={TextBlockTypeEnum.h4} style={styles.description}>
        //                 {currentPage == onbonardingData.length - 1 ? t("start") : t("next")}
        //             </TextBlock>
        //         }
        //     />
        // </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background.quinary,
        width: Dimensions.get("window").width,
    },
    illustration: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height * 0.6,
    },
    description: {
        verticalAlign: "middle",
        color: Colors.light.background.quinary,
        paddingVertical: 4
    }
})