class GameSavedStatus<T> {
  constructor(private isCorrectStatus: (status: any) => status is T) {}

  save(status: T): void {
    localStorage.setItem("gameStatus", JSON.stringify(status));
  }

  get(): T | null {
    const status = localStorage.getItem("gameStatus");
    if (status === null) {
      return null;
    }

    const parsedStatus = JSON.parse(status);
    if (this.isCorrectStatus(parsedStatus)) {
      return parsedStatus;
    }

    return null;
  }
}

// ------------------------------------------------

export interface MyGameStatus {
  level: number;
  player2IsActive: boolean;
  numberOfTorchPlayer1: number;
  numberOfTorchPlayer2: number;
}

const isMyGameStatus = (status: any): status is MyGameStatus => {
  return (
    typeof status.level === "number" &&
    typeof status.player2IsActive === "boolean" &&
    typeof status.numberOfTorchPlayer1 === "number" &&
    typeof status.numberOfTorchPlayer2 === "number"
  );
};

export const gameSavedStatus = new GameSavedStatus(isMyGameStatus);
