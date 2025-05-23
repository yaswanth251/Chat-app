/* eslint-disable react/prop-types */
import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from "@mui/material";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setIsFileMenu, setUploadingLoader } from "../../redux/reducers/misc";
import {
  Image as ImageIcon,
  AudioFile as AudioIcon,
  VideoFile as VideoIcon,
  UploadFile as UploadFileIcon,
} from "@mui/icons-material";
import { useRef } from "react";
import toast from "react-hot-toast";
import { useSendAttachmentsMutation } from "../../redux/api/api";
const FileMenu = ({ anchorE1, chatId }) => {
  const { isFileMenu } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const imageRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const fileRef = useRef(null);
  const [sendAttachments] = useSendAttachmentsMutation();
  const closeFileMenu = () => {
    dispatch(setIsFileMenu(false));
  };
  const selectRef = (ref) => {
    ref.current?.click();
  };
  const fileChangeHanlder = async (e, key) => {
    const files = Array.from(e.target.files);
    if (files.length <= 0) return;
    if (files.length > 5)
      return toast.error(`you can only send 5 ${key} at a time`);
    dispatch(setUploadingLoader(true));
    const toastId = toast.loading(`Sending ${key}...`);
    closeFileMenu();
    try {
      const myForm = new FormData();
      myForm.append("chatId", chatId);
      files.forEach((file)=>{
        myForm.append("files", file)
      })
      const res = await sendAttachments(myForm);
      if (res.data) {
        toast.success(`${key} sent successfully`, { id: toastId });
      } else {
        toast.error(`Failed to send ${key}`, { id: toastId });
      }
    } catch (err) {
      toast.error(err, { id: toastId });
    } finally {
      dispatch(setUploadingLoader(false));
    }
  };
  return (
    <Menu anchorEl={anchorE1} open={isFileMenu} onClose={closeFileMenu}>
      <div
        style={{
          width: "10rem",
        }}
      >
        <MenuList>
          <MenuItem onClick={() => selectRef(imageRef)}>
            <Tooltip title="Image">
              <ImageIcon />
            </Tooltip>
            <ListItemText
              style={{
                marginLeft: "0.5rem",
              }}
            >
              Image
            </ListItemText>
            <input
              type="file"
              multiple
              accept="image/png,image/jpeg,image/gif,"
              ref={imageRef}
              style={{
                display: "none",
              }}
              onChange={(e) => fileChangeHanlder(e, "Images")}
            />
          </MenuItem>
          <MenuItem onClick={() => selectRef(audioRef)}>
            <Tooltip title="Audio">
              <AudioIcon />
            </Tooltip>
            <ListItemText
              style={{
                marginLeft: "0.5rem",
              }}
            >
              Audio
            </ListItemText>
            <input
              type="file"
              multiple
              accept="audio/mpeg,audio/wav,audio/mp3"
              ref={audioRef}
              style={{
                display: "none",
              }}
              onChange={(e) => fileChangeHanlder(e, "Audios")}
            />
          </MenuItem>
          <MenuItem onClick={() => selectRef(videoRef)}>
            <Tooltip title="Video">
              <VideoIcon />
            </Tooltip>
            <ListItemText
              style={{
                marginLeft: "0.5rem",
              }}
            >
              Video
            </ListItemText>
            <input
              type="file"
              multiple
              accept="video/mp4,video/webm,video/ogg"
              ref={videoRef}
              style={{
                display: "none",
              }}
              onChange={(e) => fileChangeHanlder(e, "Videos")}
            />
          </MenuItem>
          <MenuItem onClick={() => selectRef(fileRef)}>
            <Tooltip title="File">
              <UploadFileIcon />
            </Tooltip>
            <ListItemText
              style={{
                marginLeft: "0.5rem",
              }}
            >
              File
            </ListItemText>
            <input
              type="file"
              multiple
              accept="*"
              style={{
                display: "none",
              }}
              ref={fileRef}
              onChange={(e) => fileChangeHanlder(e, "Files")}
            />
          </MenuItem>
        </MenuList>
      </div>
    </Menu>
  );
};

export default FileMenu;
