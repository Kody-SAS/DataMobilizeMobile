import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Pdf from "react-native-pdf";

export default function Export() {
    const [pdfUrl, setPdfUrl] = useState<string>("");

    const data = useLocalSearchParams() as {report: string;};
    const { report } = data;

    useEffect(() => {
        if (report) {
            setPdfUrl(report);
        }
    }, [report]);

    return (
         <View style={styles.container}>
            <Pdf
                source={{uri: pdfUrl, cache: true}}
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
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
    }
});