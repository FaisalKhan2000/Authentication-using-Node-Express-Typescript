import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import FormRow from "../components/form-row";
import { TSignUpType } from "../types/types";
import { signUpSchema } from "../types/validations";
import "./sign-up.css";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isLoading },
  } = useForm<TSignUpType>({
    resolver: zodResolver(signUpSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const onSubmit = async (data: TSignUpType) => {
    try {
      await axios.post("http://localhost:5100/api/v1/user/signup", data);
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
        <h2 className="heading">Sign Up</h2>
        <FormRow
          register={register}
          type="text"
          name="firstName"
          label="first name"
          error={errors.firstName}
        />
        <FormRow
          register={register}
          type="text"
          name="lastName"
          label="last name"
          error={errors.lastName}
        />
        <FormRow
          register={register}
          type="date"
          name="dob"
          label="date of birth"
          error={errors.dob}
        />
        <FormRow
          register={register}
          type="text"
          name="email"
          label="email"
          error={errors.email}
        />
        <FormRow
          register={register}
          type="password"
          name="password"
          label="password"
          error={errors.password}
        />
        <FormRow
          register={register}
          type="password"
          name="confirmPassword"
          label="confirm password"
          error={errors.confirmPassword}
        />
        <button disabled={isLoading} type="submit">
          {isLoading ? "submitting" : "submit"}
        </button>
        <p>
          already have an account?<Link to={"/login"}>login</Link>{" "}
        </p>
      </form>
    </div>
  );
};
export default SignUp;
