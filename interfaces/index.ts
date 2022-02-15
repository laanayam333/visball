export interface IData {
  player: string;
  club: string;
  year: number;
  season: string;
  teamGoals: number;
  playerGoals: number;
  playerAssists: number;
  playerGoalsPercentage: number;
  playerAssistsPercentage: number;
}

export interface IMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface IProps {
  data: IData[];
  height: number;
  width: number;
  margin: IMargin;
}
