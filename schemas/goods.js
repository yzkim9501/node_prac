const mongoose = require("mongoose");

const { Schema } = mongoose;
const goodsSchema = new Schema({
  goodsId: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  thumbnailUrl: {
    type: String
  },
  category: {
    type: String
  },
  price: {
    type: Number
  }
});

module.exports = mongoose.model("Goods", goodsSchema);//Goods라는 이름으로 schema를 생성해서 밖에서도 가져갈 수 잇도록 표기해주는 것.