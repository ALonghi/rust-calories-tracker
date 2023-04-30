import { instance as axios } from "../utils/axios";
import Logger from "../utils/logging";
import { ApiResponse, CreateMealRequest } from "@model/dto";
import Meal, { MealType } from "@model/meal";

export default class MealService {
  static async createMeal(meal: CreateMealRequest): Promise<Meal> {
    try {
      Logger.info(`Adding meal ${JSON.stringify(meal)}`);
      const response = (await axios
        .post("/meals", meal)
        .then((res) => res.data)) as ApiResponse<Meal>;
      if (!response.success || !response.data)
        throw new Error(response.error_message);
      Logger.info(
        `Added meal for ${response.data.meal_date} with id ${response.data?.id}`
      );
      return response.data;
    } catch (e) {
      Logger.error(
        `Error in creating meal (${JSON.stringify(meal)}): ${e.message || e}`
      );
      return Promise.reject(e);
    }
  }

  static async getMeals(): Promise<Meal[]> {
    try {
      Logger.info(`Getting meals..`);
      const response = (await axios
        .get("/meals")
        .then((res) => res.data)) as ApiResponse<Meal[]>;
      if (!response.success || !response.data)
        throw new Error(response.error_message);
      return response.data || [];
    } catch (e) {
      Logger.error(`Error in getting meals: ${e.message || e}`);
      return Promise.reject(e);
    }
  }

  static async getMealsForDate(date: Date): Promise<Meal[]> {
    try {
      // return Promise.resolve([
      //   {
      //     id: Math.random().toString(),
      //     food: {
      //       id: Math.random().toString(),
      //       name: Math.random().toString(),
      //       grams_qty: parseInt(Math.random().toFixed(0)),
      //       calories_qty: parseInt(Math.random().toFixed(0)),
      //       nutritional_values: [
      //         { key: "Protein", value: 30 },
      //         { key: "Fats", value: 30 },
      //         { key: "Carbs", value: 30 },
      //       ],
      //       created_at: new Date().toUTCString(),
      //     },
      //     meal_type: MealType.Breakfast,
      //     meal_date: "2023-04-23",
      //     // date string formatted yyyy-MM-dd
      //     created_at: new Date().toUTCString(),
      //   },
      //   {
      //     id: Math.random().toString(),
      //     food: {
      //       id: Math.random().toString(),
      //       name: Math.random().toString(),
      //       grams_qty: parseInt(Math.random().toFixed(0)),
      //       calories_qty: parseInt(Math.random().toFixed(0)),
      //       nutritional_values: [
      //         { key: "Protein", value: 30 },
      //         { key: "Fats", value: 30 },
      //         { key: "Carbs", value: 30 },
      //       ],
      //       created_at: new Date().toUTCString(),
      //     },
      //     meal_type: MealType.Breakfast,
      //     meal_date: "2023-04-23",
      //     // date string formatted yyyy-MM-dd
      //     created_at: new Date().toUTCString(),
      //   },
      //   {
      //     id: Math.random().toString(),
      //     food: {
      //       id: Math.random().toString(),
      //       name: Math.random().toString(),
      //       grams_qty: parseInt(Math.random().toFixed(0)),
      //       calories_qty: parseInt(Math.random().toFixed(0)),
      //       nutritional_values: [
      //         { key: "Protein", value: 30 },
      //         { key: "Fats", value: 30 },
      //         { key: "Carbs", value: 30 },
      //       ],
      //       created_at: new Date().toUTCString(),
      //     },
      //     meal_type: MealType.Lunch,
      //     meal_date: "2023-04-23",
      //     // date string formatted yyyy-MM-dd
      //     created_at: new Date().toUTCString(),
      //   },
      //   {
      //     id: Math.random().toString(),
      //     food: {
      //       id: Math.random().toString(),
      //       name: Math.random().toString(),
      //       grams_qty: parseInt(Math.random().toFixed(0)),
      //       calories_qty: parseInt(Math.random().toFixed(0)),
      //       nutritional_values: [
      //         { key: "Protein", value: 30 },
      //         { key: "Fats", value: 30 },
      //         { key: "Carbs", value: 30 },
      //       ],
      //       created_at: new Date().toUTCString(),
      //     },
      //     meal_type: MealType.Dinner,
      //     meal_date: "2023-04-23",
      //     // date string formatted yyyy-MM-dd
      //     created_at: new Date().toUTCString(),
      //   },
      // ]) satisfies Promise<Meal[]>;
      Logger.info(`Getting meals for date ..`);
      const response = (await axios
        .post(`/meals/search`, { meal_date: date.toLocaleDateString() })
        .then((res) => res.data)) as ApiResponse<Meal[]>;
      if (!response.success || !response.data)
        throw new Error(response.error_message);
      return response.data;
    } catch (e) {
      Logger.error(`Error in getting meals: ${e.message || e}`);
      return Promise.reject(e);
    }
  }

  static async updateMeal(meal: Meal): Promise<Meal> {
    try {
      Logger.info(`Updating meal ${meal.id}  with ${JSON.stringify(meal)}`);
      const response = (await axios
        .put(`/meals`, meal)
        .then((res) => res.data)) as ApiResponse<Meal>;
      if (!response.success || !response.data)
        throw new Error(response.error_message);
      Logger.info(`Meal ${meal.id} updated.`);
      return response.data;
    } catch (e) {
      Logger.error(
        `Error in updating meal (${meal.id}) (${JSON.stringify(meal)}: ${
          e.message || e
        }`
      );
      return Promise.reject(e);
    }
  }
}
