import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/react";
// Can be a string as well. Need to ensure each key-value pair ends with ;

const override = css`
  display: flex;
  margin: 2rem auto;
`;

interface SpinnerProps {
  removeMargin?: boolean;
  size?: number;
  classes?: string;
  colorHex?: string;
  isLoadingWithText?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({
  removeMargin,
  size,
  classes,
  colorHex,
  isLoadingWithText,
}) => {
  const [loadingText, setLoadingText] = useState<string>(``);
  useEffect(() => {
    if (isLoadingWithText) {
      setInterval(() => {
        setLoadingText((p) => (p.length > 2 ? `.` : p.concat(`.`)));
      }, 500);
    }
  }, [isLoadingWithText]);

  const overriddenCss = removeMargin
    ? css`
        display: flex;
        margin: auto;
      `
    : override;

  const component = (
    <ClipLoader
      size={size ? size : 50}
      color={colorHex ? colorHex : "#34cbad"}
      // @ts-ignore
      css={overriddenCss}
    />
  );

  return (
    <div className={`flex justify-center items-center ${classes!}`}>
      {isLoadingWithText ? (
        <div
          className={`flex flex-col justify-center items-center gap-y-8 text-white font-light`}
        >
          <div className={`flex flex-row justify-center items-center`}>
            <p>Taking a coffee{loadingText}</p>
          </div>
          {component}
        </div>
      ) : (
        component
      )}
    </div>
  );
};

export default Spinner;
