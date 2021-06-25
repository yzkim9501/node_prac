const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect("mongodb://localhost:27017/voyage", {//요거 쓰면 디비 없으면 생성됨, 있으면 연결함. 밑의 옵션들은 지금 크게 신경쓰지 않아도 될 것 같다. 구글링해도 딱히 중요한 내용은 안나오거나 내가 못찾거나...!
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      ignoreUndefined: true
    })
    .catch(err => console.log(err));
};

mongoose.connection.on("error", err => {
  console.error("몽고디비 연결 에러", err);
});

module.exports = connect;