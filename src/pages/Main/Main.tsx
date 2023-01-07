import { BoardsList } from "../../components/BoardsList/BoardsList"
import styles from "./Main.module.css"

export const Main: React.FC = () => {
    return (
        <div className={styles.container}>
            <BoardsList />
        </div>
    )
}