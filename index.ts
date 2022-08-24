import * as express from 'express';
import * as mongoose from 'mongoose';
import * as bodyParser from "body-parser";

const app = express();
const PORT:number =  4000;
const uri:string = "";


mongoose.connect(uri);

// bodyparser setup
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', (req, res) => 
  res.send(`Node and express server running on ${PORT}`)
);

app.listen(PORT, () =>
  console.info('server is up and running on port => ', PORT)
);

