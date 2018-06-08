import Mock from "mockjs";

Mock.setup({
  timeout: "200-600"
});
Mock.Random.now();

export const building = Mock.mock(
  "http://122.115.50.65/cms/buildingInfo/listBuildingInfo.json",
  "post",
  {
    code: 0,
    msg: "OK",
    count: 1,
    "data|3": [
      {
        "buildingNo|+1": [1, 2, 3],
        "buildingName|+1": [
          `${Mock.Random.cword(2, 3)}大厦`,
          `${Mock.Random.cword(2, 3)}大楼`,
          `${Mock.Random.cword(2)}SOHO`
        ],
        parkId: 1,
        createDate: "@now()",
        createPerson: 1,
        updateDate: "@now()",
        updatePerson: 1,
        delFlag: 1,
        "constructionArea|10000-99999": 1
      }
    ]
  }
);

export const houseByFloor = Mock.mock(
  "http://122.115.50.65/cms/houseInfo/listHouseInfoByFloor.json",
  "post",
  {
    code: 0,
    msg: "OK",
    count: 1,
    "data|3-10": [
      {
        "floorNo|+1": 1,
        "room|10-50": [
          {
            "houseNo|+1": 1,
            buildingId: 1,
            "floorNumber|1-18": 1,
            "doorNumber|+1": 101,
            "houseType|1": ["0", "1"],
            "buildArea|10-200.2": 1,
            "resourceStatus|1": ["0", "1", "2", "3", "4"]
          }
        ]
      }
    ]
  }
);

// export const house = Mock.mock(
//   "http://122.115.50.65/cms/houseInfo/queryInfoByHouseNo.json",
//   "post",
//   {
//     code: 0,
//     msg: "OK",
//     data: {
//       parkId: 1,
//       "parkNo|+1": [1, 2, 3],
//       "parkName|+1": [
//         `${Mock.Random.cword(2, 3)}科技园`,
//         `${Mock.Random.cword(2, 3)}孵化器`
//       ],
//       buildingId: 1,
//       "buildingNo|+1": [1, 2, 3],
//       "buildingName|+1": [
//         `${Mock.Random.cword(2, 3)}大厦`,
//         `${Mock.Random.cword(2, 3)}大楼`,
//         `${Mock.Random.cword(2)}SOHO`
//       ],
//       "houseNo|+1": 1,
//       "floorNumber|1-18": 1,
//       "doorNumber|+1": 101,
//       "houseType|1": ["0", "1"],
//       "buildArea|10-200.2": 1,
//       "resourceStatus|1": ["0", "1", "2", "3"],
//       orientation: "东南",
//       "usageRate|0.2": "1",
//       "accommodatingNumber|5-50": 1,
//       "decorationSituation|1": ["0", "1", "2", "3"],
//       "isDecoration|1": ["0", "1"],
//       "isOfficeFurniture|1": ["0", "1"],
//       "isRegister|1": ["0", "1"],
//       "isFireProcedure|1": ["0", "1"],
//       "price|5-50": 1,
//       priceUnit: 0,
//       "propertyFee|10-200.2": 1,
//       remark: `${Mock.Random.cparagraph()}`
//     }
//   }
// );
