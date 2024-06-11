import express from 'express'
import { getVideoById, getVideo,getVideoType,getVideoWithType ,getVideoPage } from "../controllers/videoController.js";

const videoRouter = express.Router()

// API chức năng
videoRouter.get("/get-video", getVideo)

// API get video-type
videoRouter.get("/get-video-type",getVideoType)

// API get video with type
videoRouter.get("/get-video-with-type/:typeId",getVideoWithType)

//API get video page
videoRouter.get("/get-video-page/:page",getVideoPage)

// API create video
videoRouter.get("/get-video-by-id/:videoId",getVideoById)


export default videoRouter

// yarn sequelize-auto -h localhost -d db_youtube -u root -x 1234 -p 3306 --dialect mysql -o src/model -l esm