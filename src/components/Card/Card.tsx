import TextArea from "antd/es/input/TextArea"
import { useDragAndDrop } from "../providers/DragAndDropProvider";
import BoardStore, { CardT, ColumnT } from "../stores/BoardStore";
import styles from "./Card.module.css"
import { useRef, useEffect, useState } from "react"

type Props = {
    id: number;
    text: string;
    curColumnId: number;
    curColumn: ColumnT;
}

export const Card: React.FC<Props> = (props) => {

    const { setDraggapleElement, setDragToElement, setPrevColumn, setNextColumn, dragEndHandler } = useDragAndDrop()
    const [yPosInElement, setYPosElement] = useState(0);
    const [dragEnterElement, setDragEnterElement] = useState(0)


    const cardRef = useRef<any>()

    const { id, text, curColumnId, curColumn } = props;
    const card: CardT = { id, text }

    const underOrUpper = (): "upper" | "under" => yPosInElement > (dragEnterElement / 2) ? "under" : "upper"

    const dragStartHandler = (card: CardT, column: ColumnT, e: any) => {
        queueMicrotask(() => e.target.style.opacity = "0")
        setDraggapleElement(card);
        setPrevColumn(column)
    }

    const dragEnterHandler = (card: CardT, column: ColumnT, e: any) => {
        if (e.target === cardRef.current) {
            if (underOrUpper() === "upper") {
                e.target.style.boxShadow = "1px -8px 8px 0px rgba(34, 60, 80, 0.2)"
            } else {
                e.target.style.boxShadow = "1px 8px 8px 0px rgba(34, 60, 80, 0.2)"
            }

        }
        setDragEnterElement(e.target.offsetHeight)
        setYPosElement(e.pageY - e.target.offsetTop)
        setDragToElement(card)
        // setNextColumn(column)
    }

    const onDragLeaveHandler = (e: any) => {
        e.target.style.boxShadow = "none"
    }

    const onDragEndHandler = (e: any) => {
        queueMicrotask(() => e.target.style.opacity = "1")
        document.querySelectorAll("#card").forEach((card: any) => card.style.boxShadow = "none")
        dragEndHandler(underOrUpper())
    }

    return (
        <div
            ref={cardRef}
            id="card"
            className={styles.card}
            draggable={true}
            onDragStart={(e) => dragStartHandler(card, curColumn, e)}
            onDragEnter={(e: any) => dragEnterHandler(card, curColumn, e)}
            onDragEnd={(e: any) => onDragEndHandler(e)}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={(e: any) => { onDragLeaveHandler(e) }}
            onDrop={e => e.preventDefault()}
        >
            {/* <div className={styles.disabled}></div> */}
            {/* <TextArea
                autoSize={true}
                value={id}
                onChange={e => BoardStore.setCard(id, curColumnId, e.target.value)} /> */}
            {id}
        </div >
    )
}