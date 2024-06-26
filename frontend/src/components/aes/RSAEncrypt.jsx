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
  const [privateKey, setPrivateKey] = useState(null);
  const [publicKey, setPublicKey] = useState(null);

  const handleButtonClick = (ref) => {
    if (ref === "content") {
      fileInputRef.current.click();
    } else if (ref === "submitBtn") {
      submitBtnRef.current.click();
    }
  };

  const handleDownloadKeys = async () => {
    try {
      const response = await fetch("https://backend-crypto-flask-9976f82913d4.herokuapp.com/RSA/getKeys");
      const data = await response.json();

      // Descargar clave privada
      const privateKeyBlob = new Blob([data.private_key], {
        type: "text/plain",
      });
      const privateKeyUrl = URL.createObjectURL(privateKeyBlob);
      const privateKeyLink = document.createElement("a");
      privateKeyLink.href = privateKeyUrl;
      privateKeyLink.download = "private_key.txt";
      privateKeyLink.click();
      URL.revokeObjectURL(privateKeyUrl);

      // Descargar clave pública
      const publicKeyBlob = new Blob([data.public_key], { type: "text/plain" });
      const publicKeyUrl = URL.createObjectURL(publicKeyBlob);
      const publicKeyLink = document.createElement("a");
      publicKeyLink.href = publicKeyUrl;
      publicKeyLink.download = "public_key.txt";
      publicKeyLink.click();
      URL.revokeObjectURL(publicKeyUrl);
    } catch (error) {
      console.error("Error downloading keys:", error);
      // Manejar el error de manera apropiada (mostrar un mensaje al usuario, etc.)
    }
  };

  const clearForm = () => {
    setContent("");
    setPK("");
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handlePKChange = (event) => {
    setPK(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    console.log(content);
    formData.append("content", content);
    formData.append("publicKey", PK);

    try {
      const response = await fetch(`https://backend-crypto-flask-9976f82913d4.herokuapp.com/RSA/encrypt`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Formulario enviado exitosamente");
        const returnedImageData = await response.blob();
        // Crear un enlace temporal y hacer clic en él para iniciar la descarga
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(returnedImageData);
        downloadLink.download = "datos_cifrados_aes.txt"; // Nombre del archivo a descargar
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
      <div>
        <button onClick={handleDownloadKeys}>Descargar Claves</button>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Contenido a cifrar:
            <TextArea value={content} onChange={handleContentChange} required />
          </label>
          <label>
            Llave pública:
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
