const express = require('express')
const app = express()
const PATH = require('path')
const { Rating, seed } = require('./db')

seed()
app.use(express.urlencoded());
app.use(express.json());

app.get('/', (req, res, next) => {
  res.sendFile(PATH.join(__dirname, './index.html'));
});

app.post('/vote', async (req, res, next) => {
  try {
    const newRating =  await Rating.findOne({where: {
      name: 'test'
    }
    })
    newRating.onVote(req.body.vote)
    res.send(newRating)
  } catch (ex) {
    next(ex)
  }
})

app.listen(3000, () => console.log("I am listening"))

