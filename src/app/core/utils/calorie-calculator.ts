

export const getCaloriesForNutrient = (nutrientType: 'protein' | 'fat' | 'carbs' | 'sugar' | 'fiber', amount: number): number => {
    if (amount < 0) {
        throw new Error('Amount must be a non-negative number');
    }
    switch (nutrientType) {
        case 'protein':
            return Math.round(amount * 4); // 4 calories per gram of protein
        case 'fat':
            return Math.round(amount * 9); // 9 calories per gram of fat
        case 'carbs':
            return Math.round(amount * 4); // 4 calories per gram of carbohydrates
        case 'sugar':
            return Math.round(amount * 4); // 4 calories per gram of sugar
        case 'fiber':
            return Math.round(amount * 2); // 2 calories per gram of fiber (not always counted in total calories)
        default:
            throw new Error('Invalid nutrient type');
    }
}

export const getCaloriesFor100g = (protein: number, fat: number, totalCarbs?: number, sugar?: number, fiber?: number): number => {

    // This is simplified calculation becuase labels often doesn't provide all values.
    // if totalCarbs provided but sugar and fiber not then assume all carbs ar sugar
    // if totalCarbs and fiber provided  then assume all carbs are sugar + fiber
    // starch usually not on the label but we can sume same amount of calories as sugar
    // If no totalCarbs or sugar is provided then we cannot calculate calories from the input parameters

    // Calorie constants per gram
    const PROTEIN_CALORIES_PER_G = 4;
    const FAT_CALORIES_PER_G = 9;
    const CARB_CALORIES_PER_G = 4;
    const FIBER_CALORIES_PER_G = 2;

    // Calculate calories from protein and fat (always provided)
    let totalCalories = (protein * PROTEIN_CALORIES_PER_G) + (fat * FAT_CALORIES_PER_G);

    // Calculate carbohydrate calories based on available information
    if (totalCarbs !== undefined && totalCarbs > 0) {
        if (fiber !== undefined && fiber > 0) {
            // If both totalCarbs and fiber are provided
            const digestibleCarbs = Math.max(0, totalCarbs - fiber);
            totalCalories += (digestibleCarbs * CARB_CALORIES_PER_G) + (fiber * FIBER_CALORIES_PER_G);
        } else {
            // If only totalCarbs is provided, assume all carbs are digestible (sugar/starch)
            totalCalories += totalCarbs * CARB_CALORIES_PER_G;
        }
    } else if (sugar !== undefined && sugar > 0) {
        // If no totalCarbs but sugar is provided, just count sugar calories
        totalCalories += sugar * CARB_CALORIES_PER_G;

        // Add fiber calories if provided separately
        if (fiber !== undefined && fiber > 0) {
            totalCalories += fiber * FIBER_CALORIES_PER_G;
        }
    }
    // If neither totalCarbs nor sugar is provided, we can't calculate carb calories

    return Math.round(totalCalories);
}


export const getCaloriesForServing = (servingSize: number, protein: number, fat: number, carbs?: number, sugar?: number, fiber?: number): number => {
    if (servingSize <= 0) {
        throw new Error('Serving size must be greater than zero');
    }
    const caloriesPer100g = getCaloriesFor100g(protein, fat, carbs, sugar, fiber);
    return Math.round(caloriesPer100g / 100 * servingSize);
}