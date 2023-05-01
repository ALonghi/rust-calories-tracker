import { MealType } from "@model/meal";
import InputForm from "@components/shared/InputForm";
import React, { useState } from "react";
import Button from "@components/shared/Buttons/Button";
import { CreateFoodRequest } from "@model/dto";
import Food, { getDefaultNewFood } from "@model/food";
import FoodService from "@service/foodService";
import { motion } from "framer-motion";

type AddMealPopup = {
  hidePopup: Function;
  createMealFun: (food: Food, mealType: MealType) => Promise<void>;
};
const AddMealPopup = ({ hidePopup, createMealFun }: AddMealPopup) => {
  const [newFoodData, setNewFoodData] = useState<CreateFoodRequest>(
    getDefaultNewFood()
  );
  const [mealType, setMealType] = useState<MealType | null>(MealType.Breakfast);

  const hasRequiredFieldsFilled: boolean =
    newFoodData?.grams_qty > 0 && newFoodData?.name?.length > 0;

  const save = async () => {
    try {
      if (hasRequiredFieldsFilled) {
        const createdFood = await FoodService.createFood(newFoodData);
        await createMealFun(createdFood, mealType).then(() => {
          setNewFoodData(getDefaultNewFood());
        });
        hidePopup();
      }
    } catch (e) {}
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`w-full overflow-y-scroll `}>
        <InputForm
          type={"text"}
          name={"foodName"}
          label="Food name"
          placeholder={"Rice, Broccoli, etc."}
          value={newFoodData.name}
          updateValue={(value) =>
            setNewFoodData((p) => ({ ...p, name: value.toString() }))
          }
          componentClasses={`w-full`}
          fullWidth
        />
        <InputForm
          type={"number"}
          name={"foodQty"}
          label="Quantity (grams)"
          placeholder={"100"}
          value={newFoodData.grams_qty}
          updateValue={(value) =>
            setNewFoodData((d) => ({ ...d, grams_qty: Number(value) }))
          }
          componentClasses={` w-full`}
          fullWidth
        />
        {newFoodData.nutritional_values.map((obj, i) => (
          <InputForm
            key={i}
            label={obj.key}
            type={"number"}
            name={obj.key}
            placeholder={"300"}
            value={obj.value}
            updateValue={(value) =>
              setNewFoodData((p) => ({
                ...p,
                nutritional_values: p.nutritional_values.map((n) =>
                  n.key === obj.key
                    ? {
                        ...n,
                        value: Number(value),
                      }
                    : n
                ),
              }))
            }
            fullWidth
          />
        ))}
      </div>
      <Button
        clickAction={() => save()}
        isDisabled={!hasRequiredFieldsFilled}
      />
    </motion.div>
  );
};

export default AddMealPopup;
