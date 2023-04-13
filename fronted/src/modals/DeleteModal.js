import React from "react";
import { useSelector } from "react-redux";

export default function DeleteModal({ type, title, onDeleteBtnClick }) {
  const user = useSelector((state) => state.user);
  return (
    <div className="modal-container dimmed">
      <div className="delete-modal">
        <h3 className="heading-L">{type !== "logout" ? `Delete this ${type}?` : "Logout"}</h3>
        {type === "task" && (
          <p className="text-L">
            Are you sure you want to delete the "{title}" task and its subtasks?
            This action cannot be reversed.
          </p>
        )}
        
        {type === "board" && (
          <p className="text-L">
            Are you sure you want to delete the "{title}" board? This action
            will remove all columns and tasks and cannot be reversed.
          </p>
        )}

        {type === "logout" && (
          <p className="text-L">
            Hi {user.username}, You are about to logout of your current session. You sure about this?
          </p>
        )}

        <div className="delete-modal-btns">
          <button onClick={onDeleteBtnClick} className="btn delete-btn">
            { type === "logout" ? "Logout" : "Delete"}
          </button>
          <button onClick={onDeleteBtnClick} className="btn cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
