import React from "react";
import { Col, Row, Divider, Typography, Button } from "antd";
import Encrypt from "./Encrypt";
import Decrypt from "./Decrypt";
import { descargarArchivo } from "./DescargarArchivo";
const { Title } = Typography;

const Fernet = () => {
  const handleButtonClick = async () => {
    window.open("http://127.0.0.1:5000/key");
  };

  return (
    <div style={{border: '1px solid red'}}>
      <Title level={2}>Fernet - Cifrado Simétrico</Title>
      <div>
        <Button onClick={handleButtonClick}>Generar llave</Button>
      </div>
      <Divider orientation="left">Algoritmo Fernet</Divider>
      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
          <Encrypt />
        </Col>
        <Col className="gutter-row" span={12}>
          <Decrypt />{" "}
        </Col>
      </Row>    
    </div>
  );
};

export default Fernet;
