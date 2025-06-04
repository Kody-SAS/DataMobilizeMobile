import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Pdf from "react-native-pdf";
import * as FileSystem from 'expo-file-system';
import { FAB, PaperProvider, Portal } from "react-native-paper";
import ToastMessage from "../../utils/Toast";
import { useTranslation } from "react-i18next";
import { AuditReport, AuditRoadType } from "../../type.d";
import { createAuditReport } from "../../utils/Report";
import { auditJunctionQuestionData, auditSegmentQuestionData } from "../../utils/DataSeed";
import RNHTMLtoPDF from 'react-native-html-to-pdf';

export default function Export() {
    const [state, setState] = useState({ open: false });

    const onStateChange = ({ open }: { open: boolean }) => setState({ open });

    const { open } = state;

    const data = useLocalSearchParams() as {report: string; fileName: string; imageUrl: string;};
    const { t } = useTranslation();
    const { fileName, report, imageUrl } = data;
    const parsedReport = JSON.parse(report) as AuditReport;

    const getFilePath = (value: string) => {
        console.log("file: ", fileName);
        FileSystem.getInfoAsync(`${FileSystem.documentDirectory}${fileName}`).then((fileInfo) => console.log(fileInfo));
        return `${FileSystem.cacheDirectory}${fileName}`;
    };

    const handleShowExportOptions = () => {

    }

    const handleSavePdf = async () => {
        try {
            const fileUri = `${FileSystem.documentDirectory}${fileName}`;
            const savedFileName = `Audit_report_${new Date().toString().replace(/ /g, "_").replace(/:/g, "-")}`;
            let options = {
                html: createAuditReport(parsedReport, imageUrl, parsedReport.auditRoadType == AuditRoadType.RoadSegment ? auditSegmentQuestionData : auditJunctionQuestionData),
                directory: "Documents",
                fileName: savedFileName,
                height: 842, // A4 height in points
                width: 595, // A4 width in points
            };

            let file = await RNHTMLtoPDF.convert(options)

            FileSystem.getInfoAsync(file.filePath).then((fileInfo) => console.log(fileInfo));
            ToastMessage("success", t("success"), t("pdfSaved"));
            console.log(`PDF saved to ${fileUri}`);
        } catch (error) {
            ToastMessage("error", t("error"), t("pdfSaveError"));
            console.error("Error saving PDF:", error);
        }
    };

    const handleSaveCsv = async () => {
        // Implement CSV saving logic here
        console.warn("CSV saving is not implemented yet.");
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