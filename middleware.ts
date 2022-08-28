import rateLimit from 'express-rate-limit';
import ErrorCodes  from "./common/helpers/errorCodes";

const middleware = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: ErrorCodes['RateLimiter']['messages']['text'], 
    standardHeaders: true,
    legacyHeaders: false,
});

export default middleware;
 