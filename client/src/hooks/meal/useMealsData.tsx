import { useEffect, useState } from "react";
import Meal, { MealType } from "@model/meal";
import MealService from "@service/mealService";
import { createToast } from "@model/toast";
import { addNotification } from "@stores/notificationStore";
import Food from "@model/food";
import DateUtils from "@utils/dateUtils";
import { CreateMealRequest } from "@model/dto";

const useMealsData = (setLoading: (val: boolean) => void) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMeals, setCurrentMeals] = useState<Meal[]>([]);

  useEffect(() => {
    setLoading(true);
    MealService.getMealsForDate(selectedDate)
      .then((meals) => setCurrentMeals(meals))
      .catch((e) => {
        const toast = createToast(
          `Error in fetching meals: ${e.message || e}`,
          "error"
        );
        addNotification(toast);
      })
      .finally(() => setLoading(false));
  }, [selectedDate]);

  const dayBefore = () => {
    const yesterday = new Date(selectedDate.getTime());
    yesterday.setDate(selectedDate.getDate() - 1);
    setSelectedDate(yesterday);
  };
  const dayAfter = () => {
    const tomorrow = new Date(selectedDate.getTime());
    tomorrow.setDate(selectedDate.getDate() + 1);
    setSelectedDate(tomorrow);
  };

  const addMeal = (food: Food, chosenMeal: MealType): Promise<void> =>
    MealService.createMeal({
      meal_type: chosenMeal,
      meal_date: DateUtils.getDateString(selectedDate),
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
    selectedDate,
    setSelectedDate,
    currentMeals,
    dayBefore,
    dayAfter,
    addMeal,
  };
};

export default useMealsData;
