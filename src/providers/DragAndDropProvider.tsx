import BoardStore, { CardT, ColumnT } from "../stores/BoardStore";
import { createContext, useContext, useState } from "react"
import { deepClone } from "../utils/deepClone";
import { isEqualsObj } from "../utils/isEquilsObj";

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

    type DestructoreType = {
        draggableElementL: CardT;
        dragToElementL: CardT;
        nextColumnL: ColumnT;
        prevColumnL: ColumnT;
        allColumns: ColumnT[]
    }

    const dragEndHandler = (pos: "under" | "upper") => {

        const draggableElementL: CardT = deepClone(draggableElement)
        const dragToElementL: CardT = deepClone(dragToElement)
        let prevColumnL: ColumnT = deepClone(prevColumn)
        let nextColumnL: ColumnT = deepClone(nextColumn)
        let allColumns: ColumnT[] = deepClone(BoardStore.getCurrentColumns())

        if (isEqualsObj(prevColumnL, nextColumnL)) {
            nextColumnL = prevColumnL;
        }

        const indexDragTo: number = nextColumnL!.cards.findIndex((card) => card.id === dragToElementL.id)
        const draggableIndex: number = prevColumnL!.cards.findIndex((card) => card.id === draggableElementL.id)
        prevColumnL.cards.splice(draggableIndex, 1)

        if (!isEqualsObj(prevColumnL, nextColumnL) && !nextColumnL.cards.length) {
            nextColumnL.cards.push(draggableElementL)
        } else {
            if (pos === "upper") {
                nextColumnL.cards.splice(indexDragTo, 0, draggableElementL)
            }

            if (pos === "under") {
                nextColumnL.cards.splice(indexDragTo + 1, 0, draggableElementL)
            }
        }

        allColumns = allColumns.map((column) => {
            if (column.id === prevColumnL.id) {
                return prevColumnL
            }
            if (column.id === nextColumnL.id) {
                return nextColumnL
            }
            return column
        })

        BoardStore.setColumnsBoard(allColumns)
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

    return (
        <DragAndDropContext.Provider value={dragContextValues}>
            {children}
        </DragAndDropContext.Provider>
    )
}