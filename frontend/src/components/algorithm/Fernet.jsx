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
    <>
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
      {/* <Divider orientation="left">Responsive</Divider> */}
      {/* <Divider orientation="left">Horizontal</Divider>
    <Row gutter={16}>
      <Col style={{ border: "1px solid blue" }} className="gutter-row" span={8}>
        <div >col-8</div>
      </Col>
      <Col style={{ border: "1px solid blue" }} className="gutter-row" span={8}>
        <div >col-8</div>
      </Col>
      <Col style={{ border: "1px solid blue" }} className="gutter-row" span={8}>
        <div >col-8</div>
      </Col>
    </Row>
    <Divider orientation="left">Responsive</Divider>
    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
      <Col style={{ border: "1px solid blue" }} className="gutter-row" span={6}>
        <div >col-6</div>
      </Col>
      <Col style={{ border: "1px solid blue" }} className="gutter-row" span={6}>
        <div >col-6</div>
      </Col>
      <Col style={{ border: "1px solid blue" }} className="gutter-row" span={6}>
        <div >col-6</div>
      </Col>
      <Col style={{ border: "1px solid blue" }} className="gutter-row" span={6}>
        <div >col-6</div>
      </Col>
    </Row>
    <Divider orientation="left">Vertical</Divider>
    <Row gutter={[16, 24]}>
      <Col style={{ border: "1px solid blue" }} className="gutter-row" span={6}>
        <div >col-6</div>
      </Col>
      <Col style={{ border: "1px solid blue" }} className="gutter-row" span={6}>
        <div >col-6</div>
      </Col>
      <Col style={{ border: "1px solid blue" }} className="gutter-row" span={6}>
        <div >col-6</div>
      </Col>
      <Col style={{ border: "1px solid blue" }} className="gutter-row" span={6}>
        <div >col-6</div>
      </Col>
      <Col style={{ border: "1px solid blue" }} className="gutter-row" span={6}>
        <div >col-6</div>
      </Col>
      <Col style={{ border: "1px solid blue" }} className="gutter-row" span={6}>
        <div >col-6</div>
      </Col>
      <Col style={{ border: "1px solid blue" }} className="gutter-row" span={6}>
        <div >col-6</div>
      </Col>
      <Col style={{ border: "1px solid blue" }} className="gutter-row" span={6}>
        <div >col-6</div>
      </Col> */}
      {/* </Row> */}
    </>
  );
};

export default Fernet;
