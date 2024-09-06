// import { decode } from "jsonwebtoken";
import {
  checkTokenRef,
  createTokeRef,
  createToken,
  decodeToken,
  verifyToken,
} from "../config/jwt.js";
import { responseSend } from "../config/response.js";
import sequelize from "../models/connect.js";
import initModels from "../models/init-models.js";

import bcrypt from "bcrypt";
let model = initModels(sequelize);
const signUp = async (req, res) => {
  let { email, password, fullName } = req.body;

  //Check email
  //Email tồn tại => 403

  //Email không tồn tại
  //Thư viện giải mã password yarn add bcrypt
  let newUser = {
    email,
    pass_word: bcrypt.hashSync(password, 10), //mã hoá password => hash password: mã hoá 1 chiều
    full_name: fullName,
    avatar: "",
    face_app_id: "",
    role: "USER",
    refresh_token: "",
  };

  await model.users.create(newUser);
  responseSend(res, "", "Thành công !", 200);
  //moder.user.create(model)
  //thành công trả về 200
};

const generateRandomString = () => {
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var randomString = "";
  for (var i = 0; i < 6; i++) {
    var randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
};

const login = async (req, res) => {
  let { email, password } = req.body;

  let checkUser = await model.users.findOne({
    where: {
      email,
    },
  });

  if (checkUser) {
    let key = generateRandomString(); // ABC123
    if (bcrypt.compareSync(password, checkUser.pass_word)) {
      let token = createToken({ userId: checkUser.dataValues.user_id, key });

      //refresh token
      let tokenRef = createTokeRef({
        userId: checkUser.dataValues.user_id,
        key,
      });

      //update lại table user
      checkUser.refresh_token = tokenRef;

      model.users.update(checkUser.dataValues, {
        where: {
          user_id: checkUser.dataValues.user_id,
        },
      }); //UPDATE users SET refresh_token = tokenRef WHERE user_id =
      //login thành công
      responseSend(res, token, "Thành công !", 200);
    } else {
      responseSend(res, "", "Sai mật khẩu !", 200);
    }
  } else {
    // sai mật khẩu hoặc email
    responseSend(res, "", "Sai mật khẩu hoặc email", 403);
  }
};

const loginFacebook = async (req, res) => {
  let { face_app_id, name, email } = req.body;

  // check id
  let checkUser = await model.users.findOne({
    where: {
      face_app_id,
    },
  });

  if (!checkUser) {
    //sign up
    let newUser = {
      email,
      pass_word: "", //mã hoá password => hash password: mã hoá 1 chiều
      full_name: name,
      avatar: "",
      face_app_id,
      role: "USER",
      refresh_token: "",
    };

    await model.users.create(newUser);

    //Lấy được user_id mới
    checkUser = await model.users.findOne({
      where: {
        face_app_id: id,
      },
    });
  }

  let token = createToken({ userId: checkUser.dataValues.user_id });

  //login thành công
  responseSend(res, token, "Thành công !", 200);
};

const getUser = async (req, res) => {
  let data = await model.users.findAll();
  responseSend(res, data, "Thành công !", 200);
};

const resetToken = async (req, res) => {
  //check lại token
  let { token } = req.headers;
  let errorToken = verifyToken(token);
  if (errorToken != null && errorToken.name != "TokenExpiredError") {
    responseSend(res, "", "Not Authorized", 401);
    return;
  }

  //check lại refresh token (kiểm tra còn hạn không)
  let { data } = decodeToken(token);
  let getUser = await model.users.findByPk(data.userId);
  let tokenRef = decodeToken(getUser.dataValues.refresh_token);

  if (data.key != tokenRef.data.key) {
    responseSend(res, "", "Not Authorized", 401);
    return;
  }

  if (checkTokenRef(getUser.dataValues.refresh_token) != null) {
    responseSend(res, "", "Not Authorized", 401);
    return;
  }

  //Create token mới
  let tokenNew = createToken({
    userId: getUser.dataValues.user_id,
    key: tokenRef.data.key,
  });
  responseSend(res, tokenNew, "", 200);
};

export { signUp, login, loginFacebook, getUser, resetToken };
