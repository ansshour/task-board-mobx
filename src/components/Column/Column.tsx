import { Button, Input } from "antd"
import { Card } from "../Card/Card";
import { useDragAndDrop } from "../providers/DragAndDropProvider";
import BoardStore from "../stores/BoardStore";
import styles from "./Column.module.css"

type Card = {
    id: number;
    text: string;
}

type Props = {
    id: number;
    name: string;
    cards: Card[]
}

export const Column: React.FC<Props> = (props) => {

    const { id, name, cards } = props;

    const { setNextColumn } = useDragAndDrop()
    return (
        <div
            className={styles.column}
            onDragEnter={() => setNextColumn(props)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={e => e.preventDefault()}
        >
            <div className={styles.top}>
                <Input
                    // value={name}
                    value={name + String(id)}
                    onChange={e => BoardStore.changeColumnName(e.target.value, id)} />
            </div>
            <div className={styles.addCard}>
                <Button
                    onClick={() => BoardStore.addCardToColumn(id)}>Добавить карточку</Button>
            </div>
            <div className={styles.cards}>
                {cards.map((card) => <Card key={card.id} {...card} curColumnId={id} curColumn={props} />)}
            </div>
        </div >
    )
}