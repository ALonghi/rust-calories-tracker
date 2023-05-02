import { CreateFoodRequest } from "@model/dto";

export interface NutritionalValue {
  key: string;
  value: number;
}

export default interface Food {
  id: string;
  name: string;
  grams_qty: number;
  calories_qty: number;
  nutritional_values: NutritionalValue[];
  created_at: string;
  updated_at?: string;
}

export const getDefaultNewFood = () => {
  const default_nutritional_values: NutritionalValue[] = [
    { key: "Proteins", value: 0.0 },
    { key: "Carbs", value: 0.0 },
    { key: "Fats", value: 0.0 },
  ];

  const newFood: CreateFoodRequest = {
    name: "",
    grams_qty: 0,
    nutritional_values: default_nutritional_values,
  };
  return newFood;
};

export interface FoodGrouped {
  initial: string;
  items: Food[];
}
