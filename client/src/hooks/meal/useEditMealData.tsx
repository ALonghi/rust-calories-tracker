import { useState } from "react";
import Food from "@model/food";
import { MealType } from "@model/meal";

const useEditMealData = (chosenFood: Food | null) => {
  const [grams, setGrams] = useState<number>(0);
  const [mealType, setMealType] = useState<MealType | null>(MealType.Breakfast);

  const hasRequiredFieldsFilled: boolean = grams > 0 && !!chosenFood;

  return {
    grams,
    setGrams,
    hasRequiredFieldsFilled,
    mealType,
    setMealType,
  };
};

export default useEditMealData;
