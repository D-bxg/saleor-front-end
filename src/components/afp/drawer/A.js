import { Drawer, Checkbox } from "antd";
const ADrawer = (props = {}) => {
  const AcheckBoxOptions = [
    { label: " Human Intestinal Absorption", value: "A_HIA_I" },
    { label: "Caco-2 Permeability", value: "R_A_Caco2_I" },
    { label: "Caco-2 Permeability II", value: "A_Caco2_I" },
    { label: "P-glycoprotein Inhibitor I", value: "A_PgpI_I" },
    { label: "P-glycoprotein Inhibitor II", value: "A_PgpI_II" },
    { label: "P-glycoprotein Substrate", value: "A_PgpS_I" },
  ];
  const closeDrawer = props.closeDrawer;
  const A = props.A;
  const handleSelectParamter = props.handleSelectParamter;
  const onChange = (checkValue) => {
    handleSelectParamter("A", checkValue);
  };
  return (
    <Drawer
      title=" A (Absorption)"
      placement="right"
      width="350"
      closable={false}
      onClose={() => {
        closeDrawer("A");
      }}
      visible={A}
    >
      <Checkbox.Group options={AcheckBoxOptions} onChange={onChange} />
    </Drawer>
  );
};
export default ADrawer;
