import {GenderEnum} from "./gender";

export interface Patient {
  id?: string,
  firstName: string,
  lastName: string,
  birthday: Date,
  gender: GenderEnum,
  isEditing?: boolean,
}
