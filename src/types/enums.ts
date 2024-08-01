export enum GamePhase {
  WAITING,
  PLAYING,
  RESULT,
  IDLE,
  JOINING_ROOM,
  JOINING_FAILED,
  CREATING_ROOM,
  CREATING_FAILED,
}

export enum RoomCodeJoinState {
  FILLED,
  NOT_FOUND,
  SUCCESS,
}
