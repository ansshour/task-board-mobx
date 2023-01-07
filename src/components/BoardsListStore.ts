import { makeAutoObservable } from 'mobx';

type BoardList = {
    id: number,
    name: string,
}

class BoardsListStore {
    constructor() {
        makeAutoObservable(this)
    }

    boardsList: BoardList[] = []

    addBoard(name: string) {
        const id = Math.random()
        if (name) {
            this.boardsList.push({ id, name })
        }
        this.activeBoardId = id;
    }

    activeBoardId: number | null = this.boardsList.length ? this.boardsList[0]["id"] : null;

    setActiveBoard(id: number) {
        this.activeBoardId = id;
    }

}

export { BoardsListStore }