import SelectBox from "@components/shared/Form/SelectBox";
import { MealType } from "@model/meal";
import InputForm from "@components/shared/Form/InputForm";
import React, { useState } from "react";
import Button from "@components/shared/Buttons/Button";
import useEditMealData from "@hooks/meal/useEditMealData";
import _ from "lodash";
import Food from "@model/food";
import { motion } from "framer-motion";
import SearchFood from "@components/food/SearchFood";

type SeachFoodPopupProps = {
  hidePopup: Function;
  afterSaveFun: (food: Food, mealType: MealType) => Promise<void>;
};
const SeachFoodPopup = ({ hidePopup, afterSaveFun }: SeachFoodPopupProps) => {
  const [chosenFood, setChosenFood] = useState<Food | null>(null);

  const { grams, setGrams, hasRequiredFields, mealType, setMealType } =
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

      <SearchFood chosenFood={chosenFood} setChosenFood={setChosenFood} />

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
        clickAction={() => {
          afterSaveFun(chosenFood, mealType).then(() => hidePopup());
        }}
        isDisabled={!hasRequiredFields}
      />
    </motion.div>
  );
};

export default SeachFoodPopup;
