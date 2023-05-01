import React, { useState } from "react";
import Modal from "@components/shared/Modal";
import { MealType } from "@model/meal";
import Food from "@model/food";
import AddButton from "@components/shared/Buttons/AddButton";
import EditMealPopup from "@components/meal/EditMealPopup";
import AddMealPopup from "@components/meal/AddMealPopup";

type AddMealType = {
  createMealFun: (food: Food, mealType: MealType) => Promise<void>;
  mealDate: Date;
};
const AddMeal = ({ createMealFun }: AddMealType) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [addingChoice, setAddingChoice] = useState<`saved` | `new`>(`saved`);

  const sharedProps = {
    hidePopup: () => setShowPopup(false),
    createMealFun: (food: Food, mealType: MealType) =>
      createMealFun(food, mealType),
  };
  return (
    <div className={``}>
      <Modal
        open={showPopup}
        setOpen={() => setShowPopup(false)}
        classes={`h-[90vh] `}
      >
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
          className={`my-4 flex flex-col justify-center items-center m-auto py-4 px-6 bg-theme max-h-[85%] gap-y-3`}
        >
          {addingChoice === "saved" ? (
            <EditMealPopup {...sharedProps} />
          ) : (
            <AddMealPopup {...sharedProps} />
          )}
        </div>
      </Modal>
      <AddButton action={() => setShowPopup(true)} />
    </div>
  );
};

export default AddMeal;
