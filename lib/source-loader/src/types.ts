export interface SourceLoc {
  line: number;
  col: number;
}

export interface SourceBlock {
  startLoc: SourceLoc;
  endLoc: SourceLoc;
}

export interface LocationsMap {
  [key: string]: SourceBlock;
}
