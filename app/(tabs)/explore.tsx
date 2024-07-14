import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '../../components/Collapsible';
import { ExternalLink } from '../../components/ExternalLink';
import ParallaxScrollView from '../../components/ParallaxScrollView';
import { TextBlock } from '../../components/TextBlock';
import { ThemedView } from '../../components/ThemedView';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}>
      <ThemedView style={styles.titleContainer}>
        <TextBlock type="title">Explore</TextBlock>
      </ThemedView>
      <TextBlock>This app includes example code to help you get started.</TextBlock>
      <Collapsible title="File-based routing">
        <TextBlock>
          This app has two screens:{' '}
          <TextBlock type="defaultSemiBold">app/(tabs)/index.tsx</TextBlock> and{' '}
          <TextBlock type="defaultSemiBold">app/(tabs)/explore.tsx</TextBlock>
        </TextBlock>
        <TextBlock>
          The layout file in <TextBlock type="defaultSemiBold">app/(tabs)/_layout.tsx</TextBlock>{' '}
          sets up the tab navigator.
        </TextBlock>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <TextBlock type="link">Learn more</TextBlock>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Android, iOS, and web support">
        <TextBlock>
          You can open this project on Android, iOS, and the web. To open the web version, press{' '}
          <TextBlock type="defaultSemiBold">w</TextBlock> in the terminal running this project.
        </TextBlock>
      </Collapsible>
      <Collapsible title="Images">
        <TextBlock>
          For static images, you can use the <TextBlock type="defaultSemiBold">@2x</TextBlock> and{' '}
          <TextBlock type="defaultSemiBold">@3x</TextBlock> suffixes to provide files for
          different screen densities
        </TextBlock>
        <Image source={require('@/assets/images/react-logo.png')} style={{ alignSelf: 'center' }} />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <TextBlock type="link">Learn more</TextBlock>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Custom fonts">
        <TextBlock>
          Open <TextBlock type="defaultSemiBold">app/_layout.tsx</TextBlock> to see how to load{' '}
          <TextBlock style={{ fontFamily: 'SpaceMono' }}>
            custom fonts such as this one.
          </TextBlock>
        </TextBlock>
        <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/font">
          <TextBlock type="link">Learn more</TextBlock>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Light and dark mode components">
        <TextBlock>
          This template has light and dark mode support. The{' '}
          <TextBlock type="defaultSemiBold">useColorScheme()</TextBlock> hook lets you inspect
          what the user's current color scheme is, and so you can adjust UI colors accordingly.
        </TextBlock>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <TextBlock type="link">Learn more</TextBlock>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Animations">
        <TextBlock>
          This template includes an example of an animated component. The{' '}
          <TextBlock type="defaultSemiBold">components/HelloWave.tsx</TextBlock> component uses
          the powerful <TextBlock type="defaultSemiBold">react-native-reanimated</TextBlock> library
          to create a waving hand animation.
        </TextBlock>
        {Platform.select({
          ios: (
            <TextBlock>
              The <TextBlock type="defaultSemiBold">components/ParallaxScrollView.tsx</TextBlock>{' '}
              component provides a parallax effect for the header image.
            </TextBlock>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
