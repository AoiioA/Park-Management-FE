const http = require("http");

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
  res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.setHeader("X-Powered-By", "3.2.1");
  res.setHeader("Content-Type", "application/json;charset=utf-8");
  // res.end("Hello World\n");
  res.end(
    JSON.stringify({
      code: 0,
      msg: "OK",
      count: 1,
      data: [
        {
          parkId: 1,
          parkName: "一傻子",
          province: "一傻子省",
          city: "一傻子市",
          district: "一傻子区",
          address: "一傻子街111号",
          acreage: 11111,
          environment: "傻气足足",
          buildingNumber: 11,
          createDate: "2018-05-03 17:35:14",
          createPerson: "一傻子",
          updateDate: "2018-05-03 17:35:28",
          updatePerson: "一傻子"
        },
        {
          parkId: 2,
          parkName: "二傻子",
          province: "二傻子省",
          city: "二傻子市",
          district: "二傻子区",
          address: "二傻子街222号",
          acreage: 22222,
          environment: "傻气足足",
          buildingNumber: 22,
          createDate: "2018-05-03 17:35:14",
          createPerson: "二傻子",
          updateDate: "2018-05-03 17:35:28",
          updatePerson: "二傻子"
        },
        {
          parkId: 3,
          parkName: "三傻子",
          province: "三傻子省",
          city: "三傻子市",
          district: "三傻子区",
          address: "三傻子街333号",
          acreage: 33333,
          environment: "傻气足足",
          buildingNumber: 33,
          createDate: "2018-05-03 17:35:14",
          createPerson: "三傻子",
          updateDate: "2018-05-03 17:35:28",
          updatePerson: "三傻子"
        }
      ]
    })
  );
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
