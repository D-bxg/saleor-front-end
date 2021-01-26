import { useImperativeHandle } from "react";
//参考：https://www.cnblogs.com/muamaker/p/11647626.html
const Indraw = (props = {}) => {
  const indrawRef = props.indrawRef;
  useImperativeHandle(indrawRef, () => ({
    //调用此方法获取画图插件所得的分子式，并将分子式返回
    getSmiles: () => {
      console.log("获取分子式");
      const iframe = document
        .getElementById("Indraw")
        .contentWindow.document.getElementById("IndrawIframe");
      const indraw = iframe.contentWindow.indraw;
      console.log(indraw);
      try {
        var smilesInfo = indraw.getSMILES();
      } catch (e) {
        smilesInfo = "";
      }
      return smilesInfo;
    },
    //清除分子式
    clearSmiles: () => {
      console.log("清除分子式");
      const iframe = document
        .getElementById("Indraw")
        .contentWindow.document.getElementById("IndrawIframe");
      const indraw = iframe.contentWindow.indraw;
      indraw.clear();
    },
  }));
  return (
    <div>
      <iframe
        title="Indraw"
        id="Indraw"
        src="/InDraw/demo.html"
        style={{ width: "490px", height: "470px", margin: "auto" }}
        frameBorder="0"
      ></iframe>
    </div>
  );
};

export default Indraw;
