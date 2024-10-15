import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import FormRow from "../components/form-row";
import { TResetPasswordType } from "../types/types";
import { resetPasswordSchema } from "../types/validations";
import "./sign-up.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isLoading },
  } = useForm<TResetPasswordType>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const onSubmit = async (data: TResetPasswordType) => {
    try {
      await axios.post(
        `http://localhost:5100/api/v1/user/reset-password/${token}`,
        data
      );
      alert("Registration successful!");
      reset();
      navigate("/login");
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
          type="password"
          name="password"
          label="Password"
          error={errors.password}
        />
        <FormRow
          register={register}
          type="password"
          name="confirmPassword"
          label="Confirm Password"
          error={errors.confirmPassword}
        />

        <button disabled={isLoading} type="submit">
          {isLoading ? "resetting" : "reset"}
        </button>
      </form>
    </div>
  );
};
export default ResetPassword;
