import React from "react";

type ButtonProps = {
  text: string;
  isDisabled?: boolean;
  clickAction?: Function;
  btnType?: "submit" | "button"
};
const Button = ({ clickAction, text, isDisabled, btnType }: ButtonProps) => {
  return (
    <button
        type={btnType || "button"}
      className={`py-2 w-full text-light bg-teal-600 text-white rounded-lg mt-8 sticky bottom-0
                                disabled:bg-gray-500 disabled:text-gray-300 disabled:cursor-not-allowed`}
      disabled={isDisabled || false}
      onClick={() => clickAction ? clickAction() : null}
    >
      {text}
    </button>
  );
};

export default Button;
