import InputForm from "@components/shared/Form/InputForm";
import React from "react";
import { CreateFoodRequest } from "@model/dto";
import Food from "@model/food";

type AddMealPopup = {
  foodData: Food | CreateFoodRequest;
  setFoodData: React.Dispatch<React.SetStateAction<Food | CreateFoodRequest>>;
};
const FoodDataForm = ({ foodData, setFoodData }: AddMealPopup) => {
  return (
    <>
      <InputForm
        type={"text"}
        name={"foodName"}
        label="Food name"
        placeholder={"Rice, Broccoli, etc."}
        value={foodData.name}
        updateValue={(value) =>
          setFoodData((p) => ({ ...p, name: value.toString() }))
        }
        fullWidth
      />
      <InputForm
        type={"number"}
        name={"foodQty"}
        label="Quantity (grams)"
        placeholder={"100"}
        value={foodData.grams_qty}
        updateValue={(value) =>
          setFoodData((d) => ({ ...d, grams_qty: Number(value) }))
        }
        fullWidth
      />
      <InputForm
        type={"number"}
        name={"calories"}
        label="Calories"
        placeholder={"300"}
        value={foodData.calories_qty}
        updateValue={(value) =>
          setFoodData((d) => ({ ...d, calories_qty: Number(value) }))
        }
        fullWidth
      />
      {foodData.nutritional_values.map((obj, i) => (
        <InputForm
          key={i}
          label={obj.key}
          type={"number"}
          name={obj.key}
          placeholder={"300"}
          value={obj.value}
          updateValue={(value) =>
            setFoodData((p) => ({
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
    </>
  );
};

export default FoodDataForm;
