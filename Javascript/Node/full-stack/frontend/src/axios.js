import axios from 'axios'

// 使用 axios 並指定與架在後端的 port 5000 溝通
const instance = axios.create
                 ({ baseURL: 'http://localhost:5000' });

// 與後端溝通需用到非同步的寫法
const clickToGet = async () => {
  const { data } = await instance.get('/');
  return data;
}

export { clickToGet }
