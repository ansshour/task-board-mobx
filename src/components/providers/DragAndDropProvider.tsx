import BoardStore, { CardT, ColumnT } from "../stores/BoardStore";
import { createContext, useContext, useState, useEffect } from "react"
import { deepClone } from "../utils/deepClone";
import { toJS } from "mobx";

type Props = {
    children: React.ReactNode;
}

const DragAndDropContext = createContext<any>(null)

export const useDragAndDrop = () => useContext(DragAndDropContext)

export const DragAndDropProvider: React.FC<Props> = ({ children }) => {

    const [draggableElement, setDraggapleElement] = useState<null | CardT>(null) // элемент, который перемещаем
    const [dragToElement, setDragToElement] = useState<null | CardT>(null) // элемент к которому перемещаем
    const [prevColumn, setPrevColumn] = useState<null | ColumnT>(null) // колонка в которой изначально лежал элемент
    const [nextColumn, setNextColumn] = useState<null | ColumnT>(null) // колонка в которую мы кладем элемент

    const dragEndHandler = () => {
        if (!draggableElement) { // функция не отработает, если нет этого, но оно агрится
            return;
        }

        let localCurrentColumns = BoardStore.getCurrentColumns()
        let localPrevColumn: ColumnT | null | any = prevColumn;
        let localNextColumn: ColumnT | null | any = nextColumn;
        const localDraggableElement = draggableElement;
        const localDragToElement = dragToElement;

        const indexDraggableElementInPrevColumn: number = (() => { // индекс перетаскиваемого элемента в изначальной колонке
            return localPrevColumn!.cards.findIndex((card: CardT) => card.id === localDraggableElement.id)
        })()
        let nextColumnIndexNextElement: number | undefined = (() => { // кидаем элемент в nextColumn перед 2 индексом
            if (localDragToElement) {
                return localNextColumn?.cards.findIndex((card: CardT) => card.id === localDragToElement.id)
            }
        })()
        let prevColumnIndexNextElement: number | undefined = (() => {
            if (localDragToElement) {
                return localPrevColumn?.cards.findIndex((card: CardT) => card.id === localDragToElement.id)
            }
        })()

        if (nextColumnIndexNextElement) {
            localNextColumn?.cards.splice(nextColumnIndexNextElement, 0, localDraggableElement)
            localPrevColumn = { ...localPrevColumn, cards: localPrevColumn?.cards.filter((card: CardT) => card.id !== localDraggableElement.id) }
            BoardStore.setColumnsBoard(localCurrentColumns?.map((column: ColumnT) => {
                if (column.id === localPrevColumn!.id) {
                    return localPrevColumn
                }
                if (column.id === localNextColumn!.id) {
                    return localNextColumn
                }
                return column
            }))
            return;
        }

        if (prevColumnIndexNextElement) {
            localNextColumn?.cards.splice(prevColumnIndexNextElement, 0, draggableElement)
            localPrevColumn = { ...localNextColumn, cards: localNextColumn?.cards.filter((card: CardT) => card.id !== localDraggableElement.id) }
            BoardStore.setColumnsBoard(localCurrentColumns?.map((column: ColumnT) => {
                if (column.id === localNextColumn!.id) {
                    return localNextColumn
                }
                return column
            }))
        }

    }

    const dragContextValues = {
        draggableElement,
        setDraggapleElement,
        dragToElement,
        setDragToElement,
        prevColumn,
        setPrevColumn,
        nextColumn,
        setNextColumn,
        dragEndHandler
    }

    useEffect(() => {
        console.log("Перемещаем элемент: ", draggableElement, "\n", "Который был в колонке:", prevColumn)
        console.log("К элементу: ", dragToElement, "\n", "Который в колонке: ", nextColumn)
    }, [draggableElement, dragToElement, prevColumn, nextColumn])

    return (
        <DragAndDropContext.Provider value={dragContextValues}>
            {children}
        </DragAndDropContext.Provider>
    )
}