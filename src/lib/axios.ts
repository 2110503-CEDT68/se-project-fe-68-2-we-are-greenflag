import axios from 'axios';

const api = axios.create({
  // เปลี่ยนเป็น URL ของ Backend ตอน Deploy จริง
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true, // สำคัญมาก! ทำให้ส่ง Cookie/Token ไปหา Backend ได้
});

export default api;