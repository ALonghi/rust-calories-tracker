export default class DateUtils {
  static convertToReadable = (date: Date) => {
    if (date) {
      const dateString = date.toDateString();
      const separatorIndex = dateString.indexOf(" ");
      return dateString.substring(separatorIndex, dateString.length);
    }
    return "";
  };

  static getDateString = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  static isToday = (date: Date) => {
    const today = new Date();
    return DateUtils.areEqual(date, today);
  };

  static areEqual = (date1: Date, date2: Date) =>
    date1.getUTCFullYear() === date2.getUTCFullYear() &&
    date1.getUTCMonth() === date2.getUTCMonth() &&
    date1.getUTCDay() === date2.getUTCDay();
}
