import { InboxOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import { FIleContext } from "../widgets/utils";
import { useContext } from "react";
const { Dragger } = Upload;
const UploadFile = (props = {}) => {
  const { handleFileList } = useContext(FIleContext);
  const maxCount = props.maxFileCount;
  const fileList = props.fileList;
  const uploadProps = {
    fileList,
    name: "file",
    multiple: maxCount > 1,
    maxCount: maxCount,
    // return false prevent upload action.
    beforeUpload: (file) => {
      return false;
    },
    onChange: (info) => {
      info.fileList = handleFileList(info);
    },
  };
  return (
    <div>
      <Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibit from uploading
          company data or other band files
        </p>
      </Dragger>
    </div>
  );
};
export default UploadFile;
