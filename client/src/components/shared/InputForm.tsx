import Utils from "@utils/utils";

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
}

const InputForm: React.FC<InputFormProps> = (props) => {
  return (
    <div className={`${Utils.classNames(props.componentClasses)}`}>
      {props.label && (
        <label
          htmlFor={props.name}
          className="block text-sm font-medium text-gray-200"
        >
          {props.label}
        </label>
      )}
      <div className={``}>
        <input
          type={props.type}
          name={props.name}
          id={props.name}
          value={props.value}
          className={`bg-themebg-400 shadow-md  focus:outline-none
          border-none shadow-none rounded-md 
            focus:border-2 focus:border-themebg-300 w-full 
          text-white block pl-3 pr-10 py-2 my-3 placeholder:text-gray-600
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
        />
      </div>
    </div>
  );
};

export default InputForm;
