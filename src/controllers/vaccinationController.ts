import { Request, Response } from 'express';
import { model } from "mongoose";
import { VaccinationSchema } from "../models/vaccinationModel";

const Vaccination = model('vaccinations', VaccinationSchema);

type ReqQuery = {
  c: string;
  dateFrom: string;
  dateTo: string;
  range: string;
}

type ValidationResult = {
  valid: boolean;
  msg: string;
  startYear: number;
  startWeek: number;
  endYear: number;
  minWeek: number;
  maxWeek: number;
  endWeek: number;
}

const validate = (reqQuery: ReqQuery): ValidationResult  => {
  const {dateFrom, dateTo} = reqQuery;
  const minYear:number = 2020;
  const minWeek:number = 1;
  const maxWeek:number = 53;
  let splitDateFrom:Array<string> =  dateFrom.split('-W');
  let splitDateTo:Array<string> =  dateTo.split('-W');
  let startYear:number = parseInt(splitDateFrom[0]);
  let endYear:number = parseInt(splitDateTo[0]);
  let startWeek:number = parseInt(splitDateFrom[1]);
  let endWeek:number = parseInt(splitDateTo[1]);
  let today:Date = new Date();
  let currentYear:number =  today.getFullYear();
  let startDate:Date = new Date(currentYear, 0, 1);
  let days:number = Math.floor((today.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
  let currentWeekNumber:number = Math.ceil(days / 7);
  let maxYear:number = currentYear;
  let result: ValidationResult = {
    valid: true,
    msg: '',
    startYear,
    startWeek,
    endYear,
    minWeek,
    maxWeek,
    endWeek
  }
  if (startYear > endYear) {
    result['msg'] = 'start year cannot be greater than end year';
  } else if (startYear < minYear) {
    result['msg'] = `start year cannot be lesser than ${minYear}`;
  } else if (startYear > maxYear) {
    result['msg'] = `start year cannot be greater than ${maxYear}`;
  } else if (startWeek > maxWeek || endWeek > maxWeek) {
    result['msg'] = 'week cannot be greater than 53';
  } else if (endYear === currentYear && endWeek > currentWeekNumber) {
    result['msg'] = 'end week cannot be greater than current week';
  }
  result['valid'] = !result['msg'].length ? result['valid'] : !result['valid'];
  return result;
}

const prepareYearWeekList = (result: ValidationResult): Array<string> => {
  let {startYear, startWeek, endYear, maxWeek, endWeek, minWeek} =  result;
  let yearWeekList:Array<string> = [];
  let iYear:number = startYear;
  let iWeek:number = startWeek < 1 ? 1 : startWeek;
  while (iYear <= endYear) {
    if (iWeek <= maxWeek) {
      yearWeekList.push(`${iYear}-W${iWeek < 10 ? '0'+ iWeek : iWeek}`);
      if (iYear === endYear && iWeek === endWeek) {
        break;
      }
      iWeek++;
    } else {
      iWeek = minWeek
      iYear++;
    }
  }
  return yearWeekList;
}

const summary = (req: Request, res: Response) => {
  if (Object.keys(req.query).length) {
    let reQuery: ReqQuery = req.query as ReqQuery;
    let result: ValidationResult = validate(reQuery);
    if (!result['valid']) {
      res.status(400);
      res.send(result['msg']);
    }
    let yearWeekList:Array<string> = prepareYearWeekList(result);
    Vaccination.aggregate([
      { "$match": {
        "$and": [{"ReportingCountry": reQuery['c']}, {"YearWeekISO": {"$in": yearWeekList}}],
      }},
      {
        "$group": {"_id": "$YearWeekISO", "totalNumberDosesReceived": {"$sum": 1}}
      },
    ], (err: Error, vaccinations:Array<{"_id": string, "totalNumberDosesReceived": number}>)=>{
        if (err) {
            res.send(err);
        }
        res.send(vaccinations);
    });
  } else {
    res.status(400);
    res.send('Missing query parameters!');
  }
}

export const vaccinationController = {
  summary
};
