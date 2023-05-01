import Utils from "@utils/utils";
import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import DateUtils from "@utils/dateUtils";
import { motion } from "framer-motion";
import useCalendar from "@hooks/useCalendar";

type CalendarProps = {
  selectedDate: Date;
  afterUpdateDateFun: (date: Date) => void;
};

const Calendar = ({ selectedDate, afterUpdateDateFun }: CalendarProps) => {
  const {
    showPicker,
    setShowPicker,
    days,
    selectedMonth,
    selectedDay,
    setSelectedDay,
    isCurrentMonth,
    isToday,
    previousMonth,
    nextMonth,
  } = useCalendar(selectedDate);

  return (
    <>
      {showPicker ? (
        <div className="my-4 text-center w-full ">
          <div className="flex items-center text-gray-300">
            <button
              type="button"
              className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-300"
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon
                className="h-5 w-5"
                aria-hidden="true"
                onClick={() => previousMonth()}
              />
            </button>
            <div className="flex-auto text-sm font-semibold">
              {DateUtils.getMonthName(selectedMonth)}
            </div>
            <button
              type="button"
              className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon
                className="h-5 w-5"
                aria-hidden="true"
                onClick={() => nextMonth()}
              />
            </button>
          </div>
          <div className="mt-6 grid grid-cols-7 text-xs leading-6 text-gray-300">
            <div>M</div>
            <div>T</div>
            <div>W</div>
            <div>T</div>
            <div>F</div>
            <div>S</div>
            <div>S</div>
          </div>
          <motion.section
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-themebg-500 text-sm
                            px-3 py-1 shadow ring-1 ring-gray-200"
            >
              {days.map((day, dayIdx) => (
                <button
                  key={dayIdx}
                  type="button"
                  className={Utils.classNames(
                    "py-1.5 hover:bg-themebg-400 focus:z-10",
                    (day.isSelected || day.isToday) && "font-semibold",
                    day.isSelected && "text-white",
                    !day.isSelected &&
                      isCurrentMonth(day) &&
                      !isToday(day) &&
                      "text-gray-100",
                    !day.isSelected &&
                      !isCurrentMonth(day) &&
                      !day.isToday &&
                      "text-gray-500",
                    day.isToday && !day.isSelected && "text-indigo-600",
                    dayIdx === 0 && "rounded-tl-lg",
                    dayIdx === 6 && "rounded-tr-lg",
                    dayIdx === days.length - 7 && "rounded-bl-lg",
                    dayIdx === days.length - 1 && "rounded-br-lg"
                  )}
                  onClick={() => {
                    setSelectedDay(day);
                    setShowPicker(false);
                    afterUpdateDateFun(day.date);
                  }}
                >
                  <time
                    dateTime={DateUtils.getDateString(day.date)}
                    className={Utils.classNames(
                      "mx-auto flex h-7 w-7 items-center justify-center rounded-full",
                      day.isSelected && day.isToday && "bg-indigo-600",
                      day.isSelected && !day.isToday && "bg-gray-900"
                    )}
                  >
                    {DateUtils.getDateString(day.date)
                      .split("-")
                      .pop()
                      .replace(/^0/, "")}
                  </time>
                </button>
              ))}
            </div>
          </motion.section>
        </div>
      ) : (
        <div
          className={`bg-themebg-400 w-fit max-w-full flex justify-evenly items-center mx-auto
                    rounded-lg py-1 px-6 gap-x-6 cursor-pointer`}
          onClick={() => setShowPicker(true)}
        >
          <CalendarDaysIcon className={`text-gray-400 w-5`} />
          <p className={`text-gray-300`}>{selectedDay.date.toDateString()}</p>
          <PencilIcon className={`text-gray-400 w-4`} />
        </div>
      )}
    </>
  );
};

export default Calendar;
