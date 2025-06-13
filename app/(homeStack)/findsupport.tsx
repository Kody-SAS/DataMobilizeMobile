import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useTranslation } from 'react-i18next';
import * as Linking from 'expo-linking';
import { MaterialIcons } from '@expo/vector-icons';
import { TextBlockTypeEnum } from '../../type.d';
import { TextBlock } from '../../components/TextBlock';
import { Spacer } from '../../components/Spacer';

export default function FindSupport() {
    const {t} = useTranslation();

    const agencies = [
        {
            image: require("../../assets/images/findSupport/police.png"),
            name: t('police'),
            number: 117
        },
        {
            image: require("../../assets/images/findSupport/firedepartment.png"),
            name: t('fireFighters'),
            number: 118
        },
        {
            image: require("../../assets/images/findSupport/samu.png"),
            name: t("SAMU"),
            number: 119
        }
    ]

    const handleAgencyCall = (index: number) => {
        const agency = agencies[index];

        const phoneNumber = `tel:${agency.number}`;
        Linking.openURL(phoneNumber);
    }

    return (
        <View style={styles.container}>
            <View style={styles.emergencyContainer}>
                {agencies.map((agency, index) => (
                    <View key={index} style={styles.agency}>
                        <View>
                            <Image source={agency.image}
                                height={32}
                                width={32}
                                resizeMode='contain'/>
                            <View>
                                <TextBlock type={TextBlockTypeEnum.title} style={{fontWeight: '600'}}>{agency.name}</TextBlock>
                                <Spacer variant='medium' />
                                <TextBlock type={TextBlockTypeEnum.body} style={{fontWeight: '300'}}>{agency.number}</TextBlock>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => handleAgencyCall(index)}
                            style={styles.call}>
                            <MaterialIcons name="call" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background.quinary,
        padding: 16
    },
    emergencyContainer: {
        padding: 16,
        borderWidth: 2,
        borderRadius: 8,
        borderColor: Colors.light.background.tertiary,
        gap: 16
    },
    agency: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    agencyInfo: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    call: {
        padding: 12,
        alignItems: 'center',
        justifyContent: "center",
        backgroundColor: Colors.light.background.secondary
    }
})