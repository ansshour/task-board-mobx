import TextArea from "antd/es/input/TextArea"
import { useDragAndDrop } from "../../providers/DragAndDropProvider";
import BoardStore, { CardT, ColumnT } from "../../stores/BoardStore";
import styles from "./Card.module.css"
import { useRef, useEffect, useState } from "react"
import { Modal } from "../Modal/Modal";
import { Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

type Props = {
    id: number;
    text: string;
    curColumnId: number;
    curColumn: ColumnT;
}

export const Card: React.FC<Props> = (props) => {

    const { id, text, curColumnId, curColumn } = props;
    const card: CardT = { id, text }

    const { setDraggapleElement, setDragToElement, setPrevColumn, setNextColumn, dragEndHandler } = useDragAndDrop()
    const [yPosInElement, setYPosElement] = useState(0);
    const [dragEnterElement, setDragEnterElement] = useState(0)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [cardText, setCardText] = useState(text)

    const cardRef = useRef<any>()

    const underOrUpper = (): "upper" | "under" => yPosInElement > (dragEnterElement / 2) ? "under" : "upper"

    const dragStartHandler = (e: React.DragEvent<HTMLDivElement>) => {
        queueMicrotask(() => {
            if (e.target instanceof HTMLElement) {
                e.target.style.opacity = "0"
            }
        })
        setDraggapleElement(card);
        setPrevColumn(curColumn)
    }

    const dragEnterHandler = (e: React.DragEvent<HTMLDivElement>) => {
        setDragToElement(card)
    }

    const onDragLeaveHandler = (e: React.DragEvent<HTMLDivElement>) => {
        if (e.target instanceof HTMLElement) {
            e.target.style.boxShadow = "none"
        }
    }

    const onDragEndHandler = (e: React.DragEvent<HTMLDivElement>) => {
        queueMicrotask(() => {
            if (e.target instanceof HTMLElement) {
                e.target.style.opacity = "1"
            }
        })
        document.querySelectorAll("#card").forEach((card: any) => card.style.boxShadow = "none")
        dragEndHandler(underOrUpper())
    }

    const onDragOverHandler = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        if (e.target instanceof HTMLElement) {
            setDragEnterElement(e.target.offsetHeight)
            setYPosElement(e.pageY - e.target.offsetTop)
            if (e.target === cardRef.current) {
                if (underOrUpper() === "upper") {
                    e.target.style.boxShadow = "1px -8px 8px 0px rgba(34, 60, 80, 0.2)"
                } else {
                    e.target.style.boxShadow = "1px 8px 8px 0px rgba(34, 60, 80, 0.2)"
                }
            }
        }
    }

    const saveChangeText = () => {
        setEditModalOpen(false)
        BoardStore.setCard(id, curColumnId, cardText)
    }

    useEffect(() => {
        setCardText(text)
    }, [editModalOpen])


    return (
        <>
            <div
                ref={cardRef}
                id="card"
                className={styles.card}
                draggable={true}
                onDragStart={dragStartHandler}
                onDragEnter={dragEnterHandler}
                onDragEnd={onDragEndHandler}
                onDragOver={onDragOverHandler}
                onDragLeave={onDragLeaveHandler}
                onDrop={e => e.preventDefault()}
            >
                <p className={styles.cardText}>{text.length ? text : <span className={styles.emptyCard}>Пустая карточка...</span>}</p>
                <div
                    className={styles.edit}
                    onClick={() => setEditModalOpen(true)}>
                    <EditOutlined />
                </div>
                <div
                    className={styles.delete}
                    onClick={() => BoardStore.deleteCard(id, curColumnId)}>
                    <DeleteOutlined />
                </div>
            </div >
            <Modal
                open={editModalOpen}
                setOpen={setEditModalOpen}>
                <p className={styles.editCard}>Редактирование карточки</p>
                <TextArea
                    autoSize={true}
                    value={cardText}
                    onChange={e => setCardText(e.target.value)} />
                <Button style={{ marginTop: "10px" }}
                    onClick={saveChangeText}>Сохранить изменения</Button>
                <Button
                    style={{ marginTop: "10px", marginLeft: "5px" }}
                    onClick={() => setEditModalOpen(false)}>Закрыть</Button>
            </Modal>
        </>
    )
}