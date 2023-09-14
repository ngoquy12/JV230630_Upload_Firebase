import { useState } from "react";
import "./register.css";
import { Button, Input, Radio, Upload, message } from "antd";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/configFirebase";
import { CloseOutlined, UploadOutlined } from "@ant-design/icons";
import axios from "axios";

export default function Register() {
  const [gender, setGender] = useState(1);
  const [imageUpoad, setImageUpload] = useState(null);
  const [users, setUsers] = useState({
    userName: "",
    dateOfBirth: "",
    email: "",
    password: "",
  });

  const onChecked = (e) => {
    console.log("radio checked", e.target.value);
    setGender(e.target.value);
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    setUsers({
      ...users,
      [name]: value,
    });
  };

  // Tạo một tham chiếu đến thư mục chứa ảnh trên Firebase
  const imageListRef = ref(storage, "images/");

  const props = {
    name: "file",
    onChange(info) {
      if (info.file.status === "done") {
        // Lấy đường dẫn của ảnh sau khi tải lên thành công
        const downloadURL = info.file.response.url;

        // Lưu đường dẫn vào state imageUpload
        setImageUpload(downloadURL);

        message.success("Tải ảnh lên thành công.");
      } else if (info.file.status === "error") {
        message.error("Tải ảnh lên thất bại.");
      }
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        // Tạo một tham chiếu đến ảnh trên Firebase Storage
        const imageRef = ref(imageListRef, file.name);

        // Tải ảnh lên Firebase Storage
        await uploadBytes(imageRef, file);

        // Lấy URL của ảnh sau khi tải lên thành công
        const downloadURL = await getDownloadURL(imageRef);

        // Gọi hàm onSuccess với URL để thông báo cho Upload thành công
        onSuccess({ url: downloadURL });
      } catch (error) {
        // Gọi hàm onError để thông báo Upload thất bại
        onError(error);
      }
    },
    progress: {
      strokeColor: {
        "0%...": "#108ee9",
        "...100%": "#87d068",
      },
      size: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      userName: users.userName,
      gender: gender,
      dateOfBirth: users.dateOfBirth,
      image: imageUpoad,
      email: users.email,
      password: users.password,
    };
    axios
      .post("http://localhost:3000/users", newUser)
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="bg-rgba-black fixed left-0 top-0 right-0 bottom-0 flex items-center justify-center">
        <form className="bg-white w-1/3 p-6 rounded" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between py-3">
            <h3 className="font-semibold text-xl">Thêm mới tài khoản</h3>
            <CloseOutlined className="cursor-pointer hover:bg-slate-200 p-2 rounded-full" />
          </div>
          <div className="mb-3">
            <label className="font-semibold" htmlFor="name">
              Tên
            </label>
            <Input
              onChange={handleChange}
              name="userName"
              className="mt-2"
              placeholder="Nhập họ và tên"
              id="name"
            />
          </div>
          <div className="mb-3">
            <label className="font-semibold" htmlFor="name">
              Ngày sinh
            </label>
            <Input
              onChange={handleChange}
              name="dateOfBirth"
              className="mt-2"
              id="name"
              type="date"
            />
          </div>
          <div className="mb-3">
            <label className="font-semibold" htmlFor="name">
              Giới tính
            </label>
            <div className="mt-2 mb-3">
              <Radio.Group onChange={onChecked} value={gender}>
                <Radio value={1}>Nam</Radio>
                <Radio value={2}>Nữ</Radio>
                <Radio value={3}>Khác</Radio>
              </Radio.Group>
            </div>
            <div className="mb-3">
              <label className="font-semibold" htmlFor="name">
                Hình ảnh
              </label>
              <div className="text-center mt-2">
                <Upload {...props}>
                  <Button icon={<UploadOutlined />}>Upload hình ảnh</Button>
                </Upload>
              </div>
            </div>
            <div className="mb-3">
              <label className="font-semibold" htmlFor="email">
                Email
              </label>
              <Input
                onChange={handleChange}
                name="email"
                placeholder="Nhập địa chỉ email"
                className="mt-2"
                id="email"
                type="email"
              />
            </div>
            <div className="mb-3">
              <label className="font-semibold" htmlFor="password">
                Mật khẩu
              </label>
              <Input
                onChange={handleChange}
                name="password"
                placeholder="Nhập mật khẩu"
                className="mt-2"
                id="password"
                type="password"
              />
            </div>
            <div className="mt-4">
              <Button
                htmlType="submit"
                className="btn-primary w-full"
                type="primary"
              >
                Đăng ký
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
