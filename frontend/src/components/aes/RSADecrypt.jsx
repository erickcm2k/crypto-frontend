import Swal from "sweetalert2";

import React, { useState, useRef } from "react";
import { Button } from "antd";
import { Input } from "antd";
import TextArea from "antd/es/input/TextArea";

const RSA = () => {
  const [content, setContent] = useState("");
  const [PK, setPK] = useState("");
  const fileInputRef = useRef(null);
  const submitBtnRef = useRef(null);
  const handleButtonClick = (ref) => {
    if (ref === "content") {
      fileInputRef.current.click();
    } else if (ref === "submitBtn") {
      submitBtnRef.current.click();
    }
  };

  const clearForm = () => {
    setContent("");
    setPK("");
  };


  const handlePKChange = (event) => {
    setPK(event.target.value);
  };
  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();

    formData.append("content", content);
    formData.append("privateKey", PK);

    try {
      console.log(content);
      const response = await fetch(`https://backend-crypto-flask-9976f82913d4.herokuapp.com/RSA/decrypt`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Formulario enviado exitosamente");
        const returnedImageData = await response.blob();
        // Crear un enlace temporal y hacer clic en él para iniciar la descarga
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(returnedImageData);
        downloadLink.download = "llave_y_vector.txt"; // Nombre del archivo a descargar
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Revisa los archivos cargados. Es posible que se estén ingresando datos incorrectos.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Revisa los archivos cargados. Es posible que se estén ingresando datos incorrectos.",
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Contenido cifrado:
            <TextArea
              value={content}
              onChange={handleContentChange}
              required
            />
          </label>
          <label>
            Llave privada:
            <TextArea value={PK} onChange={handlePKChange} required />
          </label>
        </div>
        <div></div>
        <button type="submit" style={{ display: "none" }} ref={submitBtnRef}>
          Enviar
        </button>
        <br></br>
        <Button type="primary" onClick={() => handleButtonClick("submitBtn")}>
          Cifrar
        </Button>
        <Button
          type="primary"
          style={{ marginLeft: "10px" }}
          danger
          ghost
          onClick={clearForm}
        >
          Limpiar
        </Button>
      </form>{" "}
      <br></br>
    </div>
  );
};

export default RSA;
