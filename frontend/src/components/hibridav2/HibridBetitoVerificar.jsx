import React, { useState } from 'react';
import { Upload, Button, message, Form, Input, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

function VerificacionFirma() {
  const [archivoFirmado, setArchivoFirmado] = useState(null);
  const [llavePublica, setLlavePublica] = useState(null);
  const [archivoDH, setArchivoDH] = useState(null);
  const [archivoDescifrado, setArchivoDescifrado] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('archivo_firmado', archivoFirmado);
    formData.append('llave_publica', llavePublica);
    formData.append('archivo_dh', archivoDH);
    formData.append('archivo_descifrado', archivoDescifrado);

    setLoading(true);
    try {
      const response = await fetch('https://backend-crypto-flask-9976f82913d4.herokuapp.com/Hibrid_Betito/verificar', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.verificacion) {
        message.success('¡Firma verificada con éxito!');
      } else {
        message.error('Error en la verificación de la firma.');
      }
    } catch (error) {
      message.error('Error en la comunicación con el servidor.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading} tip="Verificando...">
      <Form layout="vertical">
        <Form.Item label="Archivo Firmado">
          <Upload 
            beforeUpload={(file) => {
              setArchivoFirmado(file);
              return false; // Evita la carga automática
            }}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Seleccionar Archivo</Button>
          </Upload>
        </Form.Item>

        {/* Repetir estructura similar para los otros 3 archivos */}
        <Form.Item label="Llave Pública RSA de alicia">
          <Upload 
            beforeUpload={(file) => {
              setLlavePublica(file);
              return false;
            }}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Seleccionar Archivo</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Archivo AES">
          <Upload 
            beforeUpload={(file) => {
              setArchivoDH(file);
              return false;
            }}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Seleccionar Archivo</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Archivo Descifrado">
          <Upload 
            beforeUpload={(file) => {
              setArchivoDescifrado(file);
              return false;
            }}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Seleccionar Archivo</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            onClick={handleUpload} 
            disabled={!archivoFirmado || !llavePublica || !archivoDH || !archivoDescifrado}
          >
            Verificar Firma
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
}

export default VerificacionFirma;
