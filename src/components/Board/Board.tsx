import styles from "./Board.module.css"
import { observer } from "mobx-react-lite"
import { Column } from "../Column/Column"
import BoardStore from "../stores/BoardStore"
import { toJS } from "mobx"
import { Button } from "antd"


export const Board: React.FC = observer(() => {

    return (
        <div className={styles.container}>
            <div className={styles.columns}>
                {BoardStore.getCurrentColumns()?.map(({ id, name, cards }) => <Column key={id} id={id} name={name} cards={cards} />)}
                {BoardStore.activeBoardId ? (
                    <div className={styles.addColumn}>
                        <Button
                            block={true}
                            onClick={() => BoardStore.addColumn()}>Добавить колонку
                        </Button>
                    </div>
                ) : <p className={styles.emptyBoards}>Добавьте хотя бы одну доску</p>}
            </div>
        </div>
    )
})