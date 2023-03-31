import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.json({ type: "text/*" }));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.post("/authenticate", (req, res) => {
  console.log(req.body)

  const data = JSON.stringify(req.body)
  // var myHeaders = new Headers();
  // myHeaders.append("Content-Type", "application/json");
  // myHeaders.append("Accept","application/json")
  // Request to exchange code for an access token
  fetch(`https://github.com/login/oauth/access_token`, {
    method: "POST",
    headers: {
      'Content-Type':"application/json",
      Accept:"application/json"
    },
    body: data,
  })
    .then((response) => response.text())
    .then((response) => {
      return res.status(200).json(response);
    })
    .catch((error) => {
      return res.status(400).json(error);
    });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});