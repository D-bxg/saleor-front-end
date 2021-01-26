import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import AfpResultTable from "./AfpResultTable";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
    background:"#0abab5"
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ShowResultPanel = (props = {}) => {
  let json = null;
  if (props.json) json = props.json.jsonResult;
  const token = props.token;
  const classes = useStyles();
  const open = props.open;
  const handleClose = props.handleClose;
  const DownloadFile = (token) => {
    window.location.href = "http://192.168.172.128:8080/download/" + token;
  };
  const Download = () => {
    if (token !== null) {
      return (
        <Button
          variant="contained"
          color="primary"
          style={{ width: "200px", marginLeft: "200px" }}
          startIcon={<CloudDownloadIcon />}
          onClick={() => {
            DownloadFile(token);
          }}
        >
          下载结果文件
        </Button>
      );
    }
    return null;
  };
  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {token}
            </Typography>
          </Toolbar>
        </AppBar>
        <div style={{ width: "95%", margin: "0 auto" }}>
          <AfpResultTable json={json} />
        </div>
        <br />
        {<Download />}
      </Dialog>
    </div>
  );
};
export default ShowResultPanel;
