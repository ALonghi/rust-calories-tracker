import React, { useState } from "react";
import Modal from "@components/shared/Modal";
import { MealType } from "@model/meal";
import Food from "@model/food";
import AddButton from "@components/shared/Buttons/AddButton";
import SeachFoodPopup from "@components/meal/SeachFoodPopup";
import AddMealPopup from "@components/meal/AddFoodPopup";
import Calendar from "@components/shared/Calendar";

type MealPopupType = {
  afterSaveFun: (
    food: Food,
    mealType: MealType,
    mealDate: Date
  ) => Promise<void>;
  mealDate: Date;
};
const MealPopup = ({ afterSaveFun, mealDate }: MealPopupType) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [addingChoice, setAddingChoice] = useState<`saved` | `new`>(`saved`);
  const [currentMealDate, setCurrentMealDate] = useState<Date>(mealDate);

  const sharedProps = {
    hidePopup: () => setShowPopup(false),
    afterSaveFun: (food: Food, mealType: MealType) =>
      afterSaveFun(food, mealType, currentMealDate),
    mealDate: currentMealDate,
  };
  return (
    <div className={``}>
      <Modal
        open={showPopup}
        setOpen={() => setShowPopup(false)}
        classes={`max-h-[85vh] `}
      >
        <div className={`max-h-full overflow-y-auto`}>
          <p className={`text-md text-white mt-2 text-center`}>Add meal</p>
          <div
            className={`flex text-gray-300 justify-evenly mt-6 text-base cursor-pointer items-center text-center `}
          >
            <p
              className={`border-r border-gray-400 w-6/12 ${
                addingChoice === `saved` && `underline`
              }`}
              onClick={() => setAddingChoice(`saved`)}
            >
              Select existing
            </p>
            <p
              className={`w-6/12 ${addingChoice === `new` && `underline`}`}
              onClick={() => setAddingChoice(`new`)}
            >
              Create new food
            </p>
          </div>
          <div
            className={`my-4 flex flex-col justify-center items-center m-auto py-4 px-6 
                    w-full bg-theme h-fit max-h-full gap-y-3 `}
          >
            <div className={`flex flex-col gap-y-3 mb-3`}>
              <p className="block text-sm font-normal text-gray-200 text-left">
                Select meal date
              </p>
              <Calendar
                selectedDate={currentMealDate}
                afterUpdateDateFun={(d) => setCurrentMealDate(d)}
              />
            </div>
            {addingChoice === "saved" ? (
              <SeachFoodPopup {...sharedProps} />
            ) : (
              <AddMealPopup {...sharedProps} />
            )}
          </div>
        </div>
      </Modal>
      <AddButton action={() => setShowPopup(true)} />
    </div>
  );
};

export default MealPopup;
