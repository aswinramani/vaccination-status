export type InputValidation = {
    valid: boolean;
    msg: string;
    errorCode?: number;
    startYear?: number;
    startWeek?: number;
    endYear?: number;
    minWeek?: number;
    maxWeek?: number;
    endWeek?: number;
}
