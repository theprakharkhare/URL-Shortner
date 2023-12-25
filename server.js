const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express();
const dotenv = require('dotenv');


dotenv.config();

const mongourl = process.env.MONGO_URL;

// console.log("this is url  - - >" , mongourl);

const connectDB = async ()=>{

  try {
    const conn = await mongoose.connect(process.env.MONGO_URL , {
      useNewUrlParser: true, useUnifiedTopology: true
    });
    console.log(`MOngoDB connected Successfully ${conn.connection.host}`);
    

    
  } catch (error) {
    console.log("Error while connecting mongoDB-->" , error);
  }


}

connectDB();




// mongoose.connect(mongourl , {
//   useNewUrlParser: true, useUnifiedTopology: true
// })

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl?.find()
  res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl })

  res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})

const port =  5000;

app.listen(port, () => {
  console.log(`Server is running on ${port}`)


});