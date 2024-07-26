import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import FormRow from "../components/form-row";
import { TLoginType } from "../types/types";
import { loginSchema } from "../types/validations";
import "./sign-up.css";

const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isLoading },
  } = useForm<TLoginType>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const onSubmit = async (data: TLoginType) => {
    axios.defaults.withCredentials = true;
    try {
      await axios.post("http://localhost:5100/api/v1/user/login", data);
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

        <button disabled={isLoading} type="submit">
          {isLoading ? "logging" : "login"}
        </button>
        <p>
          forget password?<Link to={"/forget-password"}>forget password</Link>{" "}
        </p>
        <p>
          don't have an account?<Link to={"/signup"}>signup</Link>{" "}
        </p>
      </form>
    </div>
  );
};
export default Login;
