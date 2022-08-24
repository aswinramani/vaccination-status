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

const get = (req: Request, res: Response) => {
  let orList:Array<{"YearWeekISO": string}> = [];
  if (Object.keys(req.query).length) {
    const {c, dateFrom, dateTo} = req.query as ReqQuery;
    let splitDateFrom:Array<string> =  dateFrom.split('-W');
    let splitDateTo:Array<string> =  dateTo.split('-W');
    let startYear:number = parseInt(splitDateFrom[0]);
    let endYear:number = parseInt(splitDateTo[0]);
    let startWeek:number = parseInt(splitDateFrom[1]);
    let endWeek:number = parseInt(splitDateTo[1]);
    const minYear:number = 2020;
    let today:Date = new Date();
    let currentYear:number =  today.getFullYear();
    let startDate:Date = new Date(currentYear, 0, 1);
    let days:number = Math.floor((today.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
    let currentWeekNumber:number = Math.ceil(days / 7);
    let maxYear:number = currentYear;
    const minWeek:number = 1;
    const maxWeek:number = 53;
    if (startYear > endYear) {
      res.status(400);
      res.send('start year cannot be greater than end year');
    } else if (startYear < minYear) {
      res.status(400);
      res.send(`start year cannot be lesser than ${minYear}`);
    } else if (startYear > maxYear) {
      res.status(400);
      res.send(`start year cannot be greater than ${maxYear}`);
    } else if (startWeek > maxWeek || endWeek > maxWeek) {
      res.status(400);
      res.send('week cannot be greater than 53');
    } else if (endYear === currentYear && endWeek > currentWeekNumber) {
      res.status(400);
      res.send('end week cannot be greater than current week');
    }
    console.log({startYear, endYear, startWeek, endWeek});
    let iYear:number = startYear;
    let iWeek:number = startWeek < 1 ? 1 : startWeek;
    while (iYear <= endYear) {
      if (iWeek <= maxWeek) {
        orList.push({"YearWeekISO": `${iYear}-W${iWeek < 10 ? '0'+ iWeek : iWeek}`});
        if (iYear === endYear && iWeek === endWeek) {
          break;
        }
        iWeek++;
      } else {
        iWeek = minWeek
        iYear++;
      }
    }
    console.log({orList});
    // Vaccination.find({
    //   "$and": [{"ReportingCountry": c}],
    //   "$or": orList,
    // },{"YearWeekISO":1,"NumberDosesReceived": 1, "ReportingCountry": 1, "_id":0}, (err, vaccinations) => {
    // let filter = [ 
    //   {
    //     $match: {
    //       YearWeekISO: {
    //         $gte: '2020-W10',
    //       }
    //     }
    //   }
    // ];
    // Vaccination.find([
    //   { "$match": {
    //     "NumberDosesReceived": { "$gte": '2020-W10', "$lte": '2020-W15' }
    //   }},
    //   { "$group": {
    //     "NumberDosesReceived": { "$gte": '1', "$lte": '100' }
    //   }}
    // ],
    Vaccination.aggregate([
      { "$match": {
        "$and": [{"ReportingCountry": c}],
        "$or": orList,
      }},
      {
        "$group": {"_id": "$YearWeekISO", "totalNumberDosesReceived": {"$sum": 1}}
      },
    ], (err: Error, vaccinations:any)=>{
        if (err) {
            res.send(err);
        }
        console.log(vaccinations.length);
        res.send(vaccinations);
    });
  } else {
    res.status(400);
    res.send('Missing query parameters!');
  }
}

export const vaccinationController = {
  get
};