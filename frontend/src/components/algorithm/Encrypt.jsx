import React, { useState, useRef } from "react";
import { Button, Divider, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { deleteExtension } from "../../utils/deleteExtension";

const Encrypt = () => {
  const { Paragraph } = Typography;
  const fileInputRef = useRef(null);
  const keyFileRef = useRef(null);
  const submitBtnRef = useRef(null);

  const [fileContent, setFileContent] = useState();
  const [keyFile, setkeyFile] = useState();
  const [encryptedMsg, setEncryptedMsg] = useState();

  const handleButtonClick = (ref) => {
    if (ref === "content") {
      fileInputRef.current.click();
    } else if (ref === "submitBtn") {
      submitBtnRef.current.click();
    } else {
      keyFileRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;
      setFileContent({ file, fileTextContent: text, name: file.name });
    };
    reader.readAsText(file);
  };

  const handleFileChange2 = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;
      setkeyFile({ file, fileTextContent: text });
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const fd = new FormData();
    fd.append("fileContent", fileContent.file);
    fd.append("keyFile", keyFile.file);

    setFileContent({ ...fileContent, name: fileContent.name });

    try {
      const resp = await fetch("https://backend-crypto-flask-9976f82913d4.herokuapp.com/encrypt", {
        method: "POST",
        body: fd,
      });

      if (resp.status !== 200) {
        throw new Error();
      }

      const blob = await resp.text();
      setEncryptedMsg(blob);
      const url = window.URL.createObjectURL(
        new Blob([blob], { type: "text/plain" })
      );

      const fileName = deleteExtension(fileContent.name);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${fileName}__C.txt`); // Establecemos el nombre del archivo
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Revisa los archivos cargados.",
      });
    }
  };
  return (
    <>
      <div>
        <h2>Cifrar</h2>
        <form onSubmit={handleSubmit}>
          <h3>Cargar archivo a cifrar</h3>

          {fileContent && fileContent.fileTextContent && (
            <>
              <h4>Texto a cifrar:</h4>
              <Paragraph>{fileContent.fileTextContent}</Paragraph>
            </>
          )}

          <Button
            icon={<UploadOutlined />}
            onClick={() => handleButtonClick("content")}
          >
            Cargar archivo
          </Button>

          <input
            ref={fileInputRef}
            style={{ display: "none" }}
            required
            type="file"
            accept={[".txt"]}
            onChange={handleFileChange}
          />
          <Divider />
          {keyFile && keyFile.fileTextContent && (
            <>
              <h4>Llave:</h4>
              <Paragraph>{keyFile.fileTextContent}</Paragraph>
            </>
          )}

          <input
            ref={keyFileRef}
            style={{ display: "none" }}
            required
            type="file"
            accept={[".key"]}
            onChange={handleFileChange2}
          />
          <Button
            icon={<UploadOutlined />}
            onClick={() => handleButtonClick("key")}
          >
            Cargar llave
          </Button>

          <h5>Presiona el botón para cifrar el mensaje</h5>
          <button type="submit" ref={submitBtnRef} style={{ display: "none" }}>
            Boton oculto
          </button>
          <Button type="primary" onClick={() => handleButtonClick("submitBtn")}>
            Cifrar
          </Button>

          {encryptedMsg && (
            <>
              <h2>Mensaje Cifrado</h2>
              <Paragraph>{encryptedMsg}</Paragraph>
            </>
          )}
        </form>
      </div>
    </>
  );
};

export default Encrypt;
