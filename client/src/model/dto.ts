import Food, { NutritionalValue } from "@model/food";
import { MealType } from "@model/meal";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error_message?: string;
}

export interface CreateMealRequest {
  food: Food;
  meal_type: MealType;
  meal_date: string;
}

export interface CreateFoodRequest {
  name: string;
  grams_qty: number;
  calories_qty?: number;
  nutritional_values: NutritionalValue[];
}

export interface SearchFoodRequest {
  food_prefix: string;
}
