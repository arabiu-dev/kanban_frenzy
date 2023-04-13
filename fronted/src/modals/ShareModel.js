import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { shareBoard } from "../redux/boardsSlice";
import "../styles/BoardModals.css";

export default function SharedModal({ title, board, setIsShareModalOpen }) {
    const dispatch = useDispatch();
    const [username, setName] = useState("");
    const [isValid, setIsValid] = useState(true);


    const validate = () => {
        setIsValid(false);
        if (!username.trim()) {
            return false;
        }
        setIsValid(true);
        return true;
    };

    const onSubmit = () => {
        console.log(username);
        setIsShareModalOpen(false);
        dispatch(shareBoard({username, board: {...board, isActive: false}}));
    };

    return (
        <div
            className="modal-container dimmed"
            onClick={(e) => {
                if (e.target !== e.currentTarget) {
                    return;
                }
                setIsShareModalOpen(false);
            }}
        >
            <div className="modal delete-modal">
                <h3>Board Sharing</h3>
                <p className="text-L">
                    You are about to share the board "{title}" and grant access to another existing user.
                    This person will be able to make changes to this board. You sure about this ?
                </p>
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
                        <span className="cant-be-empty-span text-L"> Can't be empty</span>
                    )}
                </div>
                <button
                    onClick={() => {
                        const isValid = validate();
                        if (isValid === true) onSubmit();
                    }}
                    className="create-btn"
                >
                    Share -:)
                </button>
            </div>
        </div>
    );
}
