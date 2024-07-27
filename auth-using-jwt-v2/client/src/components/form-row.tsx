import { FieldError, UseFormRegister } from "react-hook-form";

type FormRowTypes = {
  name: string;
  label: string;
  type: string;
  register: UseFormRegister<any>;
  error?: FieldError;
};

const FormRow: React.FC<FormRowTypes> = ({
  name,
  label,
  type,
  register,
  error,
}) => {
  return (
    <>
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <input
        {...register(name)}
        type={type}
        name={name}
        id={name}
        placeholder={label}
      />
      {error && <p className="error">{error.message}</p>}
    </>
  );
};
export default FormRow;
