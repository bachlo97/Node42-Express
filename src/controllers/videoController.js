import Video from "../models/video.js";
import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import { responseSend } from "../config/response.js";
import { PrismaClient } from "@prisma/client";
import { where } from "sequelize";
import { decodeToken } from "../config/jwt.js";
let model = initModels(sequelize);
let modelPrisma = new PrismaClient();
// sequelize.query("SELECT * FROM video")

const getVideo = async (req, res) => {
  let { videoId } = req.params;

  //? dùng sequelize
  // let data = await Video.findAll()  // Tương đương với SELECT * FROM video
  // let data = await model.video.findAll()

  //* cách 1
  // let data = await model.video.findOne({
  //     where:{
  //         video_id: 2,  //Tương đương với SELECT * FROM video WHERE video_id = 2
  //     }
  // })

  //*Cách 2: tìm kiếm theo khoá chính
  // let data2 = await model.video.findByPk(2)

  //video JOIN video_type
  //video JOIN user
  // let data = await model.video.findAll({
  //     include: ["type","user"],
  //     where:{
  //         video_id : videoId,
  //     }
  // })

  //findOne sẽ trả về {}, còn findAll sẽ trả về [{},{},...]
  // let data = await model.video.findAll({
  //     include: ["type", "user"]
  // })

  //? dùng prisma
  let data = await modelPrisma.video.findMany({
    include: {
      // video_type:true,
      // users:true,
      video_comment: {
        include: {
          users: true,
        },
      },
    },
  });

  //* dùng sequelize
  // model.video.create(newData)
  // model.video.update(newData,where)
  // model.video.destroy({where})

  //* dùng prisma
  // modelPrisma.video.create({data:newData})
  // modelPrisma.video.update({data:newData,where})
  // modelPrisma.video.delete({where})

  responseSend(res, data, "Thành công !", 200);
};

const getVideoType = async (req, res) => {
  let data = await model.video_type.findAll();

  // res.send(data)
  responseSend(res, data, "Thành công !", 200);
};

const getVideoWithType = async (req, res) => {
  let { typeId } = req.params;

  let data = await model.video.findAll({
    where: {
      type_id: typeId,
    },
  });
  // res.send(data)
  responseSend(res, data, "Thành công !", 200);
};

const createVideo = (req, res) => {
  // res.send('Create video')
  responseSend(res, data, "Thành công !", 200);
};

const getVideoPage = async (req, res) => {
  let { page } = req.params;
  let pageSize = 3;
  let index = (page - 1) * pageSize;

  //SELECT * FROM video LIMIT index, pageSize

  let data = await model.video.findAll({
    offset: index,
    limit: pageSize,
  });

  let listItem = await model.video.count();
  let listPage = Math.ceil(listItem / pageSize);

  // res.send({data,listPage})
  responseSend(res, { data, listPage }, "Thành công !", 200);
};

const getVideoById = async (req, res) => {
  let { videoId } = req.params;

  let data = await model.video.findByPk(videoId, {
    include: ["user"],
  });

  responseSend(res, data, "Thành công !", 200);
};

const getComment = async (req, res) => {
  let { videoId } = req.params;
  let data = await model.video_comment.findAll({
    where: {
      video_id: videoId,
    },
    include: ["user", "video"],
    order: [['date_create','DESC']]
  });
  console.log({data})
  responseSend(res, data, "Thành công !", 200);
};

const createComment = async (req,res) => {
    let {videoId,content} = req.body
    let {token} = req.headers
    let {data} = decodeToken(token)

    //Liên quan đến datetime thì phải lấy datetime từ backend
    let dateComment = new Date()

    let newData= {
        user_id: data.userId,
        video_id: videoId,
        content,
        date_create: dateComment
    }

    await model.video_comment.create(newData)
    responseSend(res,"","Bình luận thành công",200)
}
export {
  getVideo,
  createVideo,
  getVideoType,
  getVideoWithType,
  getVideoPage,
  getVideoById,
  getComment,
  createComment,
};
