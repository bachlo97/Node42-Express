import express from "express";
import {
  getVideoById,
  getVideo,
  getVideoType,
  getVideoWithType,
  getVideoPage,
  getComment,
  createComment,
} from "../controllers/videoController.js";
import { middleToken } from "../config/jwt.js";
//File system
import fs from "fs"
import { upload } from "../config/upload.js";

const videoRouter = express.Router();

// API chức năng
videoRouter.get("/get-video", middleToken, getVideo);

// API get video-type
videoRouter.get("/get-video-type", getVideoType);

// API get video with type
videoRouter.get("/get-video-with-type/:typeId", getVideoWithType);

//API get video page
videoRouter.get("/get-video-page/:page", middleToken, getVideoPage);

// API create video
videoRouter.get("/get-video-by-id/:videoId", getVideoById);

// API get comment
videoRouter.get("/get-comment/:videoId",getComment)

// API create comment
videoRouter.post("/comment",createComment)

videoRouter.post("/upload", upload.single("hinhAnh"), (req, res) => {
  let { file } = req;
  res.send(file);
});



export default videoRouter;


import compress_images from 'compress-images'
videoRouter.post("/demo-upload",upload.single("upload"),(req,res)=>{
  // tạo file data.txt vs nội dung "hello world"
  // fs.writeFile(process.cwd()+"/data.txt","hello world",(err)=>{

  // })
  // let error = fs.writeFileSync(process.cwd()+"/data.txt","hello world")

  //tạo hình base64
  // let {file} = req
  // fs.readFile(process.cwd() + "/public/img/" + file.filename,(error,data)=>{
  //   let base64 = Buffer.from(data).toString("base64")
  //   let image = `data:${file.mimetype};base64,${base64}`


  //   res.send(image)
  // })

  //!Giảm dung lượng hình ảnh
  let { file } = req;
  // tối ưu hình
  // image > 700KB mới nên tối ưu hình
  compress_images(
      process.cwd() + "/public/img/" + file.filename,
      process.cwd() + "/public/img_com/",
      { compress_force: false, statistic: true, autoupdate: true }, false,
      { jpg: { engine: "mozjpeg", command: ["-quality", "15"] } },
      { png: { engine: "pngquant", command: ["--quality=10-30", "-o"] } },
      { svg: { engine: "svgo", command: "--multipass" } },
      { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
      function (error, completed, statistic) {
          // xóa hình chưa tối ưu
      }
  );
})

// yarn sequelize-auto -h localhost -d db_pinterest -u root -x 1234 -p 3306 --dialect mysql -o src/model -l esm
