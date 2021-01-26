import Input from "../../../components/widgets/Input";
import UploadFile from "../../../components/widgets/UploadFile";
import Indraw from "../../../components/widgets/Indraw";
import ShowResultPanel from "../../../components/afp/ShowResultPanel";
import SelectParamters from "../../../components/afp/SelectParamters";
import {
  InputContext,
  FIleContext,
  AttrContext,
} from "../../../components/widgets/utils";
import { useState, useEffect, useRef } from "react";
import Button from "@material-ui/core/Button";
import { useMutation, useLazyQuery } from "@apollo/client";
import { CREATE_CHECKOUT } from "../../../graphql/mutations";
import { GET_JSON_RESULT } from "../../../graphql/queries";
import { Tabs, message, Row, Col, Space } from "antd";
import './index.min.css'
const { TabPane } = Tabs;
const Afp = () => {
  const [InputValue, setInputValue] = useState(""); //输入
  const [DrawValue, setDrawValue] = useState(null); //画图
  const [Token, setToken] = useState(null); //订单token
  const [FileList, setFileList] = useState([]); //上传的文件列表
  const [attrs, setAttrs] = useState([]); //选择计算的参数
  const [open, setOpen] = useState(false); //是否展示结果
  const maxFileCount = 1; //最多允许上传的文件的数量
  const [submitCheckout] = useMutation(CREATE_CHECKOUT); //Apollo 提交订单
  const [getJSON, { data }] = useLazyQuery(GET_JSON_RESULT, {
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      if (data.jsonResult == null) {
        setTimeout(() => {
          console.log("chaxun");
          getJSON({
            variables: { token: Token },
          });
        }, 2000);
      } else {
        message.success("作业运行成功！");
      }
    },
  }); //请求运算结果
  const indrawRef = useRef();
  useEffect(() => {
    console.log("文件列表：", FileList[0]);
  }, [FileList]);
  useEffect(() => {
    if (Token !== null) {
      console.log("开始查询");
      getJSON({
        variables: { token: Token },
      });
    }
  }, [Token]);
  /*
  添加对于文件的校验等，传入UploadFile组件中
  info{file,fileList}
  file:当前被操作的文件（上传、移除） 
  状态有：uploading done error removed，被 beforeUpload 拦截的文件没有 status 属性
  fileList:当前UploadFile组件中的文件列表
  该函数返回一个新的文件列表
  */
  const handleFileList = (info) => {
    let file = info.file;
    let fileList = info.fileList;
    if (file.size === 0 && file.status !== "removed") {
      message.error("文件不能为空！");
      fileList.pop();
      return fileList;
    }
    setFileList(fileList);
    if (file.status !== "removed") message.success("文件上传成功！");
    else message.success("文件移除成功！");
    return fileList;
  };
  //隐藏结果面板
  const handleClose = () => {
    setOpen(false);
  };
  //显示结果面板
  const handleOpen = () => {
    setOpen(true);
  };
  //获取画图插件分子式值
  const getSmiles = () => {
    const smiles = indrawRef.current.getSmiles();
    console.log("获取的分子式：", smiles);
    setDrawValue(smiles);
    message.success("分子式已经获取！");
  };
  //清除所有的分子式 手动输入、上传、画图
  const clearSmiles = () => {
    indrawRef.current.clearSmiles();
    setDrawValue(null);
    setInputValue("");
    setFileList([]);
    message.success("分子式已经清除！");
  };
  //提交订单
  const submit = () => {
    console.log("submit");
    let drawValue = null;
    let inputValue = null;
    let file = null;
    if (DrawValue !== "") drawValue = DrawValue;
    if (InputValue !== "") inputValue = InputValue;
    if (FileList.length > 0) file = FileList[0].originFileObj;
    console.log("上传的antd文件是：", FileList[0]);
    console.log("上传的文件是：", file);
    submitCheckout({
      variables: { product: 1, drawValue, inputValue, attr: attrs, file },
    }).then((res) => {
      if (res.data.CheckoutCreate.ok) {
        message.success("任务提交成功！");
        setToken(res.data.CheckoutCreate.token);
      }
    });
  };
  return (
    <div className="afp">
      <Row>
        <Col span={12}>
          <Tabs
            defaultActiveKey="2"
            style={{
              width: "500px",
              padding: "8px",
              marginLeft: "70px",
              height: "550px",
              boxShadow:
                "0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)",
            }}
            centered
          >
            <TabPane tab="输分子式" key="1">
              <InputContext.Provider value={{ setInputValue }}>
                <Input InputValue={InputValue} />
              </InputContext.Provider>
            </TabPane>
            <TabPane tab="画图插件" key="2">
              <Indraw indrawRef={indrawRef} />
            </TabPane>
            <TabPane tab="上传文件" key="3">
              <FIleContext.Provider value={{ handleFileList }}>
                <UploadFile maxFileCount={maxFileCount} fileList={FileList} />
              </FIleContext.Provider>
            </TabPane>
          </Tabs>
          <br />
          <Row>
            <Col span={8}>
              <Button
                variant="outlined"
                style={{ width: "145px", color: "green", marginLeft: "100px" }}
                onClick={() => {
                  getSmiles();
                }}
              >
                GETSMILES
              </Button>
            </Col>
            <Col span={8}>
              <Button
                variant="outlined"
                style={{ width: "145px", color: "green", marginLeft: "100px" }}
                onClick={() => {
                  clearSmiles();
                }}
              >
                RESET
              </Button>
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <AttrContext.Provider value={{ setAttrs }}>
            <SelectParamters attrs={attrs} />
          </AttrContext.Provider>
          <br />
          <Space>
            <Button
              variant="outlined"
              color="primary"
              style={{ color:"#0abab5", width: "145px" }}
              onClick={() => {
                submit();
              }}
            >
              提交任务
            </Button>
            <Button
              variant="outlined"
              color="primary"
              style={{ color:"#0abab5", width: "145px" }}
              onClick={() => {
                handleOpen();
              }}
            >
              查看结果
            </Button>
          </Space>
        </Col>
      </Row>
      <br />
      <ShowResultPanel
        json={data}
        open={open}
        token={Token}
        handleClose={handleClose}
      />
    </div>
  );
};
export default Afp;
