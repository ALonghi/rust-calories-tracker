import type { NextPage } from "next";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import React from "react";
import DateUtils from "@utils/dateUtils";
import StickyList from "@components/StickyList";
import MealPopup from "@components/MealPopup";
import useMealsData from "@hooks/meal/useMealsData";
import Spinner from "@components/shared/Spinner";

const IndexPage: NextPage = () => {
  const {
    isLoading,
    setLoading,
    selectedDate,
    setSelectedDate,
    currentMeals,
    dayBefore,
    dayAfter,
    addMeal,
    focusedMeal,
    setFocusedMeal,
  } = useMealsData();

  if (isLoading) return <Spinner classes={`mt-12 mx-auto`} />;

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
          className={`text-center text-gray-600 text-sm mt-4 underline`}
          onClick={() => setSelectedDate(new Date())}
        >
          Back to today
        </p>
      )}

      <StickyList meals={currentMeals} />
      {focusedMeal &&
        // <FoodDataForm foodData={focusedMeal?.food} setFoodData={setFocusedMeal} />
        null}
      <MealPopup afterSaveFun={addMeal} mealDate={selectedDate} />
    </main>
  );
};

export default IndexPage;
