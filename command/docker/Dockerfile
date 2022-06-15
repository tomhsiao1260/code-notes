FROM node:13-alpine

ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PWD=password

# create a path in container
RUN mkdir -p /home/app

# copy ./app script to the container
COPY ./app /home/app

# set default dir so that next commands executes in /home/app dir
WORKDIR /home/app

# will execute npm install in /home/app because of WORKDIR
RUN npm install

# no need for /home/app/server.js because of WORKDIR
CMD ["node", "server.js"]


# FROM 是指這個 image 基於哪個 image (上面表示安裝 node 環境)
# ENV 設定還性變數 (登入資訊不建議寫在這，寫在 DB 的 .yaml 內較好改)
# RUN 是在 container 內執行的 Linux 終端指令
# COPY 將本地端的某資料夾下的 script 複製到 container 內 (會在 Host 端執行)
# CMD 表示在指定的 entry point 執行 script

# 每個 image 其實都是由一系列的 Dockerfile 依賴關係疊出來的
# 關係圖： app:1.0 -> node:13-alpine -> airpline:3.10