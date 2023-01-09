import { Board } from "../../components/Board/Board"
import { BoardsList } from "../../components/BoardsList/BoardsList"
import styles from "./Main.module.css"

export const Main: React.FC = () => {
    return (
        <div className={styles.container}>
            <div>
                <BoardsList />
            </div>
            <Board />
        </div>
    )
}