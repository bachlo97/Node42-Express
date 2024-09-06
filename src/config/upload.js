import multer, { diskStorage } from "multer";
// yarn add multer

// const upload = multer({dest:process.cwd() + "/public/img"})
//? có thể khai báo giá trị dest: "./public/img" nhưng file khai báo có thể nằm trong nhiều cấp thư mục và ở mỗi hệ điều hành có thể sẽ khác => khai báo như vậy sẽ dễ dẫn đến lỗi sai đường dẫn. Giải pháp là dùng đương dẫn gốc process.cwd() đi từ cấp thư mục cao nhất bên ngoài đi vào phù hợp cho mọi hệ điều hành

export const upload = multer({
  storage: diskStorage({
    //* nơi khai báo đường dẫn lưu file
    destination: process.cwd() + "/public/img",

    //* đổi tên file
    filename: (req, file, callback) => {
      //tham số đầu tiên của callback là tham số cho phép ta xem được lỗi, không dùng nên để null

      let date = new Date();
      callback(null, date.getTime() + "_" + file.originalname);
    },
  }),
});