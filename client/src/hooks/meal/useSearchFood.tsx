import { useEffect, useRef, useState } from "react";
import Food from "@model/food";
import FoodService from "@service/foodService";
import { createToast } from "@model/toast";
import { addNotification } from "@stores/notificationStore";
import _ from "lodash";

const useSearchFood = () => {
  const [foundFoods, setFoundFoods] = useState<Food[]>([]);
  const [searchFoodName, setSearchFoodName] = useState<string>(``);
  const [chosenFood, setChosenFood] = useState<Food | null>(null);
  const searchFoods = (searchPrefix: string) => {
    if (searchPrefix) {
      FoodService.searchFoodByPrefix(searchPrefix)
        .then((res) => setFoundFoods(res))
        .catch((e) => {
          const toast = createToast(
            `Error in searching for foods ${e.message || e}`,
            "error",
            1000
          );
          addNotification(toast);
        });
    }
  };

  const throttled = useRef(
    _.throttle((prefix) => searchFoods(prefix), 1000, { trailing: false })
  );
  useEffect(() => throttled.current(searchFoodName), [searchFoodName]);

  return {
    foundFoods,
    chosenFood,
    setChosenFood,
    searchFoodName,
    setSearchFoodName,
  };
};

export default useSearchFood;
