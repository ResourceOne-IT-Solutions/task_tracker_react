import React, { useEffect, useState } from "react";
import httpMethods from "../../../api/Service";
import { FileModel, MessageModel } from "../../../modals/MessageModals";
import "./styles/utils.css";

const FileRenderer = ({ type, fileUrl }: { type: string; fileUrl: string }) => {
  switch (type) {
    case "application/pdf": {
      return <iframe src={fileUrl} width="100%" title="PDF Viewer"></iframe>;
    }
    case "image/jpeg": {
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
  useEffect(() => {
    const getFileFromDb = async (id = "") => {
      const file = await fileDownload(id);
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
      onClick={(e) => downloadFile(e, fileUrl, file.content)}
    >
      <div className="message-sender fw-semibold">{author} : </div>
      <div className="img-wrapper">
        {fileUrl && (
          <div>
            <FileRenderer type={getMessageType(file.type)} fileUrl={fileUrl} />
          </div>
        )}
        <span className="download-icon">
          <i className="bi bi-download"></i>
        </span>
      </div>
      <div className="content">{file.content}</div>
      <p className="time-display">{file.time}</p>
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

const getMessageType = (data: string): string => {
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
