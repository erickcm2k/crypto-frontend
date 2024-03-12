import React, { useState, useRef } from "react";
import { Button, Divider, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

const Encrypt = () => {
  const { Paragraph } = Typography;
  const fileInputRef = useRef(null);
  const keyFileRef = useRef(null);
  const submitBtnRef = useRef(null);

  const [fileContent, setFileContent] = useState();
  const [keyFile, setkeyFile] = useState();
  const [decryptedMsg, setdecryptedMsg] = useState("");

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
      setFileContent({ file, name: text });
    };
    reader.readAsText(file);
  };

  const handleFileChange2 = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;
      setkeyFile({ file, name: text });
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const fd = new FormData();
    fd.append("fileContent", fileContent.file);
    fd.append("keyFile", keyFile.file);

    try {
      const resp = await fetch("http://127.0.0.1:5000/decrypt", {
        method: "POST",
        body: fd,
      });

      if (resp.status !== 200) {
        throw new Error();
      }

      const blob = await resp.text();
      setdecryptedMsg(blob);
      const url = window.URL.createObjectURL(
        new Blob([blob], { type: "text/plain" })
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "descifrado.txt"); // Establecemos el nombre del archivo
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Revisa los archivos cargados. Es posible que se esté usando una llave incorrecta.",
      });
    }
  };
  return (
    <>
      <div>
        <h2>Descifrar</h2>
        <form onSubmit={handleSubmit}>
          <h3>Cargar archivo a descifrar</h3>

          {fileContent && fileContent.name && (
            <>
              <h4>Texto a descifrar:</h4>
              <Paragraph>{fileContent.name}</Paragraph>
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
          {keyFile && keyFile.name && (
            <>
              <h4>Llave:</h4>
              <Paragraph>{keyFile.name}</Paragraph>
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

          <h5>Presiona el botón para descifrar el mensaje</h5>
          <button type="submit" ref={submitBtnRef} style={{ display: "none" }}>
            Boton oculto
          </button>
          <Button type="primary" onClick={() => handleButtonClick("submitBtn")}>
            Descifrar
          </Button>
          {/* <Button type="primary" onClick={() => handleButtonClick("submitBtn")}>
            Descifrar usando archivo cargado previamente
          </Button> */}

          {decryptedMsg && (
            <>
              <h2>Mensaje descifrado</h2>

              {decryptedMsg}
            </>
          )}
        </form>
      </div>
    </>
  );
};

export default Encrypt;