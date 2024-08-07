import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./layout/layout";
import ForgetPassword from "./pages/forget-password";
import Home from "./pages/home";
import Login from "./pages/login";
import ResetPassword from "./pages/reset-password";
import SignUp from "./pages/sign-up";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/forget-password",
        element: <ForgetPassword />,
      },
      {
        path: "/reset-password/:token",
        element: <ResetPassword />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};
export default App;
