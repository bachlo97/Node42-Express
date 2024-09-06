import jwt from "jsonwebtoken";
//Thực hiện 3 công việc
//1. Create token(tạo)
export const createToken = (data) => {
  //nhận vào 3 tham số lần lượt payload,signature,header
  //nếu truyền vào 2 tham số chỉ cho truyền string và object,Buffer(nhị phân)
  //nếu truyền vào 3 tham số, tức là có thêm header chỉ cho truyền object
  // header sẽ nhận vào 1 thuật toán mặc định(không cần khai báo) là HS256, HS256 cho phép truyền vào khoá bí mật và chuỗi
  //thuộc tính expiresIn có ý nghĩa là thời hạn token đc sinh ra (m:minute,d:ngày,y:năm)
  return jwt.sign({ data }, "BI_MAT", { algorithm: "HS256", expiresIn: "3s" });
};

//2. verify token(kiểm tra) - dùng cho chức năng khoá API
export const verifyToken = (token) => {
  //!Bí mật
  //*  Check 3 lỗi
  //*  1/ token không hợp lệ(vd: thiếu chữ,không đúng cấu trúc...)
  //*  2/token hết hạn (thường xảy ra)
  //*  3/token sai khoá bí mật khi kẻ khác hack đc token (thường xảy ra)
  return jwt.verify(token, "BI_MAT", (error) => {
    // Không lỗi là sẽ trả về null
    //Có lỗi là khác null
    return error;
  });
};

//3. decode token(giải mã)
export const decodeToken = (token) => jwt.decode(token);

export const middleToken = (req, res, next) => {
  console.log(1234,req.headers)
  let { token } = req.headers;
  let error = verifyToken(token);
  
  if (error)
    // token không hợp lệ
    res.status(401).send(error.name);
  //nếu token hợp lệ
  else next();
};

//create refresh token
export const createTokeRef = (data) =>{
  return jwt.sign({data},"BI_MAT_REF",{expiresIn:"30d"})
}

//check refresh token
export const checkTokenRef = token => jwt.verify(token,"BI_MAT_REF",error=>error)
