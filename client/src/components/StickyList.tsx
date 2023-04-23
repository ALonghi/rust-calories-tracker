import Meal from "@model/meal";
import Link from "next/link";

type StickyListProps = {
  meals: Meal[];
};

export default function StickyList({ meals }: StickyListProps) {
  const types: string[] = Array.from(new Set(meals.map((m) => m.meal_type)));
  return (
    <nav
      className=" w-full h-full overflow-y-auto my-12 flex flex-col gap-y-8 "
      aria-label="Directory"
    >
      {types.map((type) => (
        <div
          key={type}
          className="relative w-11/12 mx-auto flex flex-col mb-0 bg-themebg-400 rounded-lg "
        >
          <div
            className="sticky top-0 z-10 border-b border-t border-themebg-500 text-gray-300
                        px-6 py-2 text-sm font-medium  w-full"
          >
            <h3>{type}</h3>
          </div>
          <ul
            role="list"
            className="relative z-0 divide-y divide-themebg-500  overflow-hidden mt-0"
          >
            {meals
              ?.filter((m) => m.meal_type === type)
              ?.map((m) => m.food)
              ?.map((food, i) => (
                <li key={food.id} className={``}>
                  <div className="relative flex items-center space-x-3 px-6 py-2.5 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 hover:bg-theme-500">
                    <div className="min-w-0 flex-1">
                      <Link
                        href="#"
                        className="focus:outline-none flex justify-between flex-row h-fit"
                      >
                        {/* Extend touch target to entire panel */}
                        <span className="absolute inset-0" aria-hidden="true" />
                        {/*<p className="text-sm font-medium text-gray-900">{food.name}</p>*/}
                        <div>
                          <div
                            className={`flex flex-row gap-x-4 flex-wrap items-center `}
                          >
                            <p className="text-sm font-medium text-gray-100 w-full ">
                              Whole grain rice
                            </p>
                            <p className="truncate text-sm text-gray-400">
                              {food.grams_qty} gr
                            </p>
                          </div>
                          <p className="text-sm font-medium text-gray-400 mt-1">
                            {food.calories_qty} kcal
                          </p>
                        </div>
                        <div
                          className={`flex flex-row gap-x-4 justify-center items-center`}
                        >
                          {food.nutritional_values?.map((n, i) => (
                            <div key={i}>
                              <p className="truncate text-sm text-gray-300">
                                {n.key}
                              </p>
                              <p className="truncate text-sm text-gray-400">
                                {n.value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
