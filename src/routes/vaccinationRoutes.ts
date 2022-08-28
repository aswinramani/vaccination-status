import { vaccinationController } from "../controllers/vaccinationController";
import {Request, Response, NextFunction, Router} from 'express';

const routes = (app:Router) => {
    app.route('/vaccine-summary')
    .get((req: Request, res: Response, next:NextFunction) => {
        // middleware
        // console.info('in middleware', req['method']);
        next();
    }, vaccinationController.summary);
    
}

export default routes;
