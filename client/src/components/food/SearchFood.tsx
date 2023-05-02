import Utils from "@utils/utils";
import React, { Dispatch, SetStateAction } from "react";
import useSearchFood from "@hooks/meal/useSearchFood";
import { ArrowDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Food from "@model/food";
import { motion } from "framer-motion";
import SearchInput from "@components/shared/Form/SearchInput";

type SearchFoodProps = {
  chosenFood: Food | null;
  setChosenFood: Dispatch<SetStateAction<Food>>;
  classes?: string;
};
const SearchFood = ({
  chosenFood,
  setChosenFood,
  classes,
}: SearchFoodProps) => {
  const { foundFoods, searchFoodName, setSearchFoodName, isSearching } =
    useSearchFood();

  return (
    <div className={`w-full min-h-60 relative mt-4 ${classes || ``}`}>
      <p className="block text-sm font-medium text-gray-200">
        Search for existing food
      </p>
      {chosenFood ? (
        <div
          className={`rounded-lg bg-themebg-300 text-gray-300 py-1.5 px-4 mt-4
                flex flex-row justify-between`}
        >
          <p>{chosenFood.name}</p>
          <XMarkIcon
            className={`w-4 cursor-pointer`}
            onClick={() => setChosenFood(null)}
          />
        </div>
      ) : (
        <SearchInput
          isSearching={isSearching}
          searchField={searchFoodName}
          setSearchField={setSearchFoodName}
        />
      )}
      {foundFoods?.length > 0 && !chosenFood && (
        <div
          className=" z-10 mt-1 max-h-40 w-full overflow-auto max-h-40
                            rounded-md bg-themebg-400  py-1 text-base shadow-lg ring-1 ring-black
                            ring-opacity-5 focus:outline-none sm:text-sm border border-themebg-400 "
        >
          {foundFoods.map((food) => (
            <p
              key={food.id}
              className={Utils.classNames(
                "text-gray-300",
                "hover:bg-themebg-500 relative cursor-default select-none py-2 pl-3 pr-9"
              )}
              onClick={() => {
                setChosenFood(food);
                setSearchFoodName(``);
              }}
            >
              {food.name}
            </p>
          ))}
          {foundFoods?.length > 4 && (
            <motion.div
              className={`absolute bottom-4 right-4`}
              initial={{ y: 5 }}
              animate={{ y: 0 }}
              transition={{
                repeat: Infinity,
                duration: 0.75,
                repeatType: "mirror",
              }}
            >
              <ArrowDownIcon className={`w-5 text-gray-500`} />
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFood;
