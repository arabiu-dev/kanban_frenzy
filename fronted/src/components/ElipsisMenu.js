import React from "react";

export default function ElipsisMenu({
  type,
  setOpenEditModal,
  setOpenDeleteModal,
  setOpenShareModal,
}) {
  return (
    <div className="elipsis-menu text-L">
      <p
        onClick={() => {
          setOpenEditModal();
        }}
      >
        Edit {type}
      </p>
      { type === "board" && 
        <p
          className="elipsis-menu-grey"
          onClick={() => {
            setOpenShareModal();
          }}
        >
          Share {type}
        </p>}
      <p onClick={() => setOpenDeleteModal("board")} className="elipsis-menu-red">
        Delete {type}
      </p>
      { type === "board" && 
      <p onClick={() => setOpenDeleteModal("logout")} className="elipsis-menu-red">
      Logout
    </p>}
    </div>
  );
}
