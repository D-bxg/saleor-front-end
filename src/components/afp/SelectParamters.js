import Button from "@material-ui/core/Button";
import { Row, Space, Drawer } from "antd";
import { AttrContext } from "../widgets/utils";
import { useContext } from "react";
import ADrawer from "./drawer/A";
import DDrawer from "./drawer/D";
import { useState, useEffect } from "react";
const SelectParamters = () => {
  const [A, setA] = useState(false);
  const [D, setD] = useState(false);
  const [M, setM] = useState(false);
  const [E, setE] = useState(false);
  const [T, setT] = useState(false);
  const [P, setP] = useState(false);
  const { setAttrs } = useContext(AttrContext);
  const [AchooseAttr, setAchooseAttr] = useState([]);
  const [DchooseAttr, setDchooseAttr] = useState([]);
  const openDrawer = (type) => {
    switch (type) {
      case "A":
        setA(true);
        break;
      case "D":
        setD(true);
        break;
      case "M":
        setM(true);
        break;
      case "E":
        setE(true);
        break;
      case "T":
        setT(true);
        break;
      case "P":
        setP(true);
        break;
      default:
        break;
    }
  };
  const closeDrawer = (type) => {
    switch (type) {
      case "A":
        setA(false);
        break;
      case "D":
        setD(false);
        break;
      case "M":
        setM(false);
        break;
      case "E":
        setE(false);
        break;
      case "T":
        setT(false);
        break;
      case "P":
        setP(false);
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    let AllChooseAttr = [].concat(AchooseAttr).concat(DchooseAttr);
    console.log(AllChooseAttr);
    setAttrs(AllChooseAttr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [AchooseAttr, DchooseAttr]);
  const handleSelectParamter = (type, checkValue) => {
    switch (type) {
      case "A":
        setAchooseAttr(checkValue);
        break;
      case "D":
        setDchooseAttr(checkValue);
        break;
      default:
        break;
    }
  };
  return (
    <div>
      <Space direction="vertical" size={20} style={{ marginTop: "100px" }}>
        <Row>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            style={{ color:"#fff", width: "300px",backgroundColor:"#0abab5" }}
            onClick={() => {
              openDrawer("A");
            }}
          >
            A (Absorption)
          </Button>
        </Row>
        <Row>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            style={{ color:"#fff", width: "300px",backgroundColor:"#0abab5" }}
            onClick={() => {
              openDrawer("D");
            }}
          >
            D (Distribution)
          </Button>
        </Row>
        <Row>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            style={{ color:"#fff", width: "300px",backgroundColor:"#0abab5" }}
            onClick={() => {
              openDrawer("M");
            }}
          >
            M (Metabolism)
          </Button>
        </Row>
        <Row>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            style={{ color:"#fff", width: "300px",backgroundColor:"#0abab5" }}
            onClick={() => {
              openDrawer("E");
            }}
          >
            E (Elimination)
          </Button>
        </Row>
        <Row>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            style={{ color:"#fff", width: "300px",backgroundColor:"#0abab5" }}
            onClick={() => {
              openDrawer("T");
            }}
          >
            T (Toxicity)
          </Button>
        </Row>
        <Row>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            style={{ color:"#fff", width: "300px",backgroundColor:"#0abab5" }}
            onClick={() => {
              openDrawer("P");
            }}
          >
            Physicochemical Property
          </Button>
        </Row>
      </Space>
      <ADrawer
        closeDrawer={closeDrawer}
        A={A}
        handleSelectParamter={handleSelectParamter}
      />
      <DDrawer
        closeDrawer={closeDrawer}
        D={D}
        handleSelectParamter={handleSelectParamter}
      />
      <Drawer
        title="M (Metabolism)"
        placement="right"
        closable={false}
        onClose={() => {
          closeDrawer("M");
        }}
        visible={M}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
      <Drawer
        title=" E (Elimination)"
        placement="right"
        closable={false}
        onClose={() => {
          closeDrawer("E");
        }}
        visible={E}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
      <Drawer
        title="  T (Toxicity)"
        placement="right"
        closable={false}
        onClose={() => {
          closeDrawer("T");
        }}
        visible={T}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
      <Drawer
        title=" Physicochemical Property"
        placement="right"
        closable={false}
        onClose={() => {
          closeDrawer("P");
        }}
        visible={P}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </div>
  );
};
export default SelectParamters;
