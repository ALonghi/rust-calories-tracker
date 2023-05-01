import SelectBox from "@components/shared/SelectBox";
import { MealType } from "@model/meal";
import InputForm from "@components/shared/InputForm";
import React from "react";
import Button from "@components/shared/Buttons/Button";
import Utils from "@utils/utils";
import useEditMealData from "@hooks/meal/useEditMealData";
import _ from "lodash";
import Food from "@model/food";
import useSearchFood from "@hooks/meal/useSearchFood";
import { motion } from "framer-motion";
import Spinner from "@components/shared/Spinner";

type SeachFoodPopupProps = {
  hidePopup: Function;
  afterSaveFun: (food: Food, mealType: MealType) => Promise<void>;
};
const SeachFoodPopup = ({ hidePopup, afterSaveFun }: SeachFoodPopupProps) => {
  const {
    foundFoods,
    chosenFood,
    setChosenFood,
    searchFoodName,
    setSearchFoodName,
    isSearching,
  } = useSearchFood();

  const { grams, setGrams, hasRequiredFieldsFilled, mealType, setMealType } =
    useEditMealData(chosenFood);

  return (
    <motion.div
      className={`w-full`}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`flex flex-col items-start justify-start flex-1 w-full `}>
        <p className={`text-white text-sm `}>Select meal type </p>
        <SelectBox
          options={Object.values(MealType).map((t) => _.capitalize(t))}
          selected={_.capitalize(mealType)}
          setSelected={(value) => setMealType(value as MealType)}
          classes={`py-2 w-full`}
        />
      </div>
      <div className={`w-full min-h-60 relative mt-4 `}>
        <p className="block text-sm font-medium text-gray-200">
          Search for existing food
        </p>
        <div
          className={`bg-themebg-400 shadow-md  focus:outline-none
          border-none shadow-none rounded-md flex flex-row justify-start items-center flex-nowrap
            focus:border-2 focus:border-themebg-300 w-full 
          text-white block my-3 placeholder:text-gray-600
              sm:text-sm border-gray-400 rounded-md`}
        >
          <input
            type={"text"}
            name={"existingFoodName"}
            id={"existingFoodName"}
            value={searchFoodName}
            className={`bg-transparent focus:outline-none
          border-none shadow-none w-full text-white block px-4 py-2
          placeholder:text-gray-600 sm:text-sm border-gray-400`}
            placeholder={"Rice, pasta, etc."}
            onChange={(e) => setSearchFoodName(e.target.value)}
          />
          {isSearching && <Spinner size={20} classes={`mr-2`} />}
        </div>
        {foundFoods?.length > 0 && !chosenFood && (
          <div
            className=" z-10 mt-1 max-h-40 w-full overflow-auto max-h-40
                            rounded-md bg-themebg-400  py-1 text-base shadow-lg ring-1 ring-black
                            ring-opacity-5 focus:outline-none sm:text-sm border border-themebg-400 "
          >
            {foundFoods.map((food) => (
              <p
                key={food.id}
                className={Utils.classNames(
                  "text-gray-300",
                  "hover:bg-themebg-500 relative cursor-default select-none py-2 pl-3 pr-9"
                )}
                onClick={() => setChosenFood(food)}
              >
                {food.name}
              </p>
            ))}
          </div>
        )}
      </div>
      <InputForm
        type={"number"}
        name={"foodQty"}
        label="Quantity (grams)"
        placeholder={"100"}
        value={grams}
        updateValue={(value) => setGrams(() => Number(value))}
        componentClasses={` w-full mt-5`}
        fullWidth
      />

      <Button
        clickAction={() => afterSaveFun(chosenFood, mealType)}
        isDisabled={!hasRequiredFieldsFilled}
      />
    </motion.div>
  );
};

export default SeachFoodPopup;
