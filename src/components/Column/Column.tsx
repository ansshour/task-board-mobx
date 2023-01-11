import { Button, Input } from "antd"
import { Card } from "../Card/Card";
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

    return (
        <div
            draggable={true}
            className={styles.column}
        // onDragEnter={() => console.log(props)}
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