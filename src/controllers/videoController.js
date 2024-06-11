import Video from "../models/video.js"
import initModels from '../models/init-models.js'
import sequelize from "../models/connect.js"
import { responseSend } from "../config/response.js"
let model = initModels(sequelize)

// sequelize.query("SELECT * FROM video")

const getVideo = async (req,res) =>{
    let {videoId} = req.params
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

    let data = await model.video.findAll({
        include: ["type", "user"]
    })
    
    //findOne sẽ trả về {}, còn findAll sẽ trả về [{},{},...]
    // res.send(data)
    responseSend(res,data,'Thành công !',200)
}


const getVideoType = async (req, res) => {
    let data = await model.video_type.findAll()

    // res.send(data)
    responseSend(res,data,'Thành công !',200)
}

const getVideoWithType = async (req, res) => {
    let {typeId} = req.params;

    let data = await model.video.findAll({
        where: {
            type_id: typeId
        }
    })
    // res.send(data)
    responseSend(res,data,'Thành công !',200)
}



const createVideo = (req,res) =>{
    // res.send('Create video')
    responseSend(res,data,'Thành công !',200)
}

const getVideoPage = async (req,res) => {
    let {page} = req.params
    let pageSize = 3
    let index = (page - 1) * pageSize

    //SELECT * FROM video LIMIT index, pageSize

    let data = await model.video.findAll({
        offset: index,
        limit: pageSize
    })

    let listItem =  await model.video.count()
    let listPage = Math.ceil(listItem/pageSize)

    // res.send({data,listPage})
    responseSend(res,{data,listPage},'Thành công !',200)

}

const getVideoById = async (req, res) => {
    let { videoId } = req.params

    let data = await model.video.findByPk(videoId, {
        include: ["user"]
    })

    responseSend(res, data, "Thành công !", 200)
}

export {
    getVideo,
    createVideo,
    getVideoType,
    getVideoWithType,
    getVideoPage,
    getVideoById,
}

