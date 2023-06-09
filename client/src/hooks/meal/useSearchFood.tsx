import { useEffect, useRef, useState } from "react";
import Food from "@model/food";
import FoodService from "@service/foodService";
import { createToast } from "@model/toast";
import { addNotification } from "@stores/notificationStore";
import _ from "lodash";

const useSearchFood = () => {
  const [foundFoods, setFoundFoods] = useState<Food[]>([]);
  const [searchFoodName, setSearchFoodName] = useState<string>(``);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const searchFoods = (searchPrefix: string) => {
    if (searchPrefix) {
      setIsSearching(true);
      FoodService.searchFoodByPrefix(searchPrefix)
        .then((res) => setFoundFoods(res))
        .catch((e) => {
          const toast = createToast(
            `Error in searching for foods ${e.message || e}`,
            "error",
            1000
          );
          addNotification(toast);
        })
        .finally(() => setIsSearching(false));
    } else {
      setFoundFoods(() => []);
    }
  };

  const throttled = useRef(
    _.throttle((prefix) => searchFoods(prefix), 1000, { trailing: true })
  );
  useEffect(() => throttled.current(searchFoodName), [searchFoodName]);

  return {
    foundFoods,
    searchFoodName,
    setSearchFoodName,
    isSearching,
  };
};

export default useSearchFood;
