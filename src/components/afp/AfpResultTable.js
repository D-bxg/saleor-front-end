import { Table } from "antd";
const properties = {
  "A (Absorption)": [
    "Human Intestinal Absorption",
    "Caco-2 Permeability",
    "Caco-2 Permeability II",
    "P-glycoprotein Inhibitor I",
    "P-glycoprotein Inhibitor II",
    "P-glycoprotein Substrate",
  ],
  "D (Distribution)": ["Blood-Brain Barrier"],
  "M (Metabolism)": [
    "CYP450 1A2 Inhibitor",
    "CYP450 2C19 Inhibitor",
    "CYP450 2C9 Inhibitor",
    "CYP450 2C9 Substrate",
    "CYP450 2D6 Inhibitor",
    "CYP450 2D6 Substrate",
    "CYP450 3A4 Inhibitor",
    "CYP450 3A4 Substrate",
    "CYP Inhibitory Promiscuity",
    "Biodegradation",
  ],
  "E (Elimination)": ["Renal Organic Cation Transporter"],
  "T (Toxicity)": [
    "AMES Toxicity",
    "Carcinogens",
    "Human Ether-a-go-go-Related Gene Inhibition I",
    "Human Ether-a-go-go-Related Gene Inhibition II",
    "Honey Bee Toxicity",
    "Tetrahymena Pyriformis Toxicity",
    "Tetrahymena Pyriformis Toxicity II",
    "Fish Toxicity",
    "Fish Toxicity II",
  ],
  "Physicochemical Property": ["Aqueous solubility"],
};
const AfpResultTable = (props = {}) => {
  const getresult = (result) => {
    if (result !== "" && result !== null) {
      let reg = /\\/g;
      //使用replace方法将全部匹配正则表达式的转义符替换为空
      result = result.replace(reg, "");
      result = JSON.parse(result);
      console.log(result);
    }
    const data = [];
    let smile = "";
    for (let key in result) {
      smile = key;
      for (let prop in result[key]) {
        let obj = {};
        for (let type in properties) {
          if (properties[type].includes(prop)) {
            obj.properties_type = type;
            break;
          }
        }
        obj.properties = prop;
        let string = "";
        for (let prop_prop in result[key][prop]) {
          string =
            string + prop_prop + ":" + result[key][prop][prop_prop] + " ";
        }
        obj.compound = string;
        obj.key = prop;
        data.push(obj);
      }
    }
    return [smile, data];
  };
  const json = props.json;
  const [smile, data] = getresult(json);
  const columns = [
    {
      title: "",
      key: "properties_type",
      width: 100,
      col: 2,
      fixed: "left",
      dataIndex: "properties_type",
      render(_, row) {
        return {
          children: row.properties_type,
          props: {
            rowSpan: row.rowSpan,
          },
        };
      },
    },
    {
      title: "Properties",
      key: "Properties",
      width: 100,
      fixed: "left",
      dataIndex: "properties",
    },
    {
      title: "Details of the models",
      key: "details",
      width: 100,
      fixed: "left",
    },
    {
      title: "Compound",
      key: "Compound",
      children: [
        {
          title: "SMILES:" + smile,
          key: "details",
          width: 100,
          fixed: "left",
          dataIndex: "compound",
        },
      ],
    },
  ];
  const createNewArr = (data) => {
    return data
      .reduce((result1, item) => {
        if (result1.indexOf(item.properties_type) < 0) {
          result1.push(item.properties_type);
        }
        return result1;
      }, [])
      .reduce((result1, properties_type) => {
        const children = data.filter(
          (item) => item.properties_type === properties_type
        );
        result1 = result1.concat(
          children.map((item, index) => ({
            ...item,
            rowSpan: index === 0 ? children.length : 0,
          }))
        );
        return result1;
      }, []);
  };
  return (
    <div>
      <br />
      <Table
        columns={columns}
        dataSource={createNewArr(data)}
        pagination={false}
        bordered
      />
    </div>
  );
};
export default AfpResultTable;
