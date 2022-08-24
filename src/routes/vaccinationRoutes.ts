import { vaccinationController } from "../controllers/vaccinationController";
import {Request, Response, NextFunction} from 'express';

const routes = (app:any) => {
    app.route('/vaccine-summary')
    .get((req: Request, res: Response, next:NextFunction) => {
        // middleware
        console.info('in middleware', req['method']);
        next();
    }, vaccinationController.get);
    
}

export default routes;
