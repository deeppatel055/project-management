import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword,clearErrors } from './../../actions/userActions';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const { loading, error, success, message } = useSelector(
    (state) => state.password
  );

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearErrors());
    }
    if (success) {
      alert(message || "Check your email for reset instructions");
    }
  }, [error, success, message, dispatch]);

  return (
    <form onSubmit={submitHandler}>
      <h2>Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your registered email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Send Reset Email"}
      </button>
    </form>
  );
};

export default ForgotPassword;
