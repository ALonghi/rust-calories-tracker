import { MealType } from "@model/meal";
import React, { useState } from "react";
import Button from "@components/shared/Buttons/Button";
import { CreateFoodRequest } from "@model/dto";
import Food, { getDefaultNewFood } from "@model/food";
import FoodService from "@service/foodService";
import { motion } from "framer-motion";
import FoodDataForm from "@components/meal/FoodDataForm";

type AddFoodPopup = {
  hidePopup: Function;
  afterSaveFun: (food: Food, mealType: MealType) => Promise<void>;
  mealDate: Date;
};
const AddMealPopup = ({ hidePopup, afterSaveFun }: AddFoodPopup) => {
  const [newFoodData, setNewFoodData] = useState<CreateFoodRequest>(
    getDefaultNewFood()
  );
  const [mealType, setMealType] = useState<MealType | null>(MealType.Breakfast);

  const hasRequiredFieldsFilled: boolean =
    newFoodData?.grams_qty > 0 &&
    newFoodData?.name?.length > 0 &&
    newFoodData?.calories_qty > 0;

  const save = async () => {
    try {
      if (hasRequiredFieldsFilled) {
        const createdFood = await FoodService.createFood(newFoodData);
        await afterSaveFun(createdFood, mealType).then(() => {
          setNewFoodData(getDefaultNewFood());
        });
        hidePopup();
      }
    } catch (e) {}
  };

  return (
    <motion.div
      className={`w-full`}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <FoodDataForm foodData={newFoodData} setFoodData={setNewFoodData} />
      <Button
        clickAction={() => save()}
        isDisabled={!hasRequiredFieldsFilled}
        text={`Save`}
      />
    </motion.div>
  );
};

export default AddMealPopup;
