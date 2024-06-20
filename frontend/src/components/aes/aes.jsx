import React, { useState, useRef } from "react";
import { Col, Row, Divider, Typography, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Input } from "antd";
const { Title } = Typography;
const AES = () => {
  const [data, setdata] = useState({});
  const [image, setImage] = useState(null);
  const [cipheredImage, setcipheredImage] = useState(null);
  const [iv, setIv] = useState("");
  const [key, setKey] = useState("");
  const [returnedImage, setReturnedImage] = useState(null);
  const [returnedImage2, setReturnedImage2] = useState(null);
  const [operationMode, setoperationMode] = useState("CBC"); // Estado para el valor seleccionado
  const fileInputRef = useRef(null);
  const submitBtnRef = useRef(null);
  const fileInputRefDecrypt = useRef(null);
  const submitBtnRefDecrypt = useRef(null);

  const operationModeList = [
    { value: "CBC", label: "CBC" },
    { value: "CFB", label: "CFB" },
    { value: "ECB", label: "ECB" },
    { value: "OFB", label: "OFB" },
  ];

  const clearEncrypt = () => {
    setdata({});
    setKey("");
    setIv("");
    setImage(null);
    setcipheredImage(null);
    setReturnedImage(null);
  };

  const clearDecrypt = () => {
    setdata({});
    setKey("");
    setIv("");
    setReturnedImage2(null);
  };

  const handleButtonClick = (ref) => {
    if (ref === "content") {
      fileInputRef.current.click();
    } else if (ref === "submitBtn") {
      submitBtnRef.current.click();
    } else if (ref === "contentDecrypt") {
      fileInputRefDecrypt.current.click();
    } else if (ref === "submitBtnDecrypt") {
      submitBtnRefDecrypt.current.click();
    }
  };

  const handleChange = (event) => {
    setoperationMode(event.target.value);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };
  const handlecipheredImage = (event) => {
    setcipheredImage(event.target.files[0]);
  };

  const handleIvChange = (event) => {
    setIv(event.target.value);
  };

  const handleKeyChange = (event) => {
    setKey(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("image", image);
    formData.append("iv", iv);
    formData.append("key", key);
    formData.append("operationMode", operationMode);

    try {
      const response = await fetch(
        `https://backend-crypto-flask-9976f82913d4.herokuapp.com/${operationMode}/encrypt`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        alert("Formulario enviado exitosamente");
        const returnedImageData = await response.blob();
        setReturnedImage(URL.createObjectURL(returnedImageData));

        // Crear un enlace temporal y hacer clic en él para iniciar la descarga
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(returnedImageData);
        downloadLink.download = "imagen_devuelta.bmp"; // Nombre del archivo a descargar
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } else {
        alert("Error al enviar el formulario");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al enviar el formulario");
    }
  };
  const getKeyAndIV = async () => {
    try {
      const resp = await fetch(
        `https://backend-crypto-flask-9976f82913d4.herokuapp.com/generate_key_iv`
      );
      if (!resp.ok) {
        throw new Error("Network response was not ok " + resp.statusText);
      }
      const jsonData = await resp.json();
      console.log(jsonData);
      setdata(jsonData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
  const handleSubmit2 = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("image", cipheredImage);
    formData.append("iv", iv);
    formData.append("key", key);
    formData.append("operationMode", operationMode);

    try {
      const response = await fetch(
        `https://backend-crypto-flask-9976f82913d4.herokuapp.com/${operationMode}/decrypt`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        alert("Formulario enviado exitosamente");

        const returnedImageData = await response.blob();
        setReturnedImage2(URL.createObjectURL(returnedImageData));

        // Crear un enlace temporal y hacer clic en él para iniciar la descarga
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(returnedImageData);
        downloadLink.download = "imagen_devuelta.bmp"; // Nombre del archivo a descargar
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } else {
        alert("Error al enviar el formulario");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al enviar el formulario");
    }
  };

  return (
    <div>
      <Title level={2}>AES - Advanced Encryption Standard</Title>

      <Button onClick={getKeyAndIV}>
        Obtener llave y vector de inicialización
      </Button>
      <br></br>
      {data && (
        <>
          <div style={{ fontWeight: "bold" }}>Llave: {data.key}</div>
          <div style={{ fontWeight: "bold" }}>
            Vector de inicialización (IV): {data.iv}
          </div>
        </>
      )}

      <br></br>
      <div>
        <label htmlFor="mi-select">Selecciona modo de operación:</label>
        <select id="mi-select" value={operationMode} onChange={handleChange}>
          {operationModeList.map((opcion) => (
            <option key={opcion.value} value={opcion.value}>
              {opcion.label}
            </option>
          ))}
        </select>
      </div>

      <Divider orientation="left">Modo operación {operationMode}</Divider>

      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
          <h2>Cifrar</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <input
                ref={fileInputRef}
                style={{ display: "none" }}
                type="file"
                accept=".bmp"
                onChange={handleImageChange}
                required
              />
              <Button
                icon={<UploadOutlined />}
                onClick={() => handleButtonClick("content")}
              >
                Cargar imagen
              </Button>
              <br></br>
              {image && (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Imagen seleccionada"
                  style={{ maxWidth: "200px", marginTop: "10px" }}
                />
              )}
            </div>
            <div>
              <label>
                Key:
                <Input
                  type="text"
                  value={key}
                  onChange={handleKeyChange}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                IV:
                <Input
                  type="text"
                  value={iv}
                  onChange={handleIvChange}
                  required={operationMode !== "ECB"}
                />
              </label>
            </div>
            <button
              type="submit"
              style={{ display: "none" }}
              ref={submitBtnRef}
            >
              Enviar
            </button>
            <br></br>
            <Button
              type="primary"
              onClick={() => handleButtonClick("submitBtn")}
            >
              Cifrar
            </Button>
            <Button
              type="primary"
              style={{ marginLeft: "10px" }}
              danger
              ghost
              onClick={clearEncrypt}
            >
              Limpiar
            </Button>
          </form>
          {returnedImage && (
            <>
              <div>
                <h2>Imagen cifrada:</h2>
                <img src={returnedImage} alt="Imagen devuelta" />
              </div>
            </>
          )}
        </Col>
        <Col className="gutter-row" span={12}>
          <h2>Descifrar</h2>
          <form onSubmit={handleSubmit2}>
            <div>
              <input
                style={{ display: "none" }}
                type="file"
                ref={fileInputRefDecrypt}
                accept=".bmp"
                onChange={handlecipheredImage}
                required
              />
              <Button
                icon={<UploadOutlined />}
                onClick={() => handleButtonClick("contentDecrypt")}
              >
                Cargar imagen
              </Button>
              <br></br>
              {cipheredImage && (
                <img
                  src={URL.createObjectURL(cipheredImage)}
                  alt="Imagen seleccionada"
                  style={{ maxWidth: "200px", marginTop: "10px" }}
                />
              )}
            </div>
            <div>
              <label>
                Key:
                <Input
                  type="text"
                  value={key}
                  onChange={handleKeyChange}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                IV:
                <Input
                  type="text"
                  value={iv}
                  onChange={handleIvChange}
                  required={operationMode !== "ECB"}
                />
              </label>
            </div>
            <br></br>
            <button
              type="submit"
              style={{ display: "none" }}
              ref={submitBtnRefDecrypt}
            >
              Enviar
            </button>
            <Button
              type="primary"
              onClick={() => handleButtonClick("submitBtnDecrypt")}
            >
              Descifrar
            </Button>
            <Button
              style={{ marginLeft: "10px" }}
              type="primary"
              danger
              ghost
              onClick={clearDecrypt}
            >
              Limpiar
            </Button>
          </form>
          {returnedImage2 && (
            <>
              <div>
                <h2>Imagen descrifrada:</h2>
                <img src={returnedImage2} alt="Imagen devuelta" />
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default AES;
