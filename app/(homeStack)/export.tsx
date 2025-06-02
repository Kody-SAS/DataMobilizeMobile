import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Pdf from "react-native-pdf";
import * as FileSystem from 'expo-file-system';
import { FAB, PaperProvider, Portal } from "react-native-paper";
import ToastMessage from "../../utils/Toast";
import { useTranslation } from "react-i18next";

export default function Export() {
    const [pdfUrl, setPdfUrl] = useState<string>("");
    const [state, setState] = useState({ open: false });

    const onStateChange = ({ open }: { open: boolean }) => setState({ open });

    const { open } = state;

    const data = useLocalSearchParams() as {report: string;};
    const { t } = useTranslation();
    const { report } = data;

    const getFilePath = (fileName: string) => {
        FileSystem.getInfoAsync(`${FileSystem.cacheDirectory}${fileName}`).then((fileInfo) => console.log(fileInfo));
        console.log(`File path: ${FileSystem.cacheDirectory}${fileName}`);
        return `${FileSystem.cacheDirectory}${fileName}`;
    };

    const handleShowExportOptions = () => {

    }

    const handleSavePdf = async () => {
        if (pdfUrl) {
            try {
                const fileUri = `${FileSystem.documentDirectory}${report}`;
                await FileSystem.copyAsync({
                    from: pdfUrl,
                    to: fileUri,
                });
                ToastMessage("success", t("success"), t("pdfSaved"));
                console.log(`PDF saved to ${fileUri}`);
            } catch (error) {
                ToastMessage("error", t("error"), t("pdfSaveError"));
                console.error("Error saving PDF:", error);
            }
        } else {
            ToastMessage("info", t("info"), t("noPdfUrl"));
            console.warn("No PDF URL available to save.");
        }
    };

    const handleSaveCsv = async () => {
        // Implement CSV saving logic here
        console.warn("CSV saving is not implemented yet.");
    }

    useEffect(() => {
        if (report) {
            setPdfUrl(getFilePath(`${report}`));
            console.log("URL: ", pdfUrl)
        }
    }, [report]);

    return (
        <PaperProvider>
            <View style={styles.container}>
                <Pdf
                    source={{uri: getFilePath(`${report}`), cache: true}}
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