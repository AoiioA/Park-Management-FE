import Mock from "mockjs";

Mock.setup({
  timeout: "200-600"
});
Mock.Random.now();

export const building = Mock.mock(
  "http://122.115.50.65/cms/assetsInfo/building.json",
  "post",
  {
    code: 0,
    msg: "OK",
    "data|10": [
      {
        "parkId|+1": [1, 2, 3],
        "parkName|+1": [
          `${Mock.Random.cword(2, 3)}科技园`,
          `${Mock.Random.cword(2, 3)}孵化器`
        ],
        "buildingId|+1": 1,
        "buildingName|+1": [
          `${Mock.Random.cword(2, 3)}大厦`,
          `${Mock.Random.cword(2, 3)}大楼`
        ]
      }
    ]
  }
);

export const house = Mock.mock(
  "http://122.115.50.65/cms/assetsInfo/house.json",
  "post",
  {
    code: 0,
    msg: "OK",
    "data|10": [
      {
        "buildingName|+1": [
          `${Mock.Random.cword(2, 3)}大厦`,
          `${Mock.Random.cword(2, 3)}大楼`
        ],
        "houseId|+1": 1,
        "floorNumber|+1": [1, 2, 3, 4, 5, 6],
        "doorNumber|+1": 101,
        "buildArea|10-200.2": 1,
        "price|100-1000": 1,
        "increaseRate|+1": [1, 2, 3, 4, 5, 6],
        "houseType|1": ["0", "1"],
        "earlyDate|1": Mock.mock("@now()")
      }
    ]
  }
);
