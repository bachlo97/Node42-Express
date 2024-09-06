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

//định vị lại đường load tài nguyên
app.use(express.static(".")); //? url: localhost:8080/public/img/image1.png
// app.use(express.static("./public"))  //? url: localhost:8080/img/image1.png

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

app.use(rootRouter);

/* 
    Models: object => Sequelize ORM

    View: chính là front-end
   
    Controllers: xử lý logic, tính toán, truy xuất CSDL,...
    
    Routes: quản lý API, quản lý đối tượng endpoint

*/

import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

const options = {
  definition: {
    info: {
      title: "api",
      version: "1.0.0",
    },
  },
  apis: ["src/swagger/swagger.js"],
};

const specs = swaggerJsDoc(options);

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(specs));

//? prisma ORM
//* B1: yarn add prisma @prisma/client
//* B2: yarn prisma init => generate tự động cấu trúc prisma
//* B3: update info .env and schema.prisma
//* B4: yarn prisma db pull => Database first (yarn prisma db push =>code first)
//* B5: yarn prisma generate



// graphql

// yarn add graphql express-graphql
// Lưu ý graohql luôn là phương thức post
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

let schema = buildSchema(`

        type User {
            id: ID
            hoTen: String
            email: String
            phone: Int
        }

        type VideoType{
            type_id: ID
            type_name: String
        }

        type Video {
            video_id:      ID             
            video_name:    String        
            thumbnail:     String        
            description:   String       
            views:         Int
            source:        String        
            user_id:       Int
            type_id:       Int

            video_type: VideoType
        }

        type Query {
            getUser: [User]
            
            getVideo( id: Int , name: String ) : [Video]
        }

        type Mutation {
            createUser: String
        }
    
    
`);

//* Quy tắc 1: Tên(thuộc tính) h àm = tên hàm bên schema đã khai báo
//* Quy tắc 2: Khi return phải giống kiểu dữ liệu đã định nghĩa ở schema
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
let resolver = {
  // user : id, hoTen, email, phone
  getUser: () => {
    let modelUser = [
      {
        id: 1,
        hoTen: "a",
        email: "a@gmail.com",
        phone: 113,
      },
      {
        id: 1,
        hoTen: "a",
        email: "a@gmail.com",
        phone: 113,
      },
    ];
    return modelUser;
  },
  getVideo: async (argu) => {
    let id = argu.id;

    // [{id,video_name}]
    return await prisma.video.findMany({
      where: {
        video_id: id,
      },
      include: {
        video_type: true,
      },
    });
  },
  createUser: () => {},
};




app.use(
  "/graphql",
  graphqlHTTP({
    schema, //định nghĩa các đối tượng và tên hàm truy vấn (na ná abstract class)
    rootValue: resolver, // resolver => định nghĩa logic của hàm bên schema
    graphiql: true, // giao diện để thao tác với query Graphql
  })
);

//! Cách front end kết nối axios graqhql
// const axios = require("axios");

// const response = axios({
//     url: "http://localhost:8080",
//     method: 'post',
//     data: {
//         "operationName": "fetchAuthor",
//         "query": `query{ getVideo(id: 7) { video_id video_name     } }`,
//         "variables": {}
//     }
// });



//? socket io
//yarn add socket.io
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer(app);
//đối tượng socket server
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

let number = 0;

// lắng nghe key: connection(Key mặc định của socket io) => khi client kết nối vào server
io.on("connection", (socket) => {
  //? Build chat app
  socket.on("join-room", async(roomId)=>{
    //leave all room
    socket.rooms.forEach(roomId =>socket.leave(roomId))
    socket.join(roomId)
    console.log(socket.rooms)

    //Lấy lịch sử chat
    let listChat = await prisma.chat.findMany({
      where:{
        room_id: roomId
      }
    })
    io.to(roomId).emit("load-chat",listChat)
  })


  socket.on("send-mess",async (data)=>{
    let newChat = {
      user_id: data.userId,
      content:data.txtChat,
      room_id: data.roomId,
      date: new Date()
    }
    await prisma.chat.create({data:newChat})
    io.to(data.roomId).emit("mess-server",data)
  })




  //* Ở đây sẽ xử lý các sự kiện liên quan đến realtime
  console.log(socket.id);
  //? So sánh 2 cách dùng emit
  // socket.emit("client-connect",socket.id)  //? chỉ có client nào gửi thì client đó nhận
  // io.emit("client-connect",socket.id)   //? Gửi data về tất cả client

  //add vào room => room key
  // socket.join("room-1")


  // socket.on("join-room", () => {
  //   socket.join("room-2");
  // });
  // socket.on("fe-click", () => {
  //   io.emit("nu-up", number++);
  // });

  // socket.on("send-mess", (message) => {
  //   io.to("room-2").emit("server-mess", message);
  // });
});

httpServer.listen(8081); //port dành riêng cho realtime