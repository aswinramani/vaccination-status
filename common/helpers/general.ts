import { InputValidation } from "../types/inputValidation";
import { ReqQuery } from "../types/reqQuery";
import ErrorCodes  from "./ErrorCodes";

const getCurrentWeek = (todayMs:number, startDateMs: number): number => {
    let days:number = Math.floor((todayMs - startDateMs) / (24 * 60 * 60 * 1000));
    return Math.ceil(days / 7);
}

const prepareYearWeekList = (result: InputValidation): Array<string> => {
    let {startYear, startWeek, endYear, maxWeek, endWeek, minWeek} =  result;
    let yearWeekList:Array<string> = [];
    let iYear:number = startYear;
    let iWeek:number = startWeek < 1 ? 1 : startWeek;
    while (iYear <= endYear) {
      if (iWeek <= maxWeek) {
        if (iYear === endYear && iWeek === endWeek) {
          break;
        }
        yearWeekList.push(`${iYear}-W${iWeek < 10 ? '0'+ iWeek : iWeek}`);
        iWeek++;
      } else {
        iWeek = minWeek;
        iYear++;
      }
    }
    return yearWeekList;
}

const validate = (reqQuery: ReqQuery): InputValidation => {
    let {code, messages} = ErrorCodes['BadRequest'];
    let result: InputValidation = {
        valid: true,
        msg: '',
        errorCode: code
    }
    if (!Object.keys(reqQuery).length) {
        result['msg'] = messages['missing'];
    } else {
        const {dateFrom, dateTo} = reqQuery;
        const minYear:number = 2020;
        result['minWeek'] = 1;
        result['maxWeek'] = 53;
        let splitDateFrom:Array<string> =  dateFrom.split('-W');
        let splitDateTo:Array<string> =  dateTo.split('-W');
        result['startYear'] = parseInt(splitDateFrom[0]);
        result['endYear'] = parseInt(splitDateTo[0]);
        result['startWeek'] = parseInt(splitDateFrom[1]);
        result['endWeek'] = parseInt(splitDateTo[1]);
        let today:Date = new Date();
        let currentYear:number =  today.getFullYear();
        let startDate:Date = new Date(currentYear, 0, 1);
        let currentWeekNumber:number = getCurrentWeek(today.getTime(), startDate.getTime());
        let maxYear:number = currentYear;
        if (result['startYear'] > result['endYear']) {
            result['msg'] = messages['case1'];
        } else if (result['startYear'] < minYear) {
            result['msg'] = `${messages['case2']} ${minYear}`;
        } else if (result['startYear'] > maxYear) {
            result['msg'] = `${messages['case3']} ${maxYear}`;
        } else if (result['startWeek'] > result['maxWeek'] || result['endWeek'] > result['maxWeek']) {
            result['msg'] = messages['case4'];
        } else if (result['startYear'] === currentYear && result['startWeek'] > currentWeekNumber) {
            result['msg'] = messages['case5'];
        }
    }
    result['valid'] = !result['msg'].length ? result['valid'] : !result['valid'];
    return result;
}

export const generalUtility = {
    validate,
    prepareYearWeekList,
    getCurrentWeek,
};
