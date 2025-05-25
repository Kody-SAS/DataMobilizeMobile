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

export const infrastructureIncidentReasonsData : string[] = [
   "Landslide",
    "Road collapse",
    "Flooding",
    "Debris blocking the road",
    "Road failure",
    "Bridge issues"
]

export const equipmentIncidentReasonsData : string[] = [
    "Falling pole",
    "Damaged traffic signals",
    "Broken road signs",
    "Broken traffic lights",
    "Damaged barriers or fences"
]

export const auditSegmentQuestionData: {type: UserType, questions: {question: string, answers: string[]}[]}[] = [
    {
        type: UserType.Pedestrian,
        questions: [
            {
                question: "Are sidewalks present on both sides?",
                answers: [
                    "Yes, both sides",
                    "One side only",
                    "No sidewalks"
                ]
            },
            {
                question: "What is the condition of the sidewalk?",
                answers: [
                    "Smooth, well-maintained",
                    "Minor cracks or obstructions",
                    "Heavily damaged or obstructed"
                ]
            },
            {
                question: "What is the width of the sidewalk?",
                answers: [
                    ">2m",
                    "1-2m",
                    "Less than 1m or No sidewalk"
                ]
            },
            {
                question: "Is the street lighting sufficient for pedestrians?",
                answers: [
                    "Bright",
                    "Dim",
                    "No lighting"
                ]
            },
            {
                question: "Are pedestrian crossings available within 100m?",
                answers: [
                    "Yes, well-marked",
                    "Present but faded",
                    "No crossings"
                ]
            },
            {
                question: "Are pedestrian barriers (railings, bollards) present where needed?",
                answers: [
                    "Yes",
                    "Some barriers missing",
                    "No barriers"
                ]
            },
            {
                question: "Are road signs for pedestrians visible?",
                answers: [
                    "Clear & visible",
                    "Some missing",
                    "No signs"
                ]
            },
            {
                question: "Are there obstructions on the sidewalk (parked cars, vendors, etc.)?",
                answers: [
                    "No obstructions",
                    "Some obstructions",
                    "Many obstructions"
                ]
            },
            {
                question: "Is the road speed controlled (e.g., speed bumps, narrowing)?",
                answers: [
                    "Yes",
                    "Some measures",
                    "No speed control"
                ]
            },
            {
                question: "What is the observed vehicle speed in the segment?",
                answers: [
                    "<30 km/h",
                    "30-50 km/h",
                    ">50 km/h"
                ]
            }
        ]
    },
    {
        type: UserType.Cyclist,
        questions: [
            {
                question: "Is there a dedicated cycle lane?",
                answers: [
                    "Yes, exclusive",
                    "Shared lane with vehicles",
                    "No cycle lane"
                ]
            },
            {
                question: "Is the cycle lane physically separated from motor vehicles?",
                answers: [
                    "Physically separated",
                    "Painted only",
                    "No separation"
                ]
            },
            {
                question: "What is the width of the cycle lane?",
                answers: [
                    ">2m",
                    "1-2m",
                    "Less than 1m or No lane"
                ]
            },
            {
                question: "What is the condition of the cycle lane?",
                answers: [
                    "Smooth",
                    "Some cracks",
                    "Major potholes/obstacles"
                ]
            },
            {
                question: "Is the street lighting sufficient for cyclists?",
                answers: [
                    "Bright",
                    "Dim",
                    "No lighting"
                ]
            },
            {
                question: "What is the condition of the road surface for cyclists?",
                answers: [
                    "Smooth",
                    "Some minor potholes",
                    "Major potholes"
                ]
            },
            {
                question: "Are there road signs for cyclists?",
                answers: [
                    "Clear & visible",
                    "Some missing",
                    "No signs"
                ]
            },
            {
                question: "Are cycle lanes frequently obstructed (parked cars, barriers, debris)?",
                answers: [
                    "No obstructions",
                    "Some obstructions",
                    "Many obstructions"
                ]
            },
            {
                question: "Is the traffic volume low?",
                answers: [
                    "Low",
                    "Moderate",
                    "High"
                ]
            },
            {
                question: "Is there bicycle parking or safe storage?",
                answers: [
                    "Yes",
                    "Limited parking",
                    "No bicycle parking"
                ]
            }
        ]
    },
    {
        type: UserType.Motocyclist,
        questions: [
            {
                question: "What is the condition of the road surface for motorcycles?",
                answers: [
                    "Smooth",
                    "Some potholes",
                    "Major potholes"
                ]
            },
            {
                question: "Are motorcycle lanes available?",
                answers: [
                    "Clearly marked",
                    "Shared lanes",
                    "No lanes"
                ]
            },
            {
                question: "Is street lighting sufficient for motorcyclists?",
                answers: [
                    "Bright",
                    "Dim",
                    "No lighting"
                ]
            },
            {
                question: "Are safe parking zones for motorcycles present?",
                answers: [
                    "Yes",
                    "Informal parking",
                    "No parking"
                ]
            },
            {
                question: "Is traffic volume low for motorcyclists?",
                answers: [
                    "Low",
                    "Moderate",
                    "High"
                ]
            },
            {
                question: "Are lane markings visible?",
                answers: [
                    "Clear",
                    "Faded",
                    "No markings"
                ]
            },
            {
                question: "Are speed control measures present?",
                answers: [
                    "Speed bumps, narrowing",
                    "Some measures",
                    "No speed control"
                ]
            },
            {
                question: "Are traffic signs visible for motorcyclists?",
                answers: [
                    "Clear & well-maintained",
                    "Some unclear",
                    "No signs"
                ]
            },
            {
                question: "Are there frequent road hazards (debris, potholes, oil spills, open ditches/gutters)?",
                answers: [
                    "No hazards",
                    "Some minor hazards",
                    "Many hazards"
                ]
            },
            {
                question: "Do motorcycles have a designated waiting area at signals?",
                answers: [
                    "Yes",
                    "Partially marked",
                    "No"
                ]
            }
        ]
    },
    {
        type: UserType.Car,
        questions: [
            {
                question: "What is the road surface condition?",
                answers: [
                    "Smooth",
                    "Some potholes",
                    "Major potholes"
                ]
            },
            {
                question: "What is the road width per lane?",
                answers: [
                    ">2.4m",
                    "1.5-2.4m",
                    "<1.5m"
                ]
            },
            {
                question: "Are lane markings visible?",
                answers: [
                    "Clear",
                    "Faded",
                    "No markings"
                ]
            },
            {
                question: "Is street lighting sufficient?",
                answers: [
                    "Bright",
                    "Dim",
                    "No lighting"
                ]
            },
            {
                question: "Are parking areas clearly marked?",
                answers: [
                    "Yes",
                    "Some markings",
                    "No parking"
                ]
            },
            {
                question: "Is traffic volume low?",
                answers: [
                    "Low",
                    "Moderate",
                    "High"
                ]
            },
            {
                question: "Are traffic signs visible?",
                answers: [
                    "Clear",
                    "Some unclear",
                    "No signs"
                ]
            },
            {
                question: "Are speed control measures present?",
                answers: [
                    "Speed bumps, narrowing",
                    "Some measures",
                    "No speed control"
                ]
            },
            {
                question: "Are traffic lights present and working?",
                answers: [
                    "Yes",
                    "Some not working",
                    "No traffic lights"
                ]
            },
            {
                question: "Are road hazards frequent (fallen objects, potholes, debris)?",
                answers: [
                    "No hazards",
                    "Some hazards",
                    "Many hazards"
                ]
            }
        ]
    }
];

export const auditJunctionQuestionData: {type: UserType, questions: {question: string, answers: string[]}[]}[] = [
    {
        type: UserType.Pedestrian,
        questions: [
            {
                question: "Are pedestrian crossings marked at all legs?",
                answers: [
                    "Marked & highly visible",
                    "Marked but faded",
                    "No crossings"
                ]
            },
            {
                question: "Are pedestrian signals present and working?",
                answers: [
                    "Yes, all signals work",
                    "Some signals missing/not working",
                    "No pedestrian signals"
                ]
            },
            {
                question: "Are pedestrian refuge islands provided at wide intersections?",
                answers: [
                    "Yes, all crossings have islands",
                    "Some crossings have islands",
                    "No pedestrian islands"
                ]
            },
            {
                question: "Is the waiting area for pedestrians safe and spacious?",
                answers: [
                    "Wide, safe & protected",
                    "Narrow, limited space",
                    "No dedicated pedestrian waiting area"
                ]
            },
            {
                question: "Is street lighting sufficient for pedestrians?",
                answers: [
                    "Bright",
                    "Dim",
                    "No lighting"
                ]
            },
            {
                question: "Are pedestrian barriers (railings) present where needed?",
                answers: [
                    "Yes",
                    "Some barriers missing",
                    "No barriers"
                ]
            },
            {
                question: "Is the pedestrian crossing distance short and safe?",
                answers: [
                    "<10m crossing distance",
                    "10-15m crossing",
                    ">15m crossing, long exposure to traffic"
                ]
            },
            {
                question: "Is there a pedestrian phase at the signal?",
                answers: [
                    "Dedicated pedestrian phase",
                    "Shared with vehicles",
                    "No pedestrian phase"
                ]
            },
            {
                question: "Is pedestrian traffic volume accommodated safely?",
                answers: [
                    "Plenty of space for pedestrians",
                    "Moderate crowding",
                    "Overcrowding, pedestrians forced onto the road"
                ]
            },
            {
                question: "Is traffic volume low, making crossing easy?",
                answers: [
                    "Low traffic",
                    "Moderate traffic",
                    "High traffic"
                ]
            }
        ]
    },
    {
        type: UserType.Cyclist,
        questions: [
            {
                question: "Are bicycle lanes clearly marked through the intersection?",
                answers: [
                    "Clearly marked & continuous",
                    "Partially marked",
                    "No cycle lane markings"
                ]
            },
            {
                question: "Are there separate cycle waiting areas (bike boxes)?",
                answers: [
                    "Clearly marked bike boxes",
                    "Some waiting areas but not dedicated",
                    "No bike waiting area"
                ]
            },
            {
                question: "Is traffic speed controlled for cyclists?",
                answers: [
                    "Speed humps, signal timing adjustments",
                    "Some speed management",
                    "No speed control"
                ]
            },
            {
                question: "Is the cycle lane physically separated at the intersection?",
                answers: [
                    "Yes, full separation",
                    "Painted only, no protection",
                    "No separation, mixed with cars"
                ]
            },
            {
                question: "Is the cycle lane free of obstructions (parked cars, debris, etc.)?",
                answers: [
                    "No obstructions",
                    "Some minor obstructions",
                    "Many obstructions"
                ]
            },
            {
                question: "Are traffic signs for cyclists clear and visible?",
                answers: [
                    "Yes, well-placed",
                    "Some signs missing",
                    "No cyclist signs"
                ]
            },
            {
                question: "Are cycle lanes continuous on all legs of the intersection?",
                answers: [
                    "Yes",
                    "Some missing sections",
                    "No cycle lanes"
                ]
            },
            {
                question: "Is traffic volume at the intersection low for cyclists?",
                answers: [
                    "Low traffic",
                    "Moderate traffic",
                    "High traffic"
                ]
            },
            {
                question: "Are dedicated turn lanes provided for cyclists?",
                answers: [
                    "Yes",
                    "Some turn lanes missing",
                    "No cyclist turn lanes"
                ]
            },
            {
                question: "Are cyclists accommodated safely during red signals?",
                answers: [
                    "Separate cycle area at signals",
                    "Shared with motor vehicles",
                    "No dedicated space for cyclists"
                ]
            }
        ]
    },
    {
        type: UserType.Motocyclist,
        questions: [
            {
                question: "Are lane markings clear and visible for motorcyclists?",
                answers: [
                    "Clear lane markings",
                    "Faded but still visible",
                    "No lane markings"
                ]
            },
            {
                question: "Are motorcycles given a designated waiting area at signals?",
                answers: [
                    "Clearly marked area",
                    "Some waiting space but not clear",
                    "No designated waiting area"
                ]
            },
            {
                question: "Are speed control measures present?",
                answers: [
                    "Speed bumps, enforcement",
                    "Some measures present",
                    "No speed control"
                ]
            },
            {
                question: "Are traffic signals visible and functioning for motorcyclists?",
                answers: [
                    "Clear & working",
                    "Some signals not working",
                    "No signals"
                ]
            },
            {
                question: "Are road signs relevant to motorcycles clear and visible?",
                answers: [
                    "Yes, well-maintained",
                    "Some unclear signs",
                    "No signs"
                ]
            },
            {
                question: "Are motorcycles protected from right-turning vehicles?",
                answers: [
                    "Yes, clear separation",
                    "Partial separation",
                    "No separation, risk of conflict"
                ]
            },
            {
                question: "Is motorcycle movement safely integrated with other vehicles?",
                answers: [
                    "Dedicated space for motorcycles",
                    "Some shared lanes",
                    "No clear space for motorcycles"
                ]
            },
            {
                question: "Is the road surface at the intersection in good condition?",
                answers: [
                    "Smooth, no potholes",
                    "Some minor potholes",
                    "Major potholes, uneven surface"
                ]
            },
            {
                question: "Are motorcyclists given priority at intersections (like advanced stop lines)?",
                answers: [
                    "Yes, well-marked",
                    "Some areas available",
                    "No motorcycle priority at signals"
                ]
            },
            {
                question: "Are there frequent conflicts between motorcycles and pedestrians/cars?",
                answers: [
                    "No conflicts",
                    "Some minor conflicts",
                    "Many unsafe conflicts"
                ]
            }
        ]
    },
    {
        type: UserType.Car,
        questions: [
            {
                question: "Is the intersection well-marked with lane assignments?",
                answers: [
                    "Yes, clear lane assignments",
                    "Some faded markings",
                    "No lane markings"
                ]
            },
            {
                question: "Are traffic signals present and working?",
                answers: [
                    "Yes, fully functional",
                    "Some not working",
                    "No traffic signals"
                ]
            },
            {
                question: "Is the intersection clear of obstructions (billboards, parked cars)?",
                answers: [
                    "No obstructions",
                    "Some obstructions",
                    "Many obstructions"
                ]
            },
            {
                question: "Are speed control measures in place?",
                answers: [
                    "Speed bumps, cameras",
                    "Some speed measures",
                    "No speed control"
                ]
            },
            {
                question: "Is the intersection layout simple and easy to navigate?",
                answers: [
                    "Simple layout",
                    "Some complex features",
                    "Confusing layout"
                ]
            },
            {
                question: "Is the waiting time at the intersection reasonable?",
                answers: [
                    "Short wait time",
                    "Moderate wait time",
                    "Long wait time, congestion"
                ]
            },
            {
                question: "Is there dedicated turning space for vehicles?",
                answers: [
                    "Yes, clearly marked",
                    "Some missing turn lanes",
                    "No dedicated turning space"
                ]
            },
            {
                question: "Are roundabouts or signal timings efficient?",
                answers: [
                    "Well-timed and efficient",
                    "Some delays",
                    "Poor signal timing, congestion"
                ]
            },
            {
                question: "Are visibility conditions at the intersection good?",
                answers: [
                    "No blind spots",
                    "Some minor visibility issues",
                    "Poor visibility"
                ]
            },
            {
                question: "Are pedestrian and cyclist movements predictable and safe for car drivers?",
                answers: [
                    "Well-organized",
                    "Some conflicts",
                    "Many unpredictable movements"
                ]
            }
        ]
    }
]