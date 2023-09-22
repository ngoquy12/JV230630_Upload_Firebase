import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAfePsaGQnI9WCGeSrkB6C3eERfob3n7X8",
  authDomain: "upload-image-f4286.firebaseapp.com",
  projectId: "upload-image-f4286",
  storageBucket: "upload-image-f4286.appspot.com",
  messagingSenderId: "96635572182",
  appId: "1:96635572182:web:39bee91231f4f6cfb4de77",
};

// Khởi tạo firebase
const app = initializeApp(firebaseConfig);

// Tạo tham chiếu đến dịch vụ lưu trữ
// được sử dụng để tham chiếu trong toàn bộ ứng dụng
const storage = getStorage(app);

// export ra bên ngoài để sử dụng
export { storage };
