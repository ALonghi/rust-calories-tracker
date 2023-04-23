import type { NextPage } from "next";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import DateUtils from "@utils/dateUtils";
import Meal, { MealType } from "@model/meal";
import StickyList from "@components/StickyList";
import MealService from "@service/mealService";
import { createToast } from "@model/toast";
import { addNotification } from "@stores/notificationStore";
import AddMeal from "@components/AddMeal";
import Food from "@model/food";
import { CreateMealRequest } from "@model/dto";

const IndexPage: NextPage = () => {
  // const [movements, setMovements] = useState<Movement[]>([])
  const [isLoading, setLoading] = useState(false);
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

  if (isLoading) return <p className={`my-12 text-white`}>Loading...</p>;

  return (
    <main className={`flex mx-auto justify-center flex-col mx-4 relative`}>
      <div className={`flex justify-between items-center justify-center `}>
        <h1 className={`my-4 mx-auto text-lg text-white`}>Meals</h1>
      </div>
      <div
        className={`rounded-full bg-themebg-400 flex justify-between py-3 text-gray-500 font-light w-10/12 mx-auto 
            `}
      >
        <ArrowLeftIcon className={`h-6 ml-4`} onClick={() => dayBefore()} />
        <p className={`px-8`}>{DateUtils.convertToReadable(selectedDate)}</p>
        <ArrowRightIcon className={`h-6 mr-4 `} onClick={() => dayAfter()} />
      </div>

      {!DateUtils.isToday(selectedDate) && (
        <p
          className={`text-center text-gray-600 text-sm mt-2 underline`}
          onClick={() => setSelectedDate(new Date())}
        >
          Back to today
        </p>
      )}

      <StickyList meals={currentMeals} />
      <AddMeal createMealFun={addMeal} />
    </main>
  );
};

export default IndexPage;
