import {Request, Response} from 'express';

const get = (req: Request, res: Response) => {
    const {c, dateFrom, dateTo, range} = req.query;
    res.send(`process data for these => req query params ${c} ${dateFrom} ${dateTo} ${range}`);
}

export const vaccinationController = {
    get
};