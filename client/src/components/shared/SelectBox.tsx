import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import Utils from "@utils/utils";

type SelectBoxProps = {
  options: string[];
  setSelected: (opt: string) => void;
  selected?: string;
  classes?: string;
};
export default function SelectBox({
  options,
  setSelected,
  selected,
  classes,
}: SelectBoxProps) {
  return (
    <Listbox value={"Choose"} onChange={(value) => setSelected(value)}>
      {({ open }) => (
        <>
          <div className={`relative mt-2 w-fit ${classes || ``}`}>
            <Listbox.Button
              className="relative w-full cursor-default rounded-md bg-themebg-400
             py-1.5 pl-3 pr-10 text-left text-gray-200 shadow-sm ring-1 ring-inset ring-gray-700
             focus:outline-none focus:ring-2 focus:ring-theme-600 sm:text-sm sm:leading-6"
            >
              {selected ? (
                <span className="block truncate">{selected}</span>
              ) : (
                <span aria-disabled>Select option..</span>
              )}
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                className="pr-12 absolute z-10 mt-1 max-h-60 w-full overflow-auto
                            rounded-md bg-themebg-400  py-1 text-base shadow-lg ring-1 ring-black
                            ring-opacity-5 focus:outline-none sm:text-sm"
              >
                {options.map((option, i) => (
                  <Listbox.Option
                    key={i}
                    className={({ active }) =>
                      Utils.classNames(
                        active ? "bg-theme-600 text-white" : "text-gray-300",
                        "relative cursor-default select-none py-2 pl-3 pr-9"
                      )
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={Utils.classNames(
                            selected ? "font-semibold" : "font-normal",
                            "block truncate"
                          )}
                        >
                          {option}
                        </span>

                        {selected ? (
                          <span
                            className={Utils.classNames(
                              active ? "text-white" : "text-theme-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
