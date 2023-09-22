import React, { useState } from "react";
import { CloseOutlined, VerticalAlignBottomOutlined } from "@ant-design/icons";
import { Input, Radio, Button } from "antd";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase/configFirebase";

export default function Signup() {
  const [gender, setGender] = useState(0);
  const [imageURL, setImageURL] = useState(null);
  const [downloadURL, setDownloadURL] = useState(null);

  // Tạo một them chiếu đến thư mục chưa kho ảnh trên firebase
  const imageListRef = ref(storage, "images/");

  const handleCheck = (e) => {
    setGender(e.target.value);
  };

  const handleUpload = async () => {
    if (imageURL !== null) {
      const imageRef = ref(imageListRef, imageURL.name);
      try {
        const snapshot = await uploadBytes(imageRef, imageURL);
        const downloadURL = await getDownloadURL(snapshot.ref);
        setDownloadURL(downloadURL);
      } catch (error) {
        console.error("Lỗi khi tải lên ảnh:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleUpload();

    if (downloadURL === null) {
      // Sử dụng setTimeout để thử lại sau một khoảng thời gian
      setTimeout(async () => {
        const updatedDownloadURL = await getDownloadURL(
          ref(imageListRef, imageURL.name)
        );
        if (updatedDownloadURL !== null) {
          setDownloadURL(updatedDownloadURL);
          console.log("downloadURL123456", updatedDownloadURL);
        }
      }, 1000);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-rgba-black">
        <form className="bg-white p-6 rounded w-1/3" onSubmit={handleSubmit}>
          <h3 className="font-bold text-2xl pb-4 text-center">
            Đăng ý tài khoản
          </h3>
          <div className="mb-3">
            <label htmlFor="name">Họ và tên</label>
            <Input placeholder="Nhập họ và tên" className="mt-2" id="name" />
          </div>
          <div className="mb-3">
            <label htmlFor="name">Ngày sinh</label>
            <Input type="date" className="mt-2" id="name" />
          </div>
          <div className="mb-3">
            <label htmlFor="name">Giới tính</label>
            <div className="mt-2">
              <Radio.Group onChange={handleCheck} value={gender}>
                <Radio value={0}>Nam</Radio>
                <Radio value={1}>Nữ</Radio>
                <Radio value={2}>Khác</Radio>
              </Radio.Group>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="name">Hình ảnh</label>
            <div className="text-center mt-2 relative">
              <input
                onChange={(e) => setImageURL(e.target.files[0])}
                type="file"
                className="hidden"
                accept="*"
                id="file-input"
              />
              <label htmlFor="file-input">
                <span className="cursor-pointer border-2 px-4 py-1 rounded-xl">
                  <VerticalAlignBottomOutlined /> Tải lên
                </span>
              </label>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="name">Email</label>
            <Input
              placeholder="Nhập địa chỉ email"
              className="mt-2"
              id="name"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="name">Mật khẩu</label>
            <Input placeholder="Nhập mật khẩu" className="mt-2" id="name" />
          </div>
          <div>
            <Button
              htmlType="submit"
              type="primary"
              className="w-full btn-primary"
            >
              Đăng ký
            </Button>
          </div>
          <div className="text-center py-2">
            Bạn đã có tài khoản?{" "}
            <a className="text-blue-600" href="">
              Đăng nhập
            </a>
          </div>
        </form>
      </div>
    </>
  );
}
