// button type
export enum ButtonTypeEnum {
    primary = "primary",
    secondary = "secondary",
    tertiary = "tertiary",
    quarternary = "quarternary"
}

// text type
export enum TextBlockTypeEnum {
    h1 = "h1",
    h2 = "h2",
    h3 = "h3",
    h4 = "h4",
    h5 = "h5",
    body = "body",
    title = "title",
    caption = "caption"
}

export enum FontsEnum {
    caption = "OpenSans_300Light",
    body = "OpenSans_400Regular",
    title = "OpenSans_500Medium",
    h5 = "OpenSans_600SemiBold",
    h4 = "OpenSans_600SemiBold",
    h3 = "OpenSans_600SemiBold",
    h2 = "OpenSans_600SemiBold",
    h1 = "OpenSans_700Bold",
}

export enum FontWeightsEnum {
    light = 300,
    regular = 400,
    medium = 500,
    semibold = 600,
    bold = 700
}

export enum FontSizesEnum {
    caption = 12,
    body = 14,
    title = 16,
    h5 = 18,
    h4 = 20,
    h3 = 22,
    h2 = 24,
    h1 = 26
}

export enum LineHeightsEnum {
    caption = 14,
    body = 18,
    title = 20,
    h5 = 20,
    h4 = 22,
    h3 = 24,
    h2 = 28,
    h1 = 30
}

export type CreateUser = {
    username: string;
    email: string;
    password?: string;
    localisation?: string;
}

export type User = {
    id?: string;
    username: string;
    email: string;
    isVerified: boolean;
    localisation?: string;
    expoPushToken?: string;
}

export type LoginUser = {
    email: string;
    password: string;
}

export type VerifyUser = {
    userId: string,
    code: string
}

export type ForgotUser = {
    userId: string;
    email: string;
    isVerified: boolean;
    localisation?: string;
}

export enum ReportType {
    SafetyPerception,
    Quick,
    Incident,
    Audit
}

export enum RoadType {
    Intersection,
    Section,
    RoundAbout,
    Straight,
    Turn
}

export enum UserType {
    Pedestrian,
    Cyclist,
    Motocyclist,
    Car,
    Truck,
    Bus
}