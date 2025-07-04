type ActivityLevel = "Low" | "Medium" | "High";
type AgeGroup = "Puppy" | "Adult" | "Senior";

interface NutritionEntry {
    weight_kg: number;
    age: AgeGroup;
    activity_level: ActivityLevel;
    calories: number;
    protein_g: number;
    fat_g: number;
    carbs_g: number;
}

const dogNutritionRequirements: NutritionEntry[] = [
    {
        "weight_kg": 5,
        "age": "Adult",
        "activity_level": "Low",
        "calories": 200,
        "protein_g": 10,
        "fat_g": 7,
        "carbs_g": 25
    },
    {
        "weight_kg": 5,
        "age": "Adult",
        "activity_level": "Medium",
        "calories": 300,
        "protein_g": 15,
        "fat_g": 10,
        "carbs_g": 35
    },
    {
        "weight_kg": 5,
        "age": "Adult",
        "activity_level": "High",
        "calories": 400,
        "protein_g": 20,
        "fat_g": 14,
        "carbs_g": 50
    },
    {
        "weight_kg": 10,
        "age": "Adult",
        "activity_level": "Low",
        "calories": 325,
        "protein_g": 18,
        "fat_g": 11,
        "carbs_g": 40
    },
    {
        "weight_kg": 10,
        "age": "Adult",
        "activity_level": "Medium",
        "calories": 500,
        "protein_g": 25,
        "fat_g": 17,
        "carbs_g": 60
    },
    {
        "weight_kg": 10,
        "age": "Adult",
        "activity_level": "High",
        "calories": 650,
        "protein_g": 32,
        "fat_g": 22,
        "carbs_g": 85
    },
    {
        "weight_kg": 20,
        "age": "Adult",
        "activity_level": "Low",
        "calories": 550,
        "protein_g": 30,
        "fat_g": 18,
        "carbs_g": 70
    },
    {
        "weight_kg": 20,
        "age": "Adult",
        "activity_level": "Medium",
        "calories": 800,
        "protein_g": 40,
        "fat_g": 26,
        "carbs_g": 100
    },
    {
        "weight_kg": 20,
        "age": "Adult",
        "activity_level": "High",
        "calories": 1100,
        "protein_g": 55,
        "fat_g": 36,
        "carbs_g": 130
    },
    {
        "weight_kg": 30,
        "age": "Adult",
        "activity_level": "Low",
        "calories": 750,
        "protein_g": 40,
        "fat_g": 24,
        "carbs_g": 90
    },
    {
        "weight_kg": 30,
        "age": "Adult",
        "activity_level": "Medium",
        "calories": 1100,
        "protein_g": 55,
        "fat_g": 36,
        "carbs_g": 130
    },
    {
        "weight_kg": 30,
        "age": "Adult",
        "activity_level": "High",
        "calories": 1500,
        "protein_g": 75,
        "fat_g": 50,
        "carbs_g": 170
    },
    {
        "weight_kg": 40,
        "age": "Adult",
        "activity_level": "Low",
        "calories": 950,
        "protein_g": 48,
        "fat_g": 30,
        "carbs_g": 110
    },
    {
        "weight_kg": 40,
        "age": "Adult",
        "activity_level": "Medium",
        "calories": 1400,
        "protein_g": 70,
        "fat_g": 46,
        "carbs_g": 160
    },
    {
        "weight_kg": 40,
        "age": "Adult",
        "activity_level": "High",
        "calories": 1850,
        "protein_g": 90,
        "fat_g": 60,
        "carbs_g": 210
    }
];

const getDogNutritionEstimate = (
    age: AgeGroup,
    weight: number,
    activityLevel: ActivityLevel
): NutritionEntry | undefined => {
    // First, try to find an exact match
    const base = dogNutritionRequirements.find(entry =>
        entry.age === "Adult" &&
        entry.weight_kg === weight &&
        entry.activity_level === activityLevel
    );

    if (!base) return undefined;

    if (age === "Adult") {
        return base;
    }

    const multiplier = age === "Puppy"
        ? { calories: 2, protein: 2, fat: 1.8, carbs: 1.5 }
        : { calories: 0.8, protein: 0.9, fat: 0.8, carbs: 0.9 };

    return {
        weight_kg: weight,
        age,
        activity_level: activityLevel,
        calories: Math.round(base.calories * multiplier.calories),
        protein_g: Math.round(base.protein_g * multiplier.protein),
        fat_g: Math.round(base.fat_g * multiplier.fat),
        carbs_g: Math.round(base.carbs_g * multiplier.carbs)
    };
};
