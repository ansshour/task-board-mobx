import { Input } from "antd"
import Button from "antd/es/button"
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import styles from "./AddBoard.module.css"

type Props = {
    isOpen: boolean;
    setOpen: (value: boolean) => void;
    boardRef: any;
    handler: (name: string) => void;
}

export const AddBoard: React.FC<Props> = (props) => {

    const { isOpen, setOpen, boardRef, handler } = props;

    const [boardName, setBoardName] = useState("")

    const addBoard = (e: FormEvent) => {
        e.preventDefault()
        handler(boardName)
        setBoardName("")
        setOpen(false)
    }

    const handleOpen = useCallback((e: Event) => {
        const target = e.target as Element;
        if (boardRef) {
            if (target.contains(boardRef.current)) {
                setOpen(false)
            }
        }
    }, [boardRef, setOpen])

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("click", (e: Event) => {
                handleOpen(e)
            })

            return () => {
                document.removeEventListener("click", handleOpen)
            }
        }
    }, [handleOpen, isOpen])

    return (
        <div ref={boardRef}>
            <form
                onSubmit={e => addBoard(e)}
                className={styles.addBoard}>
                <p className={styles.title}>Название доски:</p>
                <Input
                    value={boardName}
                    onChange={e => setBoardName(e.target.value)}
                    placeholder="Введите имя доски" />
                <Button
                    htmlType="submit"
                >Создать</Button>
            </form>
        </div >
    )
}