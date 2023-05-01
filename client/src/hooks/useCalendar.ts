import { useEffect, useState } from "react";
import Day from "@model/day";
import DateUtils from "@utils/dateUtils";

const useCalendar = (selectedDate: Date) => {
  const [showPicker, setShowPicker] = useState<boolean>(false);

  const [selectedYear, setSelectedYear] = useState<number>(
    selectedDate.getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    selectedDate.getMonth()
  );
  const [selectedDay, setSelectedDay] = useState<Day>({
    date: selectedDate,
    isToday: true,
  } satisfies Day);
  const [days, setDays] = useState<Day[]>(
    DateUtils.getDaysOfMonth(selectedMonth, selectedYear, selectedDate)
  );

  useEffect(() => {
    setDays(() =>
      DateUtils.getDaysOfMonth(selectedMonth, selectedYear, selectedDate)
    );
  }, [selectedMonth, selectedYear]);
  const isCurrentMonth = (day: Day): boolean =>
    day.date.getMonth() === selectedMonth;
  const isToday = (day: Day): boolean =>
    isCurrentMonth(day) &&
    day.date.getFullYear() === selectedYear &&
    day.date === selectedDay.date;

  const previousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(12 - 1); // 0 based
      setSelectedYear((prevYear) => prevYear - 1);
    } else {
      setSelectedMonth((prevMonth) => prevMonth - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(1); // 0 based
      setSelectedYear((prevYear) => prevYear + 1);
    } else {
      setSelectedMonth((prevMonth) => prevMonth + 1);
    }
  };
  return {
    showPicker,
    setShowPicker,
    selectedMonth,
    selectedDay,
    setSelectedDay,
    days,
    isCurrentMonth,
    isToday,
    previousMonth,
    nextMonth,
  };
};

export default useCalendar;
