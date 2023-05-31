const express = require("express");
const cors = require("cors");
const fs = require("fs");
const https = require("https");
const models = require("./models");
const {
  Sequelize: { Op },
} = require("./models");
const { QueryTypes } = require("sequelize");
const app = express();
const port = 8080;
const option = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
  //경로는 본인꺼에 맞게 설정합시다.
  passphrase: "qkrrjsgnl1!",
  agent: false,
};
app.use(express.json());
app.use(cors());

app.post("/edit", (req, res) => {
  const body = req.body;
  const { title, content, author, at } = body;
  console.log(body);

  models.Edit.create({ title, content, author, at })
    .then((result) => {
      console.log(result);
      res.send(result);
    })
    .catch((err) => {
      res.status(400).send("Error");
    });
});

app.get("/alldocs", (req, res) => {
  const query =
    'SELECT TITLE from Edits WHERE id IN (SELECT MAX(id) FROM Edits GROUP BY title) AND NOT content="" ORDER BY at DESC';

  models.sequelize
    .query(query, { type: QueryTypes.SELECT })
    .then((result) => {
      console.log(result);
      res.send(result);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send("Error");
    });
});

app.get("/view/:id", (req, res) => {
  const { id } = req.params;
  models.Edit.findOne({
    where: { id },
    order: [["at", "DESC"]],
    attributes: ["id", "title", "content"],
  })
    .then((result) => {
      console.log(result);
      res.send(result);
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("Error");
    });
});

app.get("/history/:title(*)", (req, res) => {
  const { title } = req.params;
  console.log(title);
  models.Edit.findAll({
    where: { title },
    order: [["at", "DESC"]],
    attributes: ["id", "at", "author"],
  })
    .then((result) => {
      console.log(result);
      res.send(result);
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("Error");
    });
});

app.get("/recents", (req, res) => {
  const query =
    'SELECT title,content,at from Edits WHERE id IN (SELECT MAX(id) FROM Edits GROUP BY title) AND NOT content="" ORDER BY at DESC LIMIT 10';

  models.sequelize
    .query(query, { type: QueryTypes.SELECT })
    .then((result) => {
      console.log(result);
      res.send(result);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send("Error");
    });
});

app.get("/w/:title(*)", (req, res) => {
  const { title } = req.params;
  console.log(title);
  models.Edit.findOne({
    where: { title },
    order: [["at", "DESC"]],
    attributes: ["content"],
  })
    .then((result) => {
      console.log(result);
      res.send(result);
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("Error");
    });
});

//app.listen(port, () => {});
https.createServer(option, app).listen(port, () => {
  models.sequelize
    .sync()
    .then(() => {
      console.log("DB 연결 성공");
    })
    .catch((err) => {});
});
