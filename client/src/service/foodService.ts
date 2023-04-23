import { instance as axios } from "../utils/axios";
import Logger from "../utils/logging";
import { ApiResponse, CreateFoodRequest, SearchFoodRequest } from "@model/dto";
import Food from "@model/food";

export default class FoodService {
  static async createFood(food: CreateFoodRequest): Promise<Food> {
    try {
      Logger.info(`Adding meal ${JSON.stringify(food)}`);
      const response = (await axios
        .post("/foods", food)
        .then((res) => res.data)) as ApiResponse<Food>;
      if (!response.success || !response.data)
        throw new Error(response.error_message);
      Logger.info(
        `Added food ${response.data.name} with id ${response.data?.id}`
      );
      return response.data;
    } catch (e) {
      Logger.error(
        `Error in creating food (${JSON.stringify(food)}): ${e.message || e}`
      );
      return Promise.reject(e);
    }
  }

  static async searchFoodByPrefix(prefix: string): Promise<Food[]> {
    try {
      Logger.info(`Searching foods by prefix ${prefix}..`);
      const response = (await axios
        .post(`/foods/search`, {
          food_prefix: prefix,
        } satisfies SearchFoodRequest)
        .then((res) => res.data)) as ApiResponse<Food[]>;
      if (!response.success || !response.data)
        throw new Error(response.error_message);
      Logger.info(
        `Search found ${response.data.length} foods with prefix ${prefix}..`
      );
      return response.data;
    } catch (e) {
      Logger.error(
        `Error in searching foods by prefix ${prefix}: ${e.message || e}`
      );
      return Promise.reject(e);
    }
  }
}
