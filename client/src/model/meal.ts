import Food from "@model/food";

export enum MealType {
  Breakfast = "Breakfast",
  Lunch = "Lunch",
  Dinner = "Dinner",
  Snack = "Snack",
}

export default interface Meal {
  id: string;
  food: Food;
  meal_type: MealType;
  meal_date: string;
  // date string formatted yyyy-MM-dd
  created_at: string;
  updated_at?: string;
}
