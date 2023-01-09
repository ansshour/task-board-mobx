import TextArea from "antd/es/input/TextArea"
import BoardStore from "../stores/BoardStore";
import styles from "./Card.module.css"

type Props = {
    id: number;
    text: string;
    curColumnId: number;
}

export const Card: React.FC<Props> = (props) => {

    const { id, text, curColumnId } = props;

    return (
        <div className={styles.card}>
            <TextArea
                autoSize={true}
                value={text}
                onChange={e => BoardStore.setCard(id, curColumnId, e.target.value)} />
        </div>
    )
}