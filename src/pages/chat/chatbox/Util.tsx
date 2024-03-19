import React, { useEffect, useState } from "react";
import httpMethods from "../../../api/Service";
import { FileModel, MessageModel } from "../../../modals/MessageModals";
import "./styles/utils.css";
import { ImageShowModal, Loader, getFormattedTime } from "../../../utils/utils";
import { CHAT_CACHE_FILES } from "../../../utils/Constants";

export const FileRenderer = ({
  type,
  fileUrl,
}: {
  type: string;
  fileUrl: string;
}) => {
  switch (type) {
    case "application/pdf": {
      return <iframe src={fileUrl} width="100%" title="PDF Viewer"></iframe>;
    }
    case "image/jpeg":
    case "image/png": {
      return <img src={fileUrl} alt={type} className="img-content" />;
    }
    case "video": {
      return (
        <video controls width="400">
          <source src={fileUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }
    default:
      return <div>{type}</div>;
  }
};

export const FileComponent = ({
  file,
  className = "",
  author,
}: {
  file: MessageModel;
  className: string;
  author: string;
}) => {
  const [fileUrl, setFileUrl] = useState("");
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    const getFileFromDb = async (id = "") => {
      let file;
      if (CHAT_CACHE_FILES[id]) {
        file = CHAT_CACHE_FILES[id];
      } else {
        file = await fileDownload(id);
        CHAT_CACHE_FILES[id] = file;
      }
      if (file) {
        const base64 = new Uint8Array(file.data.data);
        const url = URL.createObjectURL(
          new Blob([base64], { type: file.type }),
        );
        setFileUrl(url);
        return url;
      }
      return "";
    };
    if (file.fileLink) {
      getFileFromDb(file.fileLink);
    }
  }, []);
  return (
    <div
      style={{ width: "200px", border: "1px solid #ddd", display: "block" }}
      className={className}
    >
      <div className="message-sender fw-semibold">{author} : </div>
      <div className="img-wrapper text-center">
        {fileUrl && (
          <>
            <div onClick={() => setOpenModal(true)}>
              <FileRenderer
                type={getMessageType(file.type)}
                fileUrl={fileUrl}
              />
            </div>
            <span
              className="download-icon"
              onClick={(e) => downloadFile(e, fileUrl, file.content)}
            >
              <i className="bi bi-download"></i>
            </span>
          </>
        )}
        {!fileUrl && <Loader fullScreen={false} />}
      </div>
      <div className="content text-center">{file.content}</div>
      <p className="time-display">{getFormattedTime(file.time)}</p>
      {openModal && (
        <ImageShowModal show={openModal} onHide={() => setOpenModal(false)}>
          <FileRenderer type={getMessageType(file.type)} fileUrl={fileUrl} />
        </ImageShowModal>
      )}
    </div>
  );
};

const downloadFile = async (
  e: React.MouseEvent,
  url = "",
  fileName: string,
) => {
  e.stopPropagation();
  const el = document.createElement("a");
  el.href = url;
  el.target = "_blank";
  el.download = fileName;
  el.click();
  return url;
};

export const getMessageType = (data: string): string => {
  if (data.includes("pdf")) return "application/pdf";
  else if (data.includes("jpeg")) return "image/jpeg";
  else if (data.includes("sheet")) return "xlsx";
  return data;
};

export const fileDownload = async (id: string): Promise<FileModel> => {
  return httpMethods
    .get<FileModel>("/file/" + id)
    .then((res) => res)
    .catch((er) => er);
};
