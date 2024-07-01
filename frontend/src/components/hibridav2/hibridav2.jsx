import React, { useState, useRef } from "react";
import { Col, Row, Divider, Typography, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Input } from "antd";
import Swal from "sweetalert2";
import DHAlicia from "./DHAlicia";
import DHBetito from "./DHBetito";
import SecretoDHBetito from "./SecretoDHBetito";
import HibridAlicia from "./hibridAlicia";
import HibridBetito from "./HibridBetito";

const { Title } = Typography;
const AES = () => {
  const [data, setdata] = useState({});
  const [image, setImage] = useState(null);
  const [cipheredImage, setcipheredImage] = useState(null);
  const [iv, setIv] = useState("");
  const [key, setKey] = useState("");
  const [returnedImage, setReturnedImage] = useState(null);
  
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
        console.log(response);
        const contentDisposition = response.headers.get("Content-Disposition");
        let filename = ""; // Nombre por defecto
        console.log(contentDisposition);
        // const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        // if (filenameMatch.length === 2) {
        //   filename = filenameMatch[1];
        // }

        // alert("Formulario enviado exitosamente");
        const returnedImageData = await response.blob();
        console.log(returnedImage);
        setReturnedImage(URL.createObjectURL(returnedImageData));

        // Crear un enlace temporal y hacer clic en él para iniciar la descarga
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(returnedImageData);
        downloadLink.download = `image_${operationMode}_C.bmp`; // Nombre del archivo a descargar
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


  return (
    <div>
      <Title level={2}>Intercambio de llave con Diffie Hellman</Title>

      <Divider orientation="left">Cifrado </Divider>

      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
          <DHAlicia />
          <SecretoDHBetito />
          <HibridAlicia />
        </Col>
        <Col className="gutter-row" span={12}>
          <DHBetito />
          <HibridBetito/>
        </Col>
      </Row>
      <Divider orientation="left">Cifrado </Divider>
    </div>
  );
};

export default AES;
