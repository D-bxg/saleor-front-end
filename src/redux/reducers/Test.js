const initState = {
  name: "aaa",
  age: 16,
};
export default function Test(preState = initState, action) {
  const { type, data } = action;
  // 根据type决定如何处理data
  switch (type) {
    case "type_one":
      return console.log(data);
    case "type_two":
      return;
    default:
      // 【初始化】
      return preState;
  }
}
