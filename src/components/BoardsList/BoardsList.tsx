import { PlusOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { useMemo, useRef, useState } from "react";
import { BoardsListStore } from "../BoardsListStore";
import styles from "./BoardsList.module.css"
import cn from "classnames"
import { AddBoard } from "../AddBoard/AddBoard";

type BoardListItem = {
    id: number;
    name: string;
}

export const BoardsList: React.FC = observer(() => {

    const addBoardRef = useRef(null)
    const [isOpenAddBoard, setIsOpenAddBoard] = useState(false)

    const store = useMemo(() => (
        new BoardsListStore()
    ), [])

    return (
        <>
            {isOpenAddBoard && <AddBoard
                isOpen={isOpenAddBoard}
                setOpen={setIsOpenAddBoard}
                boardRef={addBoardRef}
                handler={value => store.addBoard(value)} />}
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
                    {!store.boardsList.length && <p className={styles.emptyListBoards}>У вас еще нет досок.</p>}
                    {store.boardsList.map(({ id, name }) => (
                        <li
                            key={id}
                            className={cn(styles.boardListItem, store.activeBoardId === id && styles.selected)}
                            onClick={() => { store.setActiveBoard(id) }}>{name}</li>
                    ))}
                </ul>
            </div>
        </>
    )
})