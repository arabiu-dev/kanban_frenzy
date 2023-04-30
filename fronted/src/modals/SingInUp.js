import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userLogin, userSignUp } from "../redux/userSlice.js";
import "../styles/BoardModals.css";
import toast, { Toaster } from "react-hot-toast";
import store from "../redux/store.js";

export default function SignInUp({ type, setIsBoardModalOpen }) {
  const dispatch = useDispatch();
  const [username, setName] = useState("");
  const [passWordError, setPassWordError] = useState("Can't be empty");
  const [nameWordError, setNameWordError] = useState("Can't be empty");
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(true);

  let notify;
  const { error, requestLoading } = useSelector((state) => state.user);

  if (error === "Valid") {
    setIsBoardModalOpen(false);
  }

  const validate = () => {
    setIsValid(false);
    if (!username.trim() || !password.trim()) {
      setNameWordError("Can't be empty");
      setPassWordError("Can't be empty");
      return false;
    }

    if (password.trim().length < 6) {
      setPassword("");
      setPassWordError("Min length is six");
      return false;
    }
    setIsValid(true);
    return true;
  };

  const onSubmit = async (type) => {
    if (type === "signin") {
      await dispatch(userLogin({ username, password }));
    } else {
      await dispatch(userSignUp({ username, password }));
    }
    notify = () => toast.error(store.getState().user.error);
  };

  if (requestLoading) {
    return (
      <div className="preloader" data-preloader>
        <div className="circle" data-circle></div>
      </div>
    );
  }

  return (
    <div
      className="modal-container dimmed"
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setIsBoardModalOpen(false);
      }}
    >
      <div className="modal">
        <h3>
          {type === "signin" ? "Login to your account" : "Create an account"}
        </h3>
        <label htmlFor="board-name-input">Username</label>
        <div className="input-container">
          <input
            value={username}
            onChange={(e) => setName(e.target.value)}
            id="board-name-input"
            type="text"
            placeholder="e.g. Korra Dune"
            className={!isValid && !username.trim() ? "red-border" : ""}
          />
          {!isValid && !username.trim() && (
            <span className="cant-be-empty-span text-L">{nameWordError}</span>
          )}
        </div>
        <label htmlFor="board-name-input">Password</label>
        <div className="input-container">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="board-password-input"
            type="password"
            placeholder="e.g. Min 6 chars"
            className={!isValid && !password.trim() ? "red-border" : ""}
          />
          {!isValid && !password.trim() && (
            <span className="cant-be-empty-span text-L"> {passWordError}</span>
          )}
        </div>
        <button
          onClick={async () => {
            const isValid = validate();
            if (isValid === true) await onSubmit(type);
            notify();
          }}
          className="create-btn"
        >
          {type === "signin" ? "Login" : "Create an account"}
        </button>
        {
          <Toaster
            position="top-left"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
              // Define default options
              className: "",
              duration: 5000,
              style: {
                background: "#635fc7",
                color: "#fff",
              },
            }}
          />
        }
      </div>
    </div>
  );
}
