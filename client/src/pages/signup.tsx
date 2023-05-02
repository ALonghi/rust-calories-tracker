import type { NextPage } from "next";
import React, { useState } from "react";
import Modal from "@components/shared/Form/Modal";
import InputForm from "@components/shared/Form/InputForm";
import Button from "@components/shared/Buttons/Button";
import Link from "next/link";
import Spinner from "@components/shared/Spinner";
import { createToast, IToast } from "@model/toast";
import { addNotification } from "@stores/notificationStore";
import AuthUtils from "@utils/auth";
import Utils from "@utils/utils";

const LoginPage: NextPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>(``);
  const [password, setPassword] = useState<string>(``);
  const [confirmPassword, setConfirmPassword] = useState<string>(``);
  const [invalidFields, setInvalidFields] = useState<string[]>([]);

  const isInputValid = () =>
    AuthUtils.isEmailValid(email) &&
    AuthUtils.isPasswordValid(password) &&
    AuthUtils.isPasswordValid(confirmPassword) &&
    password === confirmPassword;
  const signUp = async () => {
    setIsLoading(true);
    if (isInputValid()) {
      setInvalidFields(() => []);
    } else {
      const toast: IToast = createToast(
        "Some of the inputs contain errors.",
        "info"
      );
      addNotification(toast);
      if (!AuthUtils.isEmailValid(email))
        setInvalidFields((p) => Utils.uniqueArrayElements([...p, `email`]));
      else setInvalidFields((p) => p.filter((e) => e !== `email`));
      if (!AuthUtils.isPasswordValid(password))
        setInvalidFields((p) => Utils.uniqueArrayElements([...p, `password`]));
      else setInvalidFields((p) => p.filter((e) => e !== `password`));
      if (confirmPassword !== password)
        setInvalidFields((p) =>
          Utils.uniqueArrayElements([...p, `confirmPassword`])
        );
      else setInvalidFields((p) => p.filter((e) => e !== `confirmPassword`));
    }
    setIsLoading(false);
  };

  return (
    <main
      className={`flex h-full w-10/12 mx-auto justify-center flex-col relative mt-12`}
    >
      <Modal
        open={true}
        bgClass={`bg-themebg-500`}
        classes={`!shadow-none`}
        withoutOverlay
      >
        <div
          className={`flex flex-col justify-start items-center text-gray-300 py-8 w-10/12 mx-auto`}
        >
          {isLoading ? (
            <Spinner isLoadingWithText={isLoading} />
          ) : (
            <>
              <h1 className={`mx-auto text-lg mb-12`}>Create a new account</h1>
              <div className={`mb-4 w-full`}>
                <InputForm
                  type={"text"}
                  name={`email`}
                  placeholder={"tonyrobbins@gmail.com"}
                  value={email}
                  updateValue={(v) => setEmail(v.toString())}
                  label={`E-mail address`}
                  fullWidth
                />
                {invalidFields.includes(`email`) && (
                  <p className={`text-sm text-red-500`}>
                    Use a valid e-mail address.
                  </p>
                )}
              </div>
              <div className={`mb-4 w-full`}>
                <InputForm
                  type={"password"}
                  name={`password`}
                  placeholder={"Enter your password"}
                  value={password}
                  updateValue={(v) => setPassword(v.toString())}
                  label={`Password`}
                  componentClasses={`mb-4`}
                  fullWidth
                />
                {invalidFields.includes(`password`) && (
                  <p className={`text-sm text-red-500`}>
                    Password must be at least 8 characters long.
                  </p>
                )}
              </div>
              <div className={`mb-4 w-full`}>
                <InputForm
                  type={"password"}
                  name={`confirmPassword`}
                  placeholder={"Enter your password again"}
                  value={confirmPassword}
                  updateValue={(v) => setConfirmPassword(v.toString())}
                  label={`Confirm Password`}
                  fullWidth
                />
                {invalidFields.includes(`confirmPassword`) && (
                  <p className={`text-sm text-red-500`}>
                    Passwords do not match.
                  </p>
                )}
              </div>
              <Button clickAction={() => signUp()} text={`Create account`} />
              <Link href={`login`}>
                <div
                  className={`underline mt-5 text-gray-600 flex flex-col justify-center items-center`}
                >
                  <p>Already have an account? Log in</p>
                </div>
              </Link>
            </>
          )}
        </div>
      </Modal>
    </main>
  );
};

export default LoginPage;
