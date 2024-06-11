//  express

//! Các bước setup
//* 1. yarn init để cài package.json
//là nơi chứa tên và phiên bản của thư viện.Mục đích là để khi chạy project trên máy tính khác không cần phài copy nguyên node_module có dung lượng cao từ nơi khác sang( đơn giản là chỉ cần gõ yarn ínstall là ở máy khác đã tự động cài node_module)

//* 2. Thêm type: 'module' trong package.json
// => để sử dụng được ES module(import,export) mà khôgn cần phải đổi đổi file .js sang .mjs

console.log("haha");
console.log("hihi");
console.log("hoho");

//* 3 : thêm script start trong package.json
// => để chạy file trên terminal

//* 4 yarn add express
// => cài thư viện express js

/////////////////////////////////////////////////////

import express from "express";
const app = express();

//? mở chặn CORS => cài thư việt yarn add cors
import cors from "cors";
app.use(
  cors({
    origin: "*", //Chấp nhận tất cả domain truy cập(default ko cần khai báo)
    // origin: ["http://localhost:3000", 'https:google.com'] // cho phép 2 domain này truy cập đc backend
  })
);

//middleware xử lý trước khi nhận request từ fe thì phải chuyển dữ liệu Fe gửi sang Json
app.use(express.json());

//? Khởi tạo server BE chạy bằng framework Express
app.listen(8080);

//* chỉ sử dụng môi trường Developer trong việc auto restart server
//! yarn add nodemon => chạy chế độ watching => auto restart server khi nhấn ctrl+S (lưu). hiện tại ít người sài nodemon.

//! node v18 trở lên => node --watch index.js

//rest params
//GET: /demo
//endpoint => viết thường cách nhau bởi gạch ngang(ko phân biệt hoa thường). VD: thong-tin-user
//dữ liệu lấy từ query hay params phải là kiểu string
app.get("/demo/:id/:hoTen", (request, response) => {
  //? - nhận từ URL ( nên truyền tối đa 2 biến)
  // query string: localhost:8080/demo?id=1&hoTen=long
  // thường sử dụng để tìm kiếm
  //   let { id, hoTen } = request.query;

  // query params: localhost:8080/demo/1/long
  // thường để chỉnh xoá 1 cái item
  let { id, hoTen } = request.params;

  //? - nhận bằng json
  // body
  let { email, phone, diaChi } = request.body;

  //status code : 100 - 599
  response.status(202).send({
    id,
    hoTen,
    email,
    phone,
    diaChi,
  }); // bất kỳ kiểu data gì trừ number
});

// chuỗi kết nối CSDL: host, username, password, port, dialect
// truy vấn dữ liệu: CRUD table

// yarn add mysql2

import rootRouter from "./routes/rootRouter.js";


// truy vấn table nguoi_dung
// ORM
// localhost:8080/video/get-video
// app.get("video/get-video", (req, res) => {
  // let data = connect.query("SELECT * FROM video", (error, result) => {
  //   res.send(result);
  // }); // [{ma,ten,..},{ma,ten,..},{ma,ten,..},{ma,ten,..}]

  // //! res.send(data); // [], null do bất đồng bộ
// });

app.use(rootRouter)

/* 
    Models: object => Sequelize ORM

    View: chính là front-end
   
    Controllers: xử lý logic, tính toán, truy xuất CSDL,...
    
    Routes: quản lý API, quản lý đối tượng endpoint

*/
