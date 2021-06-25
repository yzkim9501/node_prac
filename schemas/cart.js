const mongoose=require("mongoose");
//cart
const {Schema}=mongoose;
const cartSchema = new Schema({
  goodsId:{
    type:Number,
    required:true,
    unique:true
  },
  quantity:{
    type:Number,
    required:true
  }
});

module.exports=mongoose.model("Cart",cartSchema);//Cart라는 이름으로 schema를 생성해서 밖에서도 가져갈 수 있도록 표기해주는 것.