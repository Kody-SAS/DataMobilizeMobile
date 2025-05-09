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
    SafetyPerception = "SafetyPerception",
    Quick = "Quick",
    Incident = "Incident",
    Audit = "Audit"
}

export enum RoadType {
    UrbanRoad = "Urban Road",
    RuralRoad = "Rural Road",
    Highway = "Highway",
    SignalizedIntersection = "Signalized Intersection",
    UnsignalizedIntersection = "Unsignalized Intersection",
    RoundAbout = "Roundabout",
    ParkingLot = "Parking Lot",
    BusStop = "Bus stop",
    BusStation = "Bus station"
}

export enum UserType {
    Pedestrian = "Pedestrian",
    Cyclist = "Cyclist",
    Motocyclist = "Motocyclist",
    Car = "Car",
    Truck = "Truck",
    Bus = "Bus"
}

export enum SafetyLevel {
    Safe = 'Safe',
    unSafe = 'Unsafe',
    veryUnsafe = 'Very Unsafe'
}

export enum ReasonType {
    infrastructure = 'Infrastructure',
    userBehaviour = 'User Behaviour',
    vehicle = 'Vehicle',
}

export enum ConditionType {
    PavementCondition = "Pavement Condition",
    TrafficSigns = "Traffic Signs Condition",
    SidewalkCondition = "Sidewalk Condition",
    DrainageIssues = "Drainage Issues",
    StreetLighting = "Street Lighting Condition",
    CrosswalksAndPedestrian = "Crosswalks and Pedestrian Facilities",
    RoadSignage = "Road Signage for Cyclists",
    TrafficControlDevices = "Traffic Control Devices",
    BusStopAndStation = "Bus Stops and Stations",
    RoadsideObstacles = "Roadside Obstacles",
    ParkingAreas = "Parking Areas",
    RoadGeometry = "Road Geometry Issues"
}

export enum SeverityLevel {
    NoRisky = "No Risk",
    Risky = "Risky",
    UrgentRisk = "Urgent Risk"
}

export enum IncidentType {
    Crash = "Crash",
    Infrastructure = "Infrastructure",
    Equipment = "Equipment",
}

export enum IncidentSeverity {
    Fatal = "Fatal",
    MinorInjury = "Minor Injury",
    SeriousInjury = "Serious Injury",
    MaterialDamage = "Material Damage",
}

export type IncidentCrashData = {
    severity: IncidentSeverity;
    count: { type: UserType; number: number }[];
}

export type IncidentInfrastructureData = {
    severity: IncidentSeverity;
    reasons: string[];
}

export type IncidentEquipmentData = {
    severity: IncidentSeverity;
    reasons: string[];
}

export type SafetyPerceptionReport =  {
    id?: string;
    userId: string;
    latitude: number;
    longitude: number;
    createdAt: Date;
    roadType: RoadType;
    userType: UserType;
    safetyLevel: SafetyLevel;
    reportType: ReportType;
    reasons: {
        type: ReasonType;
        list: string[];
    }[];
    comment?: string;
    images: string[];
}

export type QuickReport = {
    id?: string;
    userId: string;
    latitude: number;
    longitude: number;
    createdAt: Date;
    roadType: RoadType;
    conditionType: ConditionType;
    conditionDescription: string;
    severityLevel: SeverityLevel;
    reportType: ReportType;
    comment?: string;
    images: string[];
}

export type IncidentReport = {
    id?: string;
    userId: string;
    latitude: number;
    longitude: number;
    createdAt: Date;
    roadType: RoadType;
    incidentType: IncidentType;
    incidentTypeData?: IncidentCrashData | IncidentInfrastructureData | IncidentEquipmentData;
    reportType: ReportType;
    description: string;
    images: string[];
}