import { autorun, makeAutoObservable, toJS } from 'mobx';

type Card = {
    id: number,
    text: string,
}

export type CardT = Card;
export type ColumnT = Column;

type Column = {
    id: number;
    name: string;
    cards: Card[];
}

type Board = {
    id: number,
    name: string,
    columns: Column[]
}


class BoardStore {
    constructor() {
        makeAutoObservable(this)
        autorun(() => {
            localStorage.setItem("boards", JSON.stringify(this.boards))
        })
    }

    boards: Board[] = localStorage.getItem("boards") ? JSON.parse(localStorage.getItem("boards")!) : []

    addBoard(name: string) {
        const id = Math.random()
        if (name) {
            this.boards.push({ id, name, columns: [] })
        }
        this.activeBoardId = id;
    }

    activeBoardId: number | null = this.boards.length ? this.boards[0]["id"] : null;

    setActiveBoard(id: number) {
        this.activeBoardId = id;
    }

    getCurrentColumns() {
        return this.boards.find((curItem: Board) => curItem.id === this.activeBoardId)?.columns
    }

    setColumnsBoard(columns: any) {
        this.boards = this.boards.map((board) => {
            if (!(board.id === this.activeBoardId)) {
                return board
            }
            return { ...board, columns }
        })
    }

    addColumn() {
        this.boards = this.boards.map((curBoard) => {
            if (curBoard.id === this.activeBoardId) {
                const columns = curBoard.columns;
                columns.push({ id: Math.random(), name: "Колонка", cards: [] })
                return { ...curBoard, columns }
            }
            return curBoard
        })
    }

    changeColumnName(newName: string, columnId: number) {
        this.boards = this.boards.map((curBoard: Board) => {
            if (curBoard.id === this.activeBoardId) {
                let columns = curBoard.columns;
                columns = columns.map((column: Column) => {
                    if (column.id === columnId) {
                        return { ...column, name: newName }
                    }
                    return column
                })
                return { ...curBoard, columns }
            }
            return curBoard
        })
        console.log(toJS(this.boards))
    }

    addCardToColumn(id: number) {
        this.boards = this.boards.map((curBoard: Board) => {
            if (curBoard.id === this.activeBoardId) {
                let columns = curBoard.columns;
                columns = columns.map((column: Column) => {
                    if (column.id === id) {
                        column.cards.push({ id: Math.random(), text: "" })
                    }
                    return column
                })
                return { ...curBoard, columns }
            }
            return curBoard
        })
    }

    setCard(cardId: number, columnId: number, text: string) {
        this.boards = this.boards.map((curBoard: Board) => {
            if (curBoard.id === this.activeBoardId) {
                let columns = curBoard.columns;
                columns = columns.map((column: Column) => {
                    if (column.id === columnId) {
                        let cards: Card[] = column.cards;
                        cards = cards.map((curCard: Card) => {
                            if (curCard.id === cardId) {
                                return { ...curCard, text }
                            }
                            return curCard
                        })
                        return { ...column, cards }
                    }
                    return column
                })
                return { ...curBoard, columns }
            }
            return curBoard
        })
    }

    deleteCard(id: number, columnId: number) {
        this.boards = this.boards.map((board) => {
            if (!(board.id === this.activeBoardId)) {
                return board
            }
            return {
                ...board,
                columns: board.columns.map((column) => {
                    if (!(column.id === columnId)) {
                        return column
                    }
                    return {
                        ...column,
                        cards: column.cards.filter((card) => card.id !== id)
                    }
                })
            }
        })
    }

}

export default new BoardStore()