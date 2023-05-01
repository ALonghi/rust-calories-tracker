import type { NextPage } from "next";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import DateUtils from "@utils/dateUtils";
import StickyList from "@components/StickyList";
import AddMeal from "@components/AddMeal";
import useMealsData from "@hooks/meal/useMealsData";

const IndexPage: NextPage = () => {
  const [isLoading, setLoading] = useState(false);

  const {
    selectedDate,
    setSelectedDate,
    currentMeals,
    dayBefore,
    dayAfter,
    addMeal,
  } = useMealsData((val) => setLoading(val));

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
      <AddMeal createMealFun={addMeal} mealDate={selectedDate} />
    </main>
  );
};

export default IndexPage;
