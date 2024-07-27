import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import FormRow from "../components/form-row";
import { TForgetPasswordType } from "../types/types";
import { forgetPasswordSchema } from "../types/validations";
import "./sign-up.css";

const ForgetPassword = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isLoading },
  } = useForm<TForgetPasswordType>({
    resolver: zodResolver(forgetPasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const onSubmit = async (data: TForgetPasswordType) => {
    try {
      await axios.post(
        "http://localhost:5100/api/v1/user/forgetPassword",
        data
      );
      alert("Registration successful!");
      reset();
      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="sign-up-container">
      <form onSubmit={handleSubmit(onSubmit)} className="sign-up-form">
        <h2 className="heading">Reset Password</h2>

        <FormRow
          register={register}
          type="text"
          name="email"
          label="email"
          error={errors.email}
        />

        <button disabled={isLoading} type="submit">
          {isLoading ? "resetting" : "reset"}
        </button>
      </form>
    </div>
  );
};
export default ForgetPassword;
