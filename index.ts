import * as express from 'express';
import * as mongoose from 'mongoose';
import * as bodyParser from "body-parser";
import vaccinationRoutes from './src/routes/vaccinationRoutes';

const app = express();
const PORT:number =  4000;
const uri:string = "";

mongoose.connect(uri, (err) => {
  if (err) {
    console.error(err);
  }
});

// bodyparser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// routes
vaccinationRoutes(app);

app.get('/', (req, res) => 
  res.send(`Node and express server running on ${PORT}`)
);

app.listen(PORT, () =>
  console.info('server is up and running on port => ', PORT)
);
