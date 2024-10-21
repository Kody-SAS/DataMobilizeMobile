import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '../hooks/useThemeColor';
import { FontsEnum, FontSizesEnum, FontWeightsEnum, LineHeightsEnum, TextBlockTypeEnum } from '../type.d';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: TextBlockTypeEnum;
};

export function TextBlock({
  style,
  lightColor,
  darkColor,
  type = TextBlockTypeEnum.body,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color: color.toString() },
        type === TextBlockTypeEnum.caption ? styles.caption : undefined,
        type === TextBlockTypeEnum.title ? styles.title : undefined,
        type === TextBlockTypeEnum.body ? styles.body : undefined,
        type === TextBlockTypeEnum.h5 ? styles.h5 : undefined,
        type === TextBlockTypeEnum.h4 ? styles.h4 : undefined,
        type === TextBlockTypeEnum.h3 ? styles.h3 : undefined,
        type === TextBlockTypeEnum.h2 ? styles.h2 : undefined,
        type === TextBlockTypeEnum.h1 ? styles.h1 : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  caption: {
    fontSize: FontSizesEnum.caption,
    fontWeight: FontWeightsEnum.light,
    lineHeight: LineHeightsEnum.caption,
    fontFamily: FontsEnum.caption
  },
  title: {
    fontSize: FontSizesEnum.title,
    fontWeight: FontWeightsEnum.medium,
    lineHeight: LineHeightsEnum.title,
    fontFamily: FontsEnum.title
  },
  body: {
    fontSize: FontSizesEnum.body,
    fontWeight: FontWeightsEnum.regular,
    lineHeight: LineHeightsEnum.body,
    fontFamily: FontsEnum.body
  },
  h5: {
    fontSize: FontSizesEnum.h5,
    fontWeight: FontWeightsEnum.medium,
    lineHeight: LineHeightsEnum.h5,
    fontFamily: FontsEnum.h5
  },
  h4: {
    fontSize: FontSizesEnum.h4,
    fontWeight: FontWeightsEnum.semibold,
    lineHeight: LineHeightsEnum.h4,
    fontFamily: FontsEnum.h4
  },
  h3: {
    fontSize: FontSizesEnum.h3,
    fontWeight: FontWeightsEnum.semibold,
    lineHeight: LineHeightsEnum.h3,
    fontFamily: FontsEnum.h3
  },
  h2: {
    fontSize: FontSizesEnum.h2,
    fontWeight: FontWeightsEnum.bold,
    lineHeight: LineHeightsEnum.h2,
    fontFamily: FontsEnum.h2
  },
  h1: {
    fontSize: FontSizesEnum.h1,
    fontWeight: FontWeightsEnum.bold,
    lineHeight: LineHeightsEnum.h1,
    fontFamily: FontsEnum.h1
  }
});
