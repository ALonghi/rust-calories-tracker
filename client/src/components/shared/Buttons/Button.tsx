import React from "react";

type ButtonProps = {
  clickAction: Function;
  text: string;
  isDisabled?: boolean;
};
const Button = ({ clickAction, text, isDisabled }: ButtonProps) => {
  return (
    <button
      className={`py-2 w-full text-light bg-teal-600 text-white rounded-lg mt-8 sticky bottom-0
                                disabled:bg-gray-500 disabled:text-gray-300 disabled:cursor-not-allowed`}
      disabled={isDisabled || false}
      onClick={() => clickAction()}
    >
      {text}
    </button>
  );
};

export default Button;
