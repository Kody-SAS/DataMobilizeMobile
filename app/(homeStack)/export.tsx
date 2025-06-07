import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, StyleSheet, Dimensions, Platform } from "react-native";
import Pdf from "react-native-pdf";
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import {File, Paths} from 'expo-file-system/next';
import { FAB, PaperProvider, Portal } from "react-native-paper";
import ToastMessage from "../../utils/Toast";
import { useTranslation } from "react-i18next";
import { AuditReport, AuditRoadType, UserType } from "../../type.d";
import { auditJunctionQuestionData, auditSegmentQuestionData } from "../../utils/DataSeed";
import Papa from "papaparse";

export default function Export() {
    const [state, setState] = useState({ open: false });

    const onStateChange = ({ open }: { open: boolean }) => setState({ open });

    const { open } = state;

    const data = useLocalSearchParams() as {report: string; fileName: string; imageUrl: string;};
    const { t } = useTranslation();
    const { fileName, report, imageUrl } = data;
    const parsedReport = JSON.parse(report) as AuditReport;

    const getFilePath = (value: string) => {
        FileSystem.getInfoAsync(`${FileSystem.documentDirectory}${fileName}`).then((fileInfo) => console.log(fileInfo));
        return `${FileSystem.cacheDirectory}${fileName}`;
    };

    const savedFileName = `Audit_report_${new Date().toString().replace(/ /g, "_").replace(/:/g, "-")}`;

    const handleSavePdf = async () => {
        try {
            
            if (Platform.OS == 'ios') {

                await Sharing.shareAsync(getFilePath(fileName), {
                    mimeType: 'application/pdf',
                    dialogTitle: t('saveOrSharePdf')
                })
            }
            else if (Platform.OS == 'android') {
                const perm = await MediaLibrary.getPermissionsAsync();

                if (!perm.granted) {
                    console.log(perm)
                    const permission = await MediaLibrary.requestPermissionsAsync();
                    if (!permission.granted) {
                       alert("Permissions denied");
                       return;
                    }
                }

                const permissions =
                await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
                if (!permissions.granted) {
                    alert("Permissions denied");
                    return;
                }

                const printFile = await FileSystem.StorageAccessFramework.readAsStringAsync(getFilePath(fileName), {encoding: 'base64'});
                console.log(printFile.length);
                const uri = await FileSystem.StorageAccessFramework.createFileAsync(
                    permissions.directoryUri,
                    savedFileName,
                    "application/pdf"
                )

                await FileSystem.writeAsStringAsync(
                    uri,
                    printFile,
                    {encoding: 'base64'}
                );

                ToastMessage("success", t("success"), t("csvSaved"));
                console.log(`CSV saved to ${FileSystem.documentDirectory}Documents/${savedFileName}.csv ${Paths.document.uri}Documents`);
                ToastMessage("success", t("success"), t("pdfSaved"));
            }
        } catch (error) {
            ToastMessage("error", t("error"), t("pdfSaveError"));
            console.error("Error saving PDF:", error);
        }
    };

    const handleSaveCsv = async () => {

        try {
            const csvContent = Papa.unparse(combineQuestionsAndAnswers());

            if (Platform.OS == 'ios') {

                const file = new File(FileSystem.cacheDirectory!, `${savedFileName}.csv`);
                file.create();
                file.write(csvContent);
    
                await Sharing.shareAsync(`file://${FileSystem.cacheDirectory}${savedFileName}.csv`, {
                    dialogTitle: t('saveOrShareCsv')
                })
            }
            else if (Platform.OS == 'android') {

                const permissions =
                await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
                if (!permissions.granted) {
                    alert("Permissions denied");
                    return;
                }
    
                const uri = await FileSystem.StorageAccessFramework.createFileAsync(
                    permissions.directoryUri,
                    savedFileName,
                    "text/csv"
                )
                await FileSystem.writeAsStringAsync(
                    uri,
                    csvContent
                )
                ToastMessage("success", t("success"), t("csvSaved"));
                console.log(`CSV saved to ${FileSystem.documentDirectory}Documents/${savedFileName}.csv ${Paths.document.uri}Documents`);
            }

        } catch (e) {
            ToastMessage("error", t("error"), t("csvSaveError"));
            console.error("Error saving CSV file:", e);
        }
    }

    const combineQuestionsAndAnswers = () => {
        const questionsData = parsedReport.auditRoadType == AuditRoadType.RoadSegment ? auditSegmentQuestionData : auditJunctionQuestionData;
        return questionsData.map((data) => {
            switch(data.type) {
                case UserType.Pedestrian: {
                    return {
                        type: data.type,
                        questions: data.questions.map((item, index) => ({
                            ...item,
                            selected: parsedReport.answers.pedestrian[index]
                        }))
                    }
                }
                case UserType.Cyclist: {
                    return {
                        type: data.type,
                        questions: data.questions.map((item, index) => ({
                            ...item,
                            selected: parsedReport.answers.cyclist[index]
                        }))
                    }
                }
                case UserType.Motocyclist: {
                    return {
                        type: data.type,
                        questions: data.questions.map((item, index) => ({
                            ...item,
                            selected: parsedReport.answers.motocyclist[index]
                        }))
                    }
                }
                case UserType.Car: {
                    return {
                        type: data.type,
                        questions: data.questions.map((item, index) => ({
                            ...item,
                            selected: parsedReport.answers.car[index]
                        }))
                    }
                }
                default:
                    return [];
            }
        });
    }

    return (
        <PaperProvider>
            <View style={styles.container}>
                <Pdf
                    source={{uri: getFilePath(fileName), cache: true}}
                    onLoadComplete={(numberOfPages,filePath) => {
                        console.log(`Number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page,numberOfPages) => {
                        console.log(`Current page: ${page}`);
                    }}
                    onError={(error) => {
                        console.log(error);
                    }}
                    onPressLink={(uri) => {
                        console.log(`Link pressed: ${uri}`);
                    }}
                    style={styles.pdf}/>
                    
                {/* Export the report as a PDF or CSV */}
                <Portal>

                    <FAB.Group
                        open={open}
                        visible
                        icon={open ? 'alpha-x-circle-outline' : 'export'}
                        actions={[
                            { icon: 'file-pdf-box', onPress: handleSavePdf, label: 'Save as PDF' },
                            {
                                icon: 'file-excel',
                                label: 'Save as CSV',
                                onPress: handleSaveCsv,
                            },
                        ]}
                        onStateChange={onStateChange}
                        onPress={() => {
                            if (open) {
                            // do something if the speed dial is open
                            }
                        }}
                        />
                </Portal>
            </View>
       </PaperProvider> 
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});