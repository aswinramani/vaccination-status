import * as express from 'express';
import * as mongoose from 'mongoose';
import * as bodyParser from "body-parser";

const app = express();
const PORT:number =  4000;
const uri:string = "mongodb+srv://aswin-ramani:U0fQp5ajwsYpChtp@cluster0.jmxk5tk.mongodb.net/?retryWrites=true&w=majority";


mongoose.connect(uri, (err) => {
    if (err) {
        console.error(err);
    }
    console.info('connected to db');
});

// bodyparser setup
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', (req, res) => 
  res.send(`Node and express server running on ${PORT}`)
);

app.listen(PORT, () =>
  console.info('server is up and running on port => ', PORT)
);

