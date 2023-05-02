import isEmail from "validator/lib/isEmail";

export default class AuthUtils {
  static isPasswordValid = (pw: string) => pw?.length >= 8;

  static isEmailValid = (email: string) => isEmail(email);
}
