import Utils from "@utils/utils";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface InputFormProps {
  label?: string;
  type: string;
  name: string;
  placeholder: string;
  value: string | number;
  updateValue: (value: string | number) => void;
  inputClasses?: string;
  componentClasses?: string;
  fullWidth?: boolean;
  enableAutocomplete?: boolean;
}

const inputClasses = `bg-themebg-400 shadow-md 
          border-none shadow-none rounded-md w-full
             focus:border-2 focus:outline-none focus:border-themebg-300 py-2 my-3`;

const eyeProps = (fun: Function) => ({
  onClick: () => fun(),
  className: `w-auto h-6 mr-4 ml-auto cursor-pointer`,
});
const InputForm: React.FC<InputFormProps> = (props) => {
  const [showInput, setShowInput] = useState<boolean>(false);

  return (
    <div
      className={`${Utils.classNames(props.componentClasses)} ${
        props.fullWidth ? `w-full` : `w-max`
      }`}
    >
      {props.label && (
        <label
          htmlFor={props.name}
          className="block text-sm font-medium text-gray-200"
        >
          {props.label}
        </label>
      )}
      <div
        className={`flex flex-row justify-between items-center w-full 
      ${props.type === `password` ? inputClasses : ``}`}
      >
        <input
          type={showInput ? `text` : props.type}
          name={props.name}
          id={props.name}
          value={props.value}
          className={`${
            props.type !== `password` ? inputClasses : `bg-transparent`
          }
                    focus:outline-none  focus:border-themebg-300
          text-white block placeholder:text-gray-600 pl-3 pr-6
             ${
               props.fullWidth ? `w-full` : `w-max`
             } sm:text-sm border-gray-400 rounded-md ${Utils.classNames(
            props.inputClasses
          )} `}
          placeholder={props.placeholder}
          onChange={(e) =>
            typeof props.value === "string"
              ? props.updateValue(e.target.value)
              : props.updateValue(e.target.valueAsNumber)
          }
          autoComplete={props.enableAutocomplete ? "on" : "off"}
        />
        {props.type === `password` &&
          (showInput ? (
            <EyeSlashIcon {...eyeProps(() => setShowInput(false))} />
          ) : (
            <EyeIcon {...eyeProps(() => setShowInput(true))} />
          ))}
      </div>
    </div>
  );
};

export default InputForm;
