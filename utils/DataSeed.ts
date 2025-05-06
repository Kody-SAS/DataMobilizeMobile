import { ConditionType, ReasonType, SafetyLevel, UserType } from "../type.d";

export const safetyLevelReasons : {userType: UserType, data: {type: SafetyLevel, reasons: {type: ReasonType, list: string[]}[]}[]}[] = [
    {
        userType: UserType.Pedestrian,
        data: [
            {
                type: SafetyLevel.Safe,
                reasons: [
                    {
                        type: ReasonType.infrastructure,
                        list: [
                            "Sidewalks are wide, smooth, and well-maintained.",
                            "Street lighting is bright, providing good visibility at night.",
                            "Pedestrian crossings are clearly marked and visible.",
                            "Traffic signals for pedestrians are present and functioning.",
                            "Traffic volume at intersections is low, allowing safe crossing.",
                            "Road signs indicating pedestrian areas are visible."
                        ]
                    },
                    {
                        type: ReasonType.userBehaviour,
                        list: [
                            "Vehicles yield to pedestrians at crossings.",
                            "Drivers maintain a safe speed when passing pedestrians.",
                            "Vehicles stop safely at pedestrian crossings.",
                            "Pedestrians walk within designated pedestrian zones."
                        ]
                    },
                    {
                        type: ReasonType.vehicle,
                        list: [
                            "Vehicles produce minimal noise.",
                            "Emissions from vehicles are minimal and meet environmental standards."
                        ]
                    }
                ]
            },
            {
                type: SafetyLevel.unSafe,
                reasons: [
                    {
                        type: ReasonType.infrastructure,
                        list: [
                            "Sidewalks are narrow or partially obstructed.",
                            "Street lighting is inconsistent or dim in some areas.",
                            "Pedestrian crossings are not well-marked or visible.",
                            "Traffic signals for pedestrians are often malfunctioning or absent.",
                            "Traffic volume at intersections is moderate, causing delays.",
                            "Some road signs indicating pedestrian areas are obscured or unclear."
                        ]
                    },
                    {
                        type: ReasonType.userBehaviour,
                        list: [
                            "Some vehicles fail to yield to pedestrians at crossings.",
                            "Drivers occasionally travel too close to pedestrians.",
                            "Vehicles may exceed speed limits near pedestrian areas.",
                            "Pedestrians sometimes walk on the road due to obstructed sidewalks."
                        ]
                    },
                    {
                        type: ReasonType.vehicle,
                        list: [
                            "Vehicles make moderate noise.",
                            "Emissions from vehicles are moderate and sometimes exceed limits."
                        ]
                    }
                ]
            },
            {
                type: SafetyLevel.veryUnsafe,
                reasons: [
                    {
                        type: ReasonType.infrastructure,
                        list: [
                            "Sidewalks are completely missing or heavily damaged.",
                            "Street lighting is absent or broken, making it hard to see at night.",
                            "Pedestrian crossings are poorly marked or absent.",
                            "No functioning traffic signals for pedestrians.",
                            "Traffic volume at intersections is high, causing congestion.",
                            "Road signs indicating pedestrian areas are either missing or unclear."
                        ]
                    },
                    {
                        type: ReasonType.userBehaviour,
                        list: [
                            "Drivers frequently fail to yield to pedestrians.",
                            "Vehicles often travel too fast near pedestrian areas.",
                            "Road rage or aggressive driving behavior near pedestrian zones.",
                            "Pedestrians are forced to walk on the road due to lack of sidewalks."
                        ]
                    },
                    {
                        type: ReasonType.vehicle,
                        list: [
                            "Vehicles emit significant noise, causing disturbances.",
                            "Vehicle emissions are high and exceed environmental limits."
                        ]
                    }
                ]
            }
        ]
    },
    {
        userType: UserType.Cyclist,
        data: [
            {
                type: SafetyLevel.Safe,
                reasons: [
                    {
                        type: ReasonType.infrastructure,
                        list: [
                            "Bicycle lanes are well-marked and separate from motor traffic.",
                            "Street lighting is bright, providing good visibility for cyclists.",
                            "Roads are smooth with minimal potholes or obstacles.",
                            "Traffic volume at intersections is low, providing easy passage for cyclists.",
                            "Bicycle racks and safe parking areas are available.",
                            "Road signs for cyclists are clear and visible."
                        ]
                    },
                    {
                        type: ReasonType.userBehaviour,
                        list: [
                            "Drivers maintain a safe distance from cyclists.",
                            "Vehicles respect cyclists and yield when required.",
                            "Vehicle speed is low and adjusted for cyclist safety.",
                            "Cyclists obey traffic rules and signals."
                        ]
                    },
                    {
                        type: ReasonType.vehicle,
                        list: [
                            "Vehicles produce minimal noise.",
                            "Emissions from vehicles are minimal and meet environmental standards."
                        ]
                    }
                ]
            },
            {
                type: SafetyLevel.unSafe,
                reasons: [
                    {
                        type: ReasonType.infrastructure,
                        list: [
                            "Bicycle lanes are poorly marked or sometimes blocked.",
                            "Street lighting is inconsistent or dim in certain areas.",
                            "Roads are somewhat uneven with occasional potholes or cracks.",
                            "Traffic volume at intersections is moderate, causing some congestion.",
                            "Bicycle racks and parking areas are limited or poorly located."
                        ]
                    },
                    {
                        type: ReasonType.userBehaviour,
                        list: [
                            "Some vehicles drive too close to cyclists or fail to maintain a safe distance.",
                            "Drivers occasionally fail to yield to cyclists.",
                            "Cyclists sometimes travel on roads without designated lanes.",
                            "Vehicle speed is moderate but could be more cautious around cyclists."
                        ]
                    },
                    {
                        type: ReasonType.vehicle,
                        list: [
                            "Vehicle noise levels are moderate.",
                            "Moderate emissions or visible exhaust smoke."
                        ]
                    }
                ]
            },
            {
                type: SafetyLevel.veryUnsafe,
                reasons: [
                    {
                        type: ReasonType.infrastructure,
                        list: [
                            "No designated bicycle lanes or lanes are obstructed.",
                            "Street lighting is completely absent or broken.",
                            "Roads are heavily degraded with large potholes and cracks.",
                            "Traffic volume at intersections is high, leading to dangerous congestion.",
                            "Bicycle racks or safe parking areas are non-existent."
                        ]
                    },
                    {
                        type: ReasonType.userBehaviour,
                        list: [
                            "Drivers frequently fail to yield to cyclists or drive aggressively around them.",
                            "Vehicles often travel at dangerous speeds near cyclists.",
                            "Cyclists are forced to ride in traffic without dedicated lanes or space."
                        ]
                    },
                    {
                        type: ReasonType.vehicle,
                        list: [
                            "Vehicles have major defects (e.g., bald tires, broken lights).",
                            "Lights (headlights, brake lights, indicators) are not functioning.",
                            "Vehicle produces significant noise and excessive emissions.",
                            "Vehicle emits visible exhaust smoke, far exceeding environmental limits."
                        ]
                    }
                ]
            }
        ]
    },
    {
        userType: UserType.Motocyclist,
        data: [
            {
                type: SafetyLevel.Safe,
                reasons: [
                    {
                        type: ReasonType.infrastructure,
                        list: [
                            "Roads are smooth and free of obstacles.",
                            "Motorcycle lanes are clearly marked (if available).",
                            "Street lighting is good, providing adequate visibility.",
                            "Safe zones for stopping or parking motorcycles are available.",
                            "Traffic volume at intersections is low, allowing for easy passage.",
                            "Traffic signs and signals are visible and well-maintained."
                        ]
                    },
                    {
                        type: ReasonType.userBehaviour,
                        list: [
                            "Drivers respect motorcyclists by maintaining a safe distance.",
                            "Drivers yield when required, allowing motorcyclists to pass safely.",
                            "Vehicles travel at a safe speed, mindful of motorcyclists.",
                            "Vehicle speed is low and adjusted to road conditions."
                        ]
                    },
                    {
                        type: ReasonType.vehicle,
                        list: [
                            "Vehicles are well-maintained, with no visible defects.",
                            "Tires are in good condition, brakes are responsive.",
                            "Vehicle noise levels are minimal.",
                            "Minimal emissions or exhaust smoke."
                        ]
                    }
                ]
            },
            {
                type: SafetyLevel.unSafe,
                reasons: [
                    {
                        type: ReasonType.infrastructure,
                        list: [
                            "Roads are somewhat uneven with minor cracks or obstacles.",
                            "Motorcycle lanes are poorly marked or not available.",
                            "Street lighting is dim or inconsistent in some areas.",
                            "Some road signs are faded or unclear.",
                            "Traffic volume at intersections is moderate, causing some congestion.",
                            "Stopping or parking areas for motorcycles are limited."
                        ]
                    },
                    {
                        type: ReasonType.userBehaviour,
                        list: [
                            "Some drivers do not yield to motorcyclists or fail to maintain a safe distance.",
                            "Vehicles sometimes drive too close to motorcyclists.",
                            "Motorcyclists occasionally travel at higher speeds or perform risky maneuvers.",
                            "Vehicle speed is moderate but could be more cautious for motorcyclists."
                        ]
                    },
                    {
                        type: ReasonType.vehicle,
                        list: [
                            "Vehicle shows minor wear (e.g., fading lights or tires need minor repairs).",
                            "Brakes and lights are still functional but need minor repairs.",
                            "Some noise from the vehicle or from passing traffic.",
                            "Moderate emissions or visible exhaust smoke.",
                        ]
                    }
                ]
            },
            {
                type: SafetyLevel.veryUnsafe,
                reasons: [
                    {
                        type: ReasonType.infrastructure,
                        list: [
                            "Roads are heavily degraded with significant potholes and cracks.",
                            "No dedicated motorcycle lanes or sufficient space.",
                            "No street lighting or broken lighting.",
                            "Parking or stopping spaces for motorcycles are inadequate or non-existent.",
                            "Traffic volume at intersections is high, causing delays and making navigation dangerous.",
                            "Pedestrian and motorcyclist areas are mixed, causing frequent conflicts."

                        ]
                    },
                    {
                        type: ReasonType.userBehaviour,
                        list: [
                            "Drivers frequently ignore motorcyclists, fail to yield, or drive too close.",
                            "Motorcyclists are forced to maneuver through unsafe roads or traffic.",
                            "Vehicles often travel at dangerous speeds around motorcyclists.",
                            "Vehicle speed is too high for a safe motorcycle environment."
                        ]
                    },
                    {
                        type: ReasonType.vehicle,
                        list: [
                            "Vehicles have major defects (e.g., bald tires, broken lights).",
                            "Lights (headlights, brake lights, indicators) are not functioning.",
                            "Vehicle produces significant noise and excessive emissions.",
                            "Vehicle emits visible exhaust smoke, far exceeding environmental limits."
                        ]
                    }
                ]
            }
        ]
    },
    {
        userType: UserType.Car,
        data: [
            {
                type: SafetyLevel.Safe,
                reasons: [
                    {
                        type: ReasonType.infrastructure,
                        list: [
                            "Roads are smooth, wide, and well-maintained.",
                            "Lane markings are clear and road signs are visible.",
                            "Street lighting is bright and ensures good visibility at night.",
                            "Properly marked parking areas and safe stopping zones.",
                            "Traffic volume at intersections is low, allowing for smooth flow."
                        ]
                    },
                    {
                        type: ReasonType.userBehaviour,
                        list: [
                            "Drivers consistently follow speed limits and traffic rules.",
                            "Drivers yield when required and do not engage in aggressive behavior.",
                            "Vehicle speed is low and appropriate for the environment."
                        ]
                    },
                    {
                        type: ReasonType.vehicle,
                        list: [
                            "Vehicles are well-maintained, with no visible defects.",
                            "Tires are in good condition, brakes are responsive.",
                            "Vehicle noise levels are low.",
                            "Minimal emissions from vehicles, meeting environmental standards."
                        ]
                    }
                ]
            },
            {
                type: SafetyLevel.unSafe,
                reasons: [
                    {
                        type: ReasonType.infrastructure,
                        list: [
                            "Roads are moderately uneven with some cracks or minor obstacles.",
                            "Lane markings and road signs are somewhat unclear or worn.",
                            "Street lighting is inconsistent, especially in some areas.",
                            "Traffic volume at intersections is moderate, leading to occasional delays.",
                            "Parking areas are limited or improperly located."
                        ]
                    },
                    {
                        type: ReasonType.userBehaviour,
                        list: [
                            "Drivers occasionally exceed speed limits or engage in unsafe driving behaviors.",
                            "Drivers fail to yield at intersections or pedestrian crossings.",
                            "Vehicle speed is moderate but could be safer in residential or pedestrian zones."
                        ]
                    },
                    {
                        type: ReasonType.vehicle,
                        list: [
                            "Minor maintenance issues with the vehicle (e.g., worn-out tires or lights).",
                            "Moderate noise from engine or exhaust.",
                            "Vehicle emissions slightly exceed environmental limits."
                        ]
                    }
                ]
            },
            {
                type: SafetyLevel.veryUnsafe,
                reasons: [
                    {
                        type: ReasonType.infrastructure,
                        list: [
                            "Roads are heavily degraded with large potholes and obstacles.",
                            "Lane markings and road signs are not visible or completely absent.",
                            "No street lighting or broken street lighting.",
                            "Traffic volume at intersections is high, causing significant delays and congestion.",
                            "Parking areas are scarce or poorly marked."
                        ]
                    },
                    {
                        type: ReasonType.userBehaviour,
                        list: [
                            "Aggressive driving, including speeding, tailgating, or cutting off others.",
                            "Drivers frequently fail to yield to pedestrians or cyclists.",
                            "Vehicles often travel at excessive speeds."
                        ]
                    },
                    {
                        type: ReasonType.vehicle,
                        list: [
                            "Vehicle defects, such as broken lights, bald tires, or faulty brakes.",
                            "Major noise issues from engine or exhaust.",
                            "Excessive emissions or visible exhaust smoke."
                        ]
                    }
                ]
            }
        ]
    },
    {
        userType: UserType.Bus,
        data: [
            {
                type: SafetyLevel.Safe,
                reasons: [
                    {
                        type: ReasonType.infrastructure,
                        list: [
                            "Roads are smooth, wide, and well-maintained.",
                            "Lane markings are clear and road signs are visible.",
                            "Street lighting is bright and ensures good visibility at night.",
                            "Properly marked parking areas and safe stopping zones.",
                            "Traffic volume at intersections is low, allowing for smooth flow."
                        ]
                    },
                    {
                        type: ReasonType.userBehaviour,
                        list: [
                            "Drivers consistently follow speed limits and traffic rules.",
                            "Drivers yield when required and do not engage in aggressive behavior.",
                            "Vehicle speed is low and appropriate for the environment."
                        ]
                    },
                    {
                        type: ReasonType.vehicle,
                        list: [
                            "Vehicles are well-maintained, with no visible defects.",
                            "Tires are in good condition, brakes are responsive.",
                            "Vehicle noise levels are low.",
                            "Minimal emissions from vehicles, meeting environmental standards."
                        ]
                    }
                ]
            },
            {
                type: SafetyLevel.unSafe,
                reasons: [
                    {
                        type: ReasonType.infrastructure,
                        list: [
                            "Roads are moderately uneven with some cracks or minor obstacles.",
                            "Lane markings and road signs are somewhat unclear or worn.",
                            "Street lighting is inconsistent, especially in some areas.",
                            "Traffic volume at intersections is moderate, leading to occasional delays.",
                            "Parking areas are limited or improperly located."
                        ]
                    },
                    {
                        type: ReasonType.userBehaviour,
                        list: [
                            "Drivers occasionally exceed speed limits or engage in unsafe driving behaviors.",
                            "Drivers fail to yield at intersections or pedestrian crossings.",
                            "Vehicle speed is moderate but could be safer in residential or pedestrian zones."
                        ]
                    },
                    {
                        type: ReasonType.vehicle,
                        list: [
                            "Minor maintenance issues with the vehicle (e.g., worn-out tires or lights).",
                            "Moderate noise from engine or exhaust.",
                            "Vehicle emissions slightly exceed environmental limits."
                        ]
                    }
                ]
            },
            {
                type: SafetyLevel.veryUnsafe,
                reasons: [
                    {
                        type: ReasonType.infrastructure,
                        list: [
                            "Roads are heavily degraded with large potholes and obstacles.",
                            "Lane markings and road signs are not visible or completely absent.",
                            "No street lighting or broken street lighting.",
                            "Traffic volume at intersections is high, causing significant delays and congestion.",
                            "Parking areas are scarce or poorly marked."
                        ]
                    },
                    {
                        type: ReasonType.userBehaviour,
                        list: [
                            "Aggressive driving, including speeding, tailgating, or cutting off others.",
                            "Drivers frequently fail to yield to pedestrians or cyclists.",
                            "Vehicles often travel at excessive speeds."
                        ]
                    },
                    {
                        type: ReasonType.vehicle,
                        list: [
                            "Vehicle defects, such as broken lights, bald tires, or faulty brakes.",
                            "Major noise issues from engine or exhaust.",
                            "Excessive emissions or visible exhaust smoke."
                        ]
                    }
                ]
            }
        ]
    },
    {
        userType: UserType.Truck,
        data: [
            {
                type: SafetyLevel.Safe,
                reasons: [
                    {
                        type: ReasonType.infrastructure,
                        list: [
                            "Roads are smooth, wide, and well-maintained.",
                            "Lane markings are clear and road signs are visible.",
                            "Street lighting is bright and ensures good visibility at night.",
                            "Properly marked parking areas and safe stopping zones.",
                            "Traffic volume at intersections is low, allowing for smooth flow."
                        ]
                    },
                    {
                        type: ReasonType.userBehaviour,
                        list: [
                            "Drivers consistently follow speed limits and traffic rules.",
                            "Drivers yield when required and do not engage in aggressive behavior.",
                            "Vehicle speed is low and appropriate for the environment."
                        ]
                    },
                    {
                        type: ReasonType.vehicle,
                        list: [
                            "Vehicles are well-maintained, with no visible defects.",
                            "Tires are in good condition, brakes are responsive.",
                            "Vehicle noise levels are low.",
                            "Minimal emissions from vehicles, meeting environmental standards."
                        ]
                    }
                ]
            },
            {
                type: SafetyLevel.unSafe,
                reasons: [
                    {
                        type: ReasonType.infrastructure,
                        list: [
                            "Roads are moderately uneven with some cracks or minor obstacles.",
                            "Lane markings and road signs are somewhat unclear or worn.",
                            "Street lighting is inconsistent, especially in some areas.",
                            "Traffic volume at intersections is moderate, leading to occasional delays.",
                            "Parking areas are limited or improperly located."
                        ]
                    },
                    {
                        type: ReasonType.userBehaviour,
                        list: [
                            "Drivers occasionally exceed speed limits or engage in unsafe driving behaviors.",
                            "Drivers fail to yield at intersections or pedestrian crossings.",
                            "Vehicle speed is moderate but could be safer in residential or pedestrian zones."
                        ]
                    },
                    {
                        type: ReasonType.vehicle,
                        list: [
                            "Minor maintenance issues with the vehicle (e.g., worn-out tires or lights).",
                            "Moderate noise from engine or exhaust.",
                            "Vehicle emissions slightly exceed environmental limits."
                        ]
                    }
                ]
            },
            {
                type: SafetyLevel.veryUnsafe,
                reasons: [
                    {
                        type: ReasonType.infrastructure,
                        list: [
                            "Roads are heavily degraded with large potholes and obstacles.",
                            "Lane markings and road signs are not visible or completely absent.",
                            "No street lighting or broken street lighting.",
                            "Traffic volume at intersections is high, causing significant delays and congestion.",
                            "Parking areas are scarce or poorly marked."
                        ]
                    },
                    {
                        type: ReasonType.userBehaviour,
                        list: [
                            "Aggressive driving, including speeding, tailgating, or cutting off others.",
                            "Drivers frequently fail to yield to pedestrians or cyclists.",
                            "Vehicles often travel at excessive speeds."
                        ]
                    },
                    {
                        type: ReasonType.vehicle,
                        list: [
                            "Vehicle defects, such as broken lights, bald tires, or faulty brakes.",
                            "Major noise issues from engine or exhaust.",
                            "Excessive emissions or visible exhaust smoke."
                        ]
                    }
                ]
            }
        ]
    }
]

export const conditionListData : {type: ConditionType, list: string[]}[]= [
    {
        type: ConditionType.PavementCondition,
        list: [
            "Cracks",
            "Potholes",
            "Uneven surfaces",
            "Surface wear and tear",
            "Slippery surfaces"
        ]
    },
    {
        type: ConditionType.TrafficSigns,
        list: [
            "Missing signs",
            "Broken or damaged signs",
            "Faded or unclear signs",
            "Incorrect or confusing signs"
        ]
    },
    {
        type: ConditionType.SidewalkCondition,
        list: [
            "Damaged or uneven pavement",
            "Obstructions on sidewalks",
            "Missing sidewalks",
            "Poor lighting or visibility on sidewalks"
        ]
    },
    {
        type: ConditionType.DrainageIssues,
        list: [
            "Blocked or clogged drains",
            "Potholes near drainage systems",
            "Flooded areas due to drainage failure"
        ]
    },
    {
        type: ConditionType.StreetLighting,
        list: [
            "Broken or non-functional streetlights",
            "Insufficient lighting in certain areas",
            "Lights causing glare or blindness for drivers"
        ]
    },
    {
        type: ConditionType.CrosswalksAndPedestrian,
        list: [
            "Missing or faded crosswalk markings",
            "Uneven or broken pedestrian crossings",
            "Obstructions on crosswalks",
            "Lack of ramps or accessibility features"
        ]
    },
    {
        type: ConditionType.RoadSignage,
        list: [
            "Missing or damaged bicycle lane signs",
            "Lack of bike lane signage",
            "Faded or unclear signs"
        ]
    },
    {
        type: ConditionType.TrafficControlDevices,
        list: [
            "Malfunctioning traffic lights or signals",
            "Broken traffic barriers or fences",
            "Unclear or misleading lane markings"
        ]
    },
    {
        type: ConditionType.BusStopAndStation,
        list: [
            "Poorly located or missing bus stops",
            "Damaged or insufficient shelter at bus stops",
            "Missing or damaged bus stop signs"
        ]
    },
    {
        type: ConditionType.RoadsideObstacles,
        list: [
            "Trees or bushes blocking visibility",
            "Unmarked roadwork or construction zones",
            "Fallen debris or branches"
        ]
    },
    {
        type: ConditionType.ParkingAreas,
        list: [
            "Poorly marked or unclear parking spaces",
            "Obstructed parking areas",
            "Unsafe parking locations"
        ]
    },
    {
        type: ConditionType.RoadGeometry,
        list: [
            "Sharp bends or dangerous curves without proper signage",
            "Insufficient visibility at turns or intersections",
            "Narrow lanes or inadequate shoulders"
        ]
    }
]

