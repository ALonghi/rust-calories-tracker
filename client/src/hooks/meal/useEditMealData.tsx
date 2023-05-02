import { useEffect, useState } from "react";
import Food from "@model/food";
import { MealType } from "@model/meal";

const useEditMealData = (chosenFood: Food | null) => {
  const [grams, setGrams] = useState<number>(0);
  const [mealType, setMealType] = useState<MealType | null>(MealType.Breakfast);
  const isValid = () => grams > 0 && !!chosenFood;
  const [hasRequiredFields, setHasRequiredFields] = useState<boolean>(
    isValid()
  );

  useEffect(() => {
    setHasRequiredFields(isValid());
  }, [chosenFood, grams]);

  return {
    grams,
    setGrams,
    hasRequiredFields,
    mealType,
    setMealType,
  };
};

export default useEditMealData;
