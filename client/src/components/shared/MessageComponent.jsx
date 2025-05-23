/* eslint-disable react/prop-types */
import { Box, Typography } from "@mui/material";
import { memo } from "react";
import { lightBlue } from "../../constants/color";
import moment from "moment";
import { fileFormat } from "../../lib/features";
import RenderAttchment from "./RenderAttchment";
import {motion} from "framer-motion";
const MessageComponent = ({ message, user }) => {
  const { sender, content, attachments = [], createdAt } = message;
  // console.log(message)
  const sameSender = sender?._id === user?._id;
  const timeAgo = moment(createdAt).fromNow();
  return (
    <motion.div
      initial={{ opacity: 0 ,x:"-100%"}}
      whileInView={{ opacity: 1 ,x:0}}
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        backgroundColor: "white",
        borderRadius: "5px",
        padding: "0.5rem",
        width: "fit-content",
      }}
    >
      {!sameSender && (
        <Typography color={lightBlue} fontWeight={600} variant="caption">
          {sender?.name}
        </Typography>
      )}
      {content && <Typography>{content}</Typography>}
      {/* Attachments */}
      {attachments.length > 0 &&
        attachments.map((attachment) => {
          const url = attachment.url;
          const file = fileFormat(url);
          // console.log(url);
          return (
            <Box key={url}>
              <a
                href={url}
                target="_blank"
                download
                style={{
                  color: "black",
                }}
              >
                {RenderAttchment(file, url)}
                {/* {<RenderAttchment file={file} url={url}/>} */}
              </a>
            </Box>
          );
        })}
      <Typography variant="caption" color={"text.secondary"}>
        {timeAgo}
      </Typography>
    </motion.div>
  );
};

export default memo(MessageComponent);
