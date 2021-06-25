const express = require('express')
const app = express()
const port = 3000

const connect=require('./schemas');
connect()
const userRouter = require('./routes/user');
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(express.static('public'))

const goodsRouter = require("./routers/goods");
app.use("/api", [goodsRouter]);
app.use('/user',userRouter)

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use((req, res, next) => {
  console.log(req);
  next();
});

app.get('/test', (req, res) => {
  let name = req.query.name;
  res.render('test', {name});
})
app.get('/', (req, res, next) => {
  res.send('Welcome Home');
});
app.get('/home', (req, res)=>{
  res.render('index');
});
app.get('/cart', (req, res)=>{
  res.render('cart');
});
app.get('/detail', (req, res)=>{
  let id = req.query.goodsId;
  res.render('detail',{id});
});
app.get('/order', (req, res)=>{
  res.render('order');
});
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})