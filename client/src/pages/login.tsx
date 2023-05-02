import type { NextPage } from "next";
import React, { useState } from "react";
import Modal from "@components/shared/Form/Modal";
import InputForm from "@components/shared/Form/InputForm";
import Button from "@components/shared/Buttons/Button";
import Link from "next/link";
import AuthUtils from "@utils/auth";

const LoginPage: NextPage = () => {
  const [email, setEmail] = useState<string>(``);
  const [password, setPassword] = useState<string>(``);
  const [emailHasErr, setEmailHasErr] = useState<boolean>(false);
  const logIn = async () => {
    if (AuthUtils.isEmailValid(email)) {
      setEmailHasErr(false);
    } else setEmailHasErr(true);
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
          <h1 className={`mx-auto text-lg mb-12`}>Log into your account</h1>
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
            {emailHasErr && (
              <p className={`text-sm text-red-500`}>
                Provide a valid e-mail address
              </p>
            )}
          </div>
          <InputForm
            type={"password"}
            name={`password`}
            placeholder={"Enter your password"}
            value={password}
            updateValue={(v) => setPassword(v.toString())}
            label={`Password`}
            fullWidth
          />
          <Button clickAction={() => logIn()} text={`Log in`} />
          <Link href={`signup`}>
            <p className={`underline mt-5 text-gray-600`}>
              Dont have an account? Sign up
            </p>
          </Link>
        </div>
      </Modal>
    </main>
  );
};

export default LoginPage;
