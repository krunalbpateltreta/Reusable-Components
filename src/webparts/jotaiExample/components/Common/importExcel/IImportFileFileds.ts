import { FeildType } from "../../../Shared/Enum/FieldType";

export interface IImportFields {
    fieldName: string;
    required: boolean;
    type: FeildType;
    isMulti?: boolean;
    excelRemark?: boolean;
}