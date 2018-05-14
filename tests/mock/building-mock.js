import Mock from "mockjs";

Mock.setup({
  timeout: "200-600"
});
Mock.Random.now();

export const building = Mock.mock(
  "http://122.115.50.65/cms/buildingInfo/list.json",
  "post",
  {
    code: 0,
    msg: "OK",
    count: 1,
    "data|3": [
      {
        "buildingId|+1": [1, 2, 3],
        "buildingName|+1": [
          `${Mock.Random.cword(2, 3)}大厦`,
          `${Mock.Random.cword(2, 3)}大楼`,
          `${Mock.Random.cword(2)}SOHO`
        ],
        "buildingNumber|6-18": 1,
        "roomNumber|1-100": 1,
        parkId: null,
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
  "http://122.115.50.65/cms/houseInfo/listByFloor.json",
  "post",
  {
    code: 0,
    msg: "OK",
    count: 1,
    "data|1-10": [
      {
        "houseId|+1": 1,
        buildingId: 1,
        "floorNumber|1-18": 1,
        "doorNumber|+1": 101,
        "houseType|1": ["0", "1"],
        "buildArea|10-200.2": 1,
        "resourceStatus|1": ["0", "1", "2", "3"]
      }
    ]
  }
);
