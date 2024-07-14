import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '../../components/HelloWave';
import ParallaxScrollView from '../../components/ParallaxScrollView';
import { TextBlock } from '../../components/TextBlock';
import { ThemedView } from '../../components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <TextBlock type="title">Welcome!</TextBlock>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <TextBlock type="subtitle">Step 1: Try it</TextBlock>
        <TextBlock>
          Edit <TextBlock type="defaultSemiBold">app/(tabs)/index.tsx</TextBlock> to see changes.
          Press{' '}
          <TextBlock type="defaultSemiBold">
            {Platform.select({ ios: 'cmd + d', android: 'cmd + m' })}
          </TextBlock>{' '}
          to open developer tools.
        </TextBlock>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <TextBlock type="subtitle">Step 2: Explore</TextBlock>
        <TextBlock>
          Tap the Explore tab to learn more about what's included in this starter app.
        </TextBlock>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <TextBlock type="subtitle">Step 3: Get a fresh start</TextBlock>
        <TextBlock>
          When you're ready, run{' '}
          <TextBlock type="defaultSemiBold">npm run reset-project</TextBlock> to get a fresh{' '}
          <TextBlock type="defaultSemiBold">app</TextBlock> directory. This will move the current{' '}
          <TextBlock type="defaultSemiBold">app</TextBlock> to{' '}
          <TextBlock type="defaultSemiBold">app-example</TextBlock>.
        </TextBlock>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
