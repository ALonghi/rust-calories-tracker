import { useEffect, useState } from "react";
import Meal, { MealType } from "@model/meal";
import MealService from "@service/mealService";
import { createToast } from "@model/toast";
import { addNotification } from "@stores/notificationStore";
import Food from "@model/food";
import DateUtils from "@utils/dateUtils";
import { CreateMealRequest } from "@model/dto";

const useMealsData = (setLoading: (val: boolean) => void) => {
  const [focusDate, setFocusDate] = useState<Date>(new Date());
  const [currentMeals, setCurrentMeals] = useState<Meal[]>([]);
  const [focusedMeal, setFocusedMeal] = useState<Meal | null>(null);

  useEffect(() => {
    setLoading(true);
    MealService.getMealsForDate(focusDate)
      .then((meals) => setCurrentMeals(meals))
      .catch((e) => {
        const toast = createToast(
          `Error in fetching meals: ${e.message || e}`,
          "error"
        );
        addNotification(toast);
      })
      .finally(() => setLoading(false));
  }, [focusDate]);

  const dayBefore = () => {
    const yesterday = new Date(focusDate.getTime());
    yesterday.setDate(focusDate.getDate() - 1);
    setFocusDate(yesterday);
  };
  const dayAfter = () => {
    const tomorrow = new Date(focusDate.getTime());
    tomorrow.setDate(focusDate.getDate() + 1);
    setFocusDate(tomorrow);
  };

  const addMeal = (
    food: Food,
    chosenMeal: MealType,
    mealDate: Date
  ): Promise<void> =>
    MealService.createMeal({
      meal_type: chosenMeal,
      meal_date: DateUtils.getDateString(mealDate),
      food: food,
    } satisfies CreateMealRequest)
      .then((meal) => {
        setCurrentMeals((p) => [...p, meal]);
        const toast = createToast("Meal created successfully", "success");
        addNotification(toast);
      })
      .catch((e) => {
        const toast = createToast(
          `Error in creating meal: ${e.message || e}`,
          "error"
        );
        addNotification(toast);
      });

  return {
    selectedDate: focusDate,
    setSelectedDate: setFocusDate,
    currentMeals,
    dayBefore,
    dayAfter,
    addMeal,
    focusedMeal,
    setFocusedMeal,
  };
};

export default useMealsData;
