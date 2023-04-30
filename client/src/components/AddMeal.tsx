import React, { useCallback, useEffect, useRef, useState } from "react";
import Modal from "@components/shared/Modal";
import InputForm from "@components/shared/InputForm";
import { MealType } from "@model/meal";
import SelectBox from "@components/shared/SelectBox";
import Food, { getDefaultNewFood } from "@model/food";
import { CreateFoodRequest } from "@model/dto";
import _ from "lodash";
import FoodService from "@service/foodService";
import { createToast } from "@model/toast";
import { addNotification } from "@stores/notificationStore";
import Utils from "@utils/utils";
import AddButton from "@components/shared/AddButton";

type AddMealType = {
  createMealFun: (food: Food, mealType: MealType) => Promise<void>;
};
const AddMeal = ({ createMealFun }: AddMealType) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [newFoodData, setNewFoodData] = useState<CreateFoodRequest>(
    getDefaultNewFood()
  );
  const [chosenMeal, setChosenMeal] = useState<MealType | null>(
    MealType.Breakfast
  );
  const [chosenFood, setChosenFood] = useState<Food | null>(null);
  const [addingChoice, setAddingChoice] = useState<`saved` | `new`>(`saved`);

  const [searchFoodName, setSearchFoodName] = useState<string>(``);
  const [foundFoods, setFoundFoods] = useState<Food[]>([]);

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

  const throttled = useRef(_.throttle((prefix) => searchFoods(prefix), 1000));
  useEffect(() => throttled.current(searchFoodName), [searchFoodName]);

  const isFilledEnough = (): boolean =>
    chosenMeal && newFoodData.name && newFoodData.grams_qty > 0;
  const save = async (): Promise<void> => {
    try {
      if (isFilledEnough()) {
        const createdFood = await FoodService.createFood(newFoodData);
        await createMealFun(createdFood, chosenMeal).then(() => {
          setChosenMeal(MealType.Breakfast);
          setShowPopup(false);
          setNewFoodData(getDefaultNewFood());
          setSearchFoodName(``);
        });
        setShowPopup(false);
      }
      return Promise.resolve();
    } catch (e) {
      return Promise.reject<void>(e);
    }
  };

  useCallback(() => {
    if (searchFoodName) {
      console.log(`searchFoodName ${searchFoodName}`);
      _.throttle(searchFoods, 250, { trailing: false });
    }
  }, [searchFoodName]);

  return (
    <div className={``}>
      <Modal
        open={showPopup}
        setOpen={() => setShowPopup(false)}
        classes={`h-[85vh] `}
      >
        <p className={`text-md text-white mt-4 text-center`}>Add meal</p>
        <div
          className={`flex text-gray-300 justify-evenly mt-6 text-base cursor-pointer items-center text-center `}
        >
          <p
            className={`border-r border-gray-400 w-6/12 ${
              addingChoice === `saved` && `underline`
            }`}
            onClick={() => setAddingChoice(`saved`)}
          >
            Select existing
          </p>
          <p
            className={`w-6/12 ${addingChoice === `new` && `underline`}`}
            onClick={() => setAddingChoice(`new`)}
          >
            Create new food
          </p>
        </div>
        <div
          className={`my-4 flex flex-col justify-center items-center m-auto py-4 px-6 bg-theme max-h-[85%] gap-y-3`}
        >
          <div
            className={`flex flex-col items-start justify-start flex-1 w-full `}
          >
            <p className={`text-white text-sm `}>Select meal </p>
            <SelectBox
              options={Object.values(MealType).map((t) => _.capitalize(t))}
              selected={_.capitalize(chosenMeal)}
              setSelected={(value) => setChosenMeal(() => value as MealType)}
              classes={`py-2 w-full`}
            />
          </div>
          <InputForm
            type={"number"}
            name={"foodQty"}
            label="Quantity (grams)"
            placeholder={"100"}
            value={newFoodData.grams_qty}
            updateValue={(value) =>
              setNewFoodData((p) => ({ ...p, grams_qty: Number(value) }))
            }
            componentClasses={` w-full`}
            fullWidth
          />
          {addingChoice === `new` ? (
            <>
              <div className={`w-full overflow-y-scroll `}>
                <InputForm
                  type={"text"}
                  name={"foodName"}
                  label="Food name"
                  placeholder={"Rice, Broccoli, etc."}
                  value={newFoodData.name}
                  updateValue={(value) =>
                    setNewFoodData((p) => ({ ...p, name: value.toString() }))
                  }
                  componentClasses={`w-full`}
                  fullWidth
                />
                {newFoodData.nutritional_values.map((obj, i) => (
                  <InputForm
                    key={i}
                    label={obj.key}
                    type={"number"}
                    name={obj.key}
                    placeholder={"300"}
                    value={obj.value}
                    updateValue={(value) =>
                      setNewFoodData((p) => ({
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

                {/*<button className={`rounded-md w-full bg-teal-700 text-gray-300 border-1 px-x py-2 mt-4`}>Add new property</button>*/}
              </div>
              <button
                className={`py-2 w-full text-light bg-teal-600 text-white rounded-lg mt-8 sticky bottom-0
                                disabled:bg-gray-500 disabled:text-gray-300 disabled:cursor-not-allowed`}
                disabled={!isFilledEnough()}
                onClick={() => save()}
              >
                Save
              </button>
            </>
          ) : (
            <div className={`w-full min-h-60 relative`}>
              <InputForm
                label={"Search by food name"}
                type={"text"}
                name={"existingFoodName"}
                placeholder={"Rice"}
                value={searchFoodName}
                inputClasses={`!w-full`}
                componentClasses={`w-full`}
                updateValue={(value) =>
                  setSearchFoodName(() => value?.toString())
                }
              />
              {foundFoods?.length > 0 && (
                <div
                  className=" z-10 mt-1 max-h-40 w-full overflow-auto
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
                    >
                      {food.name}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>
      <AddButton action={() => setShowPopup(true)} />
    </div>
  );
};

export default AddMeal;
