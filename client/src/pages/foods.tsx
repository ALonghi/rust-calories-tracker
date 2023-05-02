import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import Food, { FoodGrouped } from "@model/food";
import Utils from "@utils/utils";
import FoodService from "@service/foodService";
import { createToast } from "@model/toast";
import { addNotification } from "@stores/notificationStore";
import Spinner from "@components/shared/Spinner";
import useSearchFood from "@hooks/meal/useSearchFood";
import SearchInput from "@components/shared/Form/SearchInput";

function groupByInitialLetter(array: Food[]): FoodGrouped[] {
  const letters: string[] = Utils.uniqueArrayElements(
    array?.map((i) => i.name.charAt(0).toLowerCase()) || []
  );
  return letters
    .map((letter) => {
      const itemsOfLetter = array.filter((i) =>
        i.name.toLowerCase().startsWith(letter)
      );
      return { initial: letter, items: itemsOfLetter } satisfies FoodGrouped;
    })
    .sort((a, b) => a.initial.localeCompare(b.initial));
}

const FoodsPage: NextPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentFoods, setCurrentFoods] = useState<Food[]>([]);

  const getAll = () =>
    FoodService.getAll()
      .then((items) => setCurrentFoods(items))
      .catch((e) => {
        const toast = createToast(
          `Error in fetching foods: ${e.message || e}`,
          "error"
        );
        addNotification(toast);
      });

  useEffect(() => {
    getAll().finally(() => setIsLoading(false));
  }, []);

  const { foundFoods, searchFoodName, setSearchFoodName, isSearching } =
    useSearchFood();

  useEffect(() => {
    if (searchFoodName) setCurrentFoods(() => foundFoods);
    else getAll();
  }, [foundFoods]);

  if (isLoading) return <Spinner classes={`mt-12`} />;

  return (
    <main
      className={`flex h-full w-10/12 mx-auto justify-center flex-col relative mt-12`}
    >
      <h1 className={`mx-auto text-lg text-white mb-6`}>Foods list</h1>

      <SearchInput
        isSearching={isSearching}
        searchField={searchFoodName}
        setSearchField={setSearchFoodName}
        placeholder={`Filter by name`}
      />

      <nav className="h-full overflow-y-auto mt-6" aria-label="Directory">
        {currentFoods?.length > 0 ? (
          groupByInitialLetter(currentFoods).map((grouped, index) => (
            <div
              key={index}
              className="relative mx-auto flex flex-col mb-6 bg-themebg-400 rounded-lg "
            >
              <div
                className="sticky top-0 z-10 border-y border-y-themebg-500 bg-themebg-400 px-3 py-1.5
                                text-sm font-semibold leading-6 text-gray-500 rounded-t-lg"
              >
                <h3>{grouped.initial.toUpperCase()}</h3>
              </div>
              <ul
                role="list"
                className="relative z-0 divide-y divide-themebg-500  overflow-hidden mt-0"
              >
                {grouped.items?.map((food: Food) => (
                  <li
                    key={food.id}
                    className="relative flex items-center space-x-3 px-6 py-2.5
                  focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500
                  focus-visible:ring-indigo-500 hover:bg-theme-500"
                  >
                    <div className="min-w-0 bg-themebg-400 w-full">
                      <p className="text-sm font-semibold leading-6 text-gray-200">
                        {food.name}
                      </p>
                      <p className="mt-1 truncate text-xs leading-5 text-gray-300">
                        {food.calories_qty || "Unknown"} kcal x {food.grams_qty}{" "}
                        gr
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className={`font-light text-white text-base`}>No food found.</p>
        )}
      </nav>
    </main>
  );
};

export default FoodsPage;
