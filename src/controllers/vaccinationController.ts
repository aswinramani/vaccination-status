import { Request, Response } from 'express';
import { VaccinationModel } from "../models/vaccinationModel";
import { ReqQuery } from "../../common/types/reqQuery";
import { InputValidation } from "../../common/types/inputValidation";
import { VaccinationSummary } from "../../common/types/VaccinationSummary";
import { VaccinationResult } from "../../common/types/VaccinationResult";
import { generalUtility } from "../../common/helpers/general";

const summary = (req: Request, res: Response) => {
  let reQuery: ReqQuery = req.query as ReqQuery;
  let result: InputValidation = generalUtility.validate(reQuery);
  let vaccinationSummary: VaccinationSummary = {'summary': []};
  if (!result['valid']) {
    vaccinationSummary['info'] = result['msg'];
    res.status(400).send(vaccinationSummary);
  } else {
    let yearWeekList:Array<string> = generalUtility.prepareYearWeekList(result);
    // console.log(yearWeekList);
    // let range: number = Math.ceil(yearWeekList.length / parseInt(reQuery['range']));
    let range: number = parseInt(reQuery['range']);
    // console.log(range);
    VaccinationModel.aggregate([
      {"$match": {"$and":[{"ReportingCountry": reQuery['c']}, {"YearWeekISO": {"$in": yearWeekList}}]}},
      {"$group": {"_id": "$YearWeekISO", "NumberDosesReceived": {$sum: "$NumberDosesReceived"}}},
      {"$sort": {"_id": 1}},
      {"$addFields": {"YearWeekISO": "$_id"}},
      {"$project":  {"_id": 0}}
    ]
    ,{allowDiskUse: true},(err: Error, vaccinations:VaccinationResult[])=>{
      if (err) {
        res.send(err);
      }
      let end:number = 0;
      for (let i=0;i<vaccinations.length;i++) {
        let yearWeekIdx:number = yearWeekList.indexOf(vaccinations[i]['YearWeekISO']);
        if (yearWeekIdx > -1) {
          end = yearWeekIdx + range;
          vaccinationSummary['summary'].push({
            'weekStart': yearWeekList[yearWeekIdx],
            'weekEnd': yearWeekList[end] || reQuery['dateTo'],
            'NumberDosesReceived': vaccinations.slice(i, i+range).reduce((accumulator:number , vaccination:VaccinationResult):number=>{
                return accumulator+vaccination['NumberDosesReceived'];
              }, 0)
          });
          i=i+range-1;
        }
      }
      // let i:number = 0;
      // let end:number = range;
      // while (i < yearWeekList.length) {
      //   // if (end===yearWeekList.length) {
      //   // }
      //   let subset:VaccinationResult[] = vaccinations.slice(i, end);
      //   // console.log(subset)
      //   if (subset.length && subset[0]['YearWeekISO'] === yearWeekList[i]) {
      //     vaccinationSummary['summary'].push({
      //       'startWeek': yearWeekList[i],
      //       // 'endWeek': end<yearWeekList.length ? yearWeekList[end]: reQuery['dateTo'],
      //       'endWeek': yearWeekList[end] || reQuery['dateTo'],
      //       'NumberDosesReceived': subset.reduce((accumulator:number , vaccination:VaccinationResult):number=>{
      //           return accumulator+vaccination['NumberDosesReceived'];
      //         }, 0)
      //     });
      //     i=end;
      //     end+=range;
      //   }
      // }
      // console.log(vaccinationSummary);
      res.send(vaccinationSummary);
    });
  }
}

export const vaccinationController = {
  summary
};

/**
 *
db.vaccinations.aggregate([
    {"$match": {"$and":[{"ReportingCountry": 'AT'}, {"YearWeekISO": {"$in": ['2021-W10', '2021-W11','2021-W12', '2021-W13','2021-W14', '2021-W15','2021-W16', '2021-W17','2021-W18', '2021-W19','2021-W20', '2021-W21', '2021-W22', '2021-W23']}}]}},
    {"$group": {"_id": {YearWeekISO: "$YearWeekISO", NumberDosesReceived: {"$sum": "$NumberDosesReceived"}}}},
    {$project:  {_id: 0, summary: "$_id"}}
])
db.vaccinations.aggregate([
    {$bucket: {groupBy: "$YearWeekISO", boundaries: ['2020-W49', '2020-W50', '2020-W51', '2020-W52', '2020-W53', '2021-W01'], default: "Other", output: {NumberDosesReceived: {$sum: "$NumberDosesReceived"}}}},
])
db.vaccinations.aggregate([
    {$bucketAuto: {groupBy: "$YearWeekISO", buckets: 5, output: {count: {$sum: 1}}}}
])
 *
 */
