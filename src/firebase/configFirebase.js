import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBZ221Tvug9XJPy_rhdOT2tBnutoPt03uA",
  authDomain: "project-module02-2a81e.firebaseapp.com",
  projectId: "project-module02-2a81e",
  storageBucket: "project-module02-2a81e.appspot.com",
  messagingSenderId: "243066658619",
  appId: "1:243066658619:web:e19a0a9f21ee7cd050611e",
};

// Khởi tạo firebase
const app = initializeApp(firebaseConfig);

// Tạo tham chiếu đến dịch vụ lưu trữ
// được sử dụng để tham chiếu trong toàn bộ ứng dụng
const storage = getStorage(app);

// export ra bên ngoài để sử dụng
export { storage };
