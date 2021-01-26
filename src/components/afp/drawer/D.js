import { Drawer, Checkbox } from "antd";
const DDrawer = (props = {}) => {
  const closeDrawer = props.closeDrawer;
  const D = props.D;
  const DcheckBoxOptions = [{ label: "Blood-Brain Barrier", value: "A_BBB_I" }];
  const handleSelectParamter = props.handleSelectParamter;
  const onChange = (checkValue) => {
    handleSelectParamter("D", checkValue);
  };
  return (
    <Drawer
      title="  D (Distribution)"
      placement="right"
      closable={false}
      onClose={() => {
        closeDrawer("D");
      }}
      visible={D}
    >
      <Checkbox.Group options={DcheckBoxOptions} onChange={onChange} />
    </Drawer>
  );
};
export default DDrawer;
