import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../forms/Inputs";
import Button from "../forms/Button";
import { toast } from "react-toastify";
import { getUserToken } from "../Authentication/api";
import "../styles/login.css";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const emailRegex = new RegExp(
    /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/,
    "gm"
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = {};

    if (!data.email.trim()) {
      validation.email = " email is required";
    } else if (!emailRegex.test(data.email)) {
      validation.email = "email is not valid";
    }

    if (!data.password.trim()) {
      validation.password = "password is required";
    } else if (data.password.length < 6) {
      validation.password = "password should be at least 6 characters";
    }

    setErrors(validation);

    if (Object.keys(validation).length === 0) {
      const users = JSON.parse(localStorage.getItem("users"));
      const foundUser = users.find((user) => {
        return user.email === data.email && user.password === data.password;
      });
      if (!foundUser) {
        toast("Invalid credentials, check email or password");
        return;
      }
      setIsLoading(true);
      if (foundUser) {
        navigate("/");
      }
      getUserToken(foundUser, navigate);
      setIsLoading(false);
    }
  };
  return (
    <div className="login-div">
      <form className="login-form">
        <h2>Login here</h2>
        <Input
          label={"Email:"}
          name="email"
          value={data.email}
          placeholder="input email"
          onChange={(e) => handleChange(e)}
        />
        {errors.email && <span style={{ color: "red" }}>{errors.email}</span>}

        <Input
          label={"Password:"}
          name="password"
          value={data.password}
          type={"password"}
          placeholder="input password"
          onChange={(e) => handleChange(e)}
        />
        {errors.password && (
          <span style={{ color: "red" }}>{errors.password}</span>
        )}

        <Button
          name={isLoading ? "loading..." : "Login"}
          onClick={handleSubmit}
          loading={isLoading}
        />
        <div>
          <span>
            Not registered?
            <Link to={"/register"} className="links">
              Register
            </Link>
          </span>
          <br />
          <span>
            Forgot password?
            <Link to={"/forgot-password"} className="links">
              Click here
            </Link>
          </span>
        </div>
      </form>
      <div className="right-part"></div>
    </div>
  );
};

export default Login;
