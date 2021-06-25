const express = require("express");
const router = express.Router();//라우터라고 선언한다.


/////여기는 상품에 대한 부분임
const Goods = require("../schemas/Goods");//굿즈 테이블 스키마를 가져와라

router.get("/goods", async (req, res, next) => {
  try {
    const { category } = req.query;//카테고리를 query string으로 받아온다
    const goods = await Goods.find({ category }).sort("-goodsId");//검색할 카테고리를 포함한 goods를 goodsId순으로 역정렬(마이너스)
    res.json({ goods: goods });//결과를 json에 담는다
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/goods/:goodsId", async (req, res) => {
  const { goodsId } = req.params;//goodsId를 goods/10 의 형태로 받아온다.
  goods = await Goods.findOne({ goodsId: goodsId });//goodsId로 goods 테이블에서 찾아온다
  res.json({ detail: goods });//결과를 json에 담는다
});
router.post('/goods', async (req, res) => {
  console.log(req.body)//저장할 아이템들을 body로 받아오므로, body를 한번 찍어봤다.
  const { goodsId, name, thumbnailUrl, category, price } = req.body;//받은 body를 변수로 하나씩 넣어준다.

  isExist = await Goods.find({ goodsId });//goodsId가 goods테이블에 있는지 검색해본다.
  if (isExist.length == 0) {//검색해온게 없으면
    await Goods.create({ goodsId, name, thumbnailUrl, category, price });//만들어서 집어넣는다.
  }//검색해 온게 있을 경우, 집어넣지 않는데 이에 대한 예외처리가 되어있지 않으므로 주의 필요.
  res.send({ result: "success" });//잘했다고 칭찬해준다.
});

/////여기는 장바구니에 관한 내용임
const Cart = require("../schemas/cart");//카트 테이블 스키마를 가져와라

router.post("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;//goodsId는 URL에서 받는다.
  console.log(req.body)//body가 어떻게 들어오는지 궁금하니까 한번 찍어본다.
  const { quantity } = req.body;//quantity, 양은 body에서 가져온다.

  isCart = await Cart.find({ goodsId });//카트에서 goodsId를 가진걸 찾아온다.
  console.log(isCart, quantity);//확인작업은 중요하다.
  if (isCart.length) {//카트에 들어있는게 있으면 true를 리턴하는 if문이다.
    await Cart.updateOne({ goodsId }, { $set: { quantity } });//그러면 양만 업데이트한다.
  } else {//없으면 하나 만든다.
    await Cart.create({ goodsId: goodsId, quantity: quantity });
  }
  res.send({ result: "success" });//잘했다고 칭찬해준다.
});

router.delete("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;//goodsId는 URL에서 받는다.

  const isGoodsInCart = await Cart.find({ goodsId });//카트에서 goodsId를 가진걸 찾아온다.
  if (isGoodsInCart.length > 0) {//카트에 내가 원하는 아이디를 가진게 들어있으면
    await Cart.deleteOne({ goodsId });//하나 지워라
  }//해당 구문은 위의 post처럼, if isGoodsInCart {await Cart.deleteOne({goodsId})}로도 바꿀 수 있을 것 같다.

  res.send({ result: "success" });
});
router.get("/cart", async (req, res) => {//전체 카트 목록을 가져와라
  const cart = await Cart.find({});//조건문 안을 비워서 검색하면 다 가져온다.
  const goodsId = cart.map(cart => cart.goodsId);//map을 이용해서 각 cart의 goodsId를 리스트로 가져온다.

  goodsInCart = await Goods.find()//goods에서 찾아라
    .where("goodsId")//goodsId가
    .in(goodsId);//내가 갖고온 굿즈아이디 리스트 안에 있는것만

  concatCart = cart.map(c => {//맵은 각각 한개씩 꺼내와서 쓰는거라고만 생각하면 조금 이해하기 편하다.
    for (let i = 0; i < goodsInCart.length; i++) {
      if (goodsInCart[i].goodsId == c.goodsId) {//만약에 내가 찾아온 굿즈아이디가 카트안에있는 아이디랑 같은거면
        return { quantity: c.quantity, goods: goodsInCart[i] };//값을 불러다가 넣어라
      }
    }
  });
  router.patch("/goods/:goodsId/cart", async (req, res) => {//이건 업데이트하는거임
    const { goodsId } = req.params;//위와 같음
    const { quantity } = req.body;
  
    isCart = await Cart.find({ goodsId });
    console.log(isCart, quantity);
    if (isCart.length) {
      await Cart.updateOne({ goodsId }, { $set: { quantity } });//있으면 업데이트해라
    }
  
    res.send({ result: "success" });
  })
  res.json({
    cart: concatCart// 아까 맵에서 꺼내서 업데이트한거 넣어라
  });
});
module.exports = router;//얘 라우터라고 알려주는거임