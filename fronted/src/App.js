import Header from "./components/Header";
import Board from "./components/Board";
import { useDispatch, useSelector } from "react-redux";
import boardsSlice from "./redux/boardsSlice";
import { fetchRBoards } from "./redux/boardsSlice";
import userSlice from "./redux/userSlice";
import EmptyBoard from "./components/EmptyBoard";
import Splash from "./components/Splash";
import { useEffect } from "react";
import { BeatLoader } from "react-spinners";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (!user.isLogged && sessionStorage.getItem("userLogged"))
      dispatch(
        userSlice.actions.setUserLogged(sessionStorage.getItem("userLogged"))
      );
  }, []);

  useEffect(() => {
    if (user.isLogged) dispatch(fetchRBoards());
  }, [user.isLogged]);

  const boards = useSelector((state) => state.boards);
  const theme = useSelector((state) => state.theme);
  if (boards) {
    const activeBoard = boards.find((board) => board.isActive);
    if (!activeBoard && boards.length > 0)
      dispatch(boardsSlice.actions.setBoardActive({ index: 0 }));
  }

  if (user.isLogged && !boards) {
    return (
      <BeatLoader
        color="#635fc7"
        margin={5}
        cssOverride={{ textAlign: "center", marginTop: "20vh" }}
      />
    );
  }

  return (
    <>
      {user.isLogged ? (
        <div className={`app ${theme}`}>
          {boards.length > 0 ? (
            <>
              <Header />
              <Board />
            </>
          ) : (
            <EmptyBoard type="add" />
          )}
        </div>
      ) : (
        <Splash />
      )}
    </>
  );
}

export default App;
