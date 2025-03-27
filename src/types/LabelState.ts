export enum LabelState {
  SHOW_ALL = "SHOW_ALL",
  SHOW_ONLY = "SHOW_ONLY",
  SHOW_OTHERS = "SHOW_OTHERS",
}

export interface LabelFilter {
  label: string;
  state: LabelState;
}
