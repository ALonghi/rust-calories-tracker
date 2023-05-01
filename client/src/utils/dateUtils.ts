import Day from "@model/day";

export default class DateUtils {
  static convertToReadable = (date: Date): string => {
    if (date) {
      const dateString = date.toDateString();
      const separatorIndex = dateString.indexOf(" ");
      return dateString.substring(separatorIndex, dateString.length);
    }
    return "";
  };

  static getDateString = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().padStart(2, "0");
    const readable = `${year}-${month}-${day}`;
    return readable;
  };

  static isToday = (date: Date) => {
    const today = new Date();
    return DateUtils.areEqual(date, today);
  };

  static areEqual = (date1: Date, date2: Date) =>
    date1.getUTCFullYear() === date2.getUTCFullYear() &&
    date1.getUTCMonth() === date2.getUTCMonth() &&
    date1.getUTCDay() === date2.getUTCDay();

  static getMonthName = (monthNumber: number): string => {
    const date = new Date();
    date.setMonth(monthNumber);

    return date.toLocaleString(undefined, {
      month: "long",
    });
  };

  static getDayName = (date: Date): string => {
    return date.toLocaleString(undefined, {
      weekday: "long",
    });
  };

  static getDaysFromMonday = (dayName: string): number => {
    switch (dayName) {
      case `Monday`:
        return 0;
      case `Tuesday`:
        return 1;
      case `Wednesday`:
        return 2;
      case `Thursday`:
        return 3;
      case `Friday`:
        return 4;
      case `Saturday`:
        return 5;
      case `Sunday`:
        return 6;
      default:
        return 0;
    }
  };

  static getDaysOfMonth = (month: number, year: number, today: Date): Day[] => {
    // Here January is 1 based
    //Day 0 is the last day in the previous month
    const numberOfDaysForCurrMonth = new Date(year, month + 1, 0).getDate();
    let dates: Day[] = [];
    for (let i = 1; i <= numberOfDaysForCurrMonth; i++) {
      const loopDate = new Date(year, month, i);
      dates.push({
        date: loopDate,
        isSelected: false,
        isToday: loopDate === today,
      } satisfies Day);
    }
    if (dates.length > 0) {
      const firstDayName = DateUtils.getDayName(dates[0].date);
      const daysFromMonday = DateUtils.getDaysFromMonday(firstDayName);
      if (daysFromMonday !== 0) {
        const prevMonthDate = new Date(year, month);
        for (let i = daysFromMonday; i > 0; i--) {
          const loopDate = new Date(year, month, prevMonthDate.getDate() - i);
          dates.splice(daysFromMonday - i, 0, {
            date: loopDate,
            isSelected: false,
            isToday: false,
          });
        }
      }
    }
    return dates;
  };
}
