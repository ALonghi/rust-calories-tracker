import type { NextPage } from "next";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ClipboardDocumentListIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react";
import DateUtils from "@utils/dateUtils";
import StickyList from "@components/StickyList";
import MealPopup from "@components/MealPopup";
import useMealsData from "@hooks/meal/useMealsData";
import Spinner from "@components/shared/Spinner";
import { XMarkIcon } from "@heroicons/react/24/solid";
import AddButton from "@components/shared/Buttons/AddButton";
import ScannerPopup from "@components/food/ScannerPopup";

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

  const [showActions, setShowActions] = useState<boolean>(false);
  const [showManualAddPopup, setShowManualAddPopup] = useState<boolean>(false);
  const [showBarcodePopup, setShowBarcodePopup] = useState<boolean>(false);

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
      <MealPopup
        showPopup={showManualAddPopup}
        closePopup={() => setShowManualAddPopup(false)}
        afterSaveFun={addMeal}
        mealDate={selectedDate}
      />
      {showBarcodePopup && (
        <ScannerPopup
          isOpen={showBarcodePopup}
          closePopup={() => setShowBarcodePopup(false)}
        />
      )}

      <div className={`fixed bottom-5 right-0 h-[7rem] w-[10rem]`}>
        {showActions && (
          <div
            className={`flex flex-row -rotate-45 items-center mr-auto -ml-1 `}
          >
            <QrCodeIcon
              onClick={() => {
                setShowBarcodePopup(true);
                setShowActions(false);
              }}
              className={`rotate-45 font-light cursor-pointer w-11 mr-auto bg-white rounded-full p-2`}
            />
            <ClipboardDocumentListIcon
              onClick={() => {
                setShowManualAddPopup(true);
                setShowActions(false);
              }}
              className={`rotate-45 font-light  cursor-pointer w-11 mr-auto bg-white rounded-full p-2`}
            />
          </div>
        )}
        {showActions ? (
          <XMarkIcon
            onClick={() => setShowActions(false)}
            className={`w-11 p-2 bg-teal-600 rounded-full fixed bottom-7 right-7 text-white`}
          />
        ) : (
          <AddButton action={() => setShowActions(true)} />
        )}
      </div>
    </main>
  );
};

export default IndexPage;
