import React, { useEffect, useState } from "react";
import { storage } from "../firebase/configFirebase";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import ReactPlayer from "react-player";

export default function () {
  const [imageUpoad, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  console.log(imageUrls);

  // Tạo một them chiếu đến thư mục chưa kho ảnh trên firebase
  const imageListRef = ref(storage, "images/");

  // Hàm upload được file lên firebase
  const uploadFiles = (files) => {
    // Phải xử lý được tác vụ thêm nhiều file => bất đồng bộ => sử dụng Promise
    Promise.all(
      files.map((file) => {
        // Tạo một tham chiếu <=> tạo folder trên firebase
        const imageRef = ref(storage, `images/${file.name}`);
        return uploadBytes(imageRef, file).then((snapshot) => {
          return getDownloadURL(snapshot.ref);
        });
      })
    ).then((urls) => {
      // Trả về danh sách các urls
      setImageUrls((prev) => [...prev, urls]);
    });
  };

  const handleSelectFiles = (e) => {
    // Lấy tất cả các giá trị trong ô input có type="file"
    const files = Array.from(e.target.files);
    setImageUpload(files);
  };

  // Khi click vào but uploaf thì tiến hành upload lên firebase
  const handleUpload = () => {
    if (!imageUpoad) {
      return;
    } else {
      uploadFiles(imageUpoad);
    }
  };

  // Lấy url trên firebase
  useEffect(() => {
    listAll(imageListRef).then((response) => {
      // response trả về là một mảng danh sách các url
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          // Danh sách url
          setImageUrls((prev) => [...prev, url]);
        });
      });
    });
  }, []);

  return (
    <div>
      <h1>Danh sách hình ảnh</h1>
      <div style={{ display: "flex", gap: 10 }}>
        {imageUrls.map((url) => (
          <ReactPlayer url={url} controls={true} />
          // <img
          //   src={url}
          //   alt="ảnh"
          //   style={{ objectFit: "cover" }}
          //   key={url}
          //   height={200}
          //   width={200}
          // />
        ))}
      </div>
      <input type="file" onChange={handleSelectFiles} multiple />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
