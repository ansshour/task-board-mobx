import { PlusOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { useRef, useState } from "react";
import BoardStore from "../../stores/BoardStore";
import styles from "./BoardsList.module.css"
import cn from "classnames"
import { AddBoard } from "../AddBoard/AddBoard";

export const BoardsList: React.FC = observer(() => {

    const addBoardRef = useRef(null)
    const [isOpenAddBoard, setIsOpenAddBoard] = useState(false)

    return (
        <>
            {isOpenAddBoard && <AddBoard
                isOpen={isOpenAddBoard}
                setOpen={setIsOpenAddBoard}
                boardRef={addBoardRef}
                handler={value => BoardStore.addBoard(value)} />}
            <div className={styles.container}>
                <div className={styles.top}>
                    <p className={styles.title}>Мои доски</p>
                    <div
                        className={styles.addBoard}
                        ref={addBoardRef}
                        onClick={() => { setIsOpenAddBoard(!isOpenAddBoard) }}>
                        <PlusOutlined style={{ fontSize: "1.5rem" }} />
                    </div>
                </div>
                <ul className={styles.boardsList}>
                    {!BoardStore.boards.length && <p className={styles.emptyListBoards}>У вас еще нет досок.</p>}
                    {BoardStore.boards.map(({ id, name }) => (
                        <li
                            key={id}
                            className={cn(styles.boardListItem, BoardStore.activeBoardId === id && styles.selected)}
                            onClick={() => { BoardStore.setActiveBoard(id) }}>{name}</li>
                    ))}
                </ul>
            </div>
        </>
    )
})