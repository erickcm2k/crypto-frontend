export const descargarArchivo = (contenido, nombreArchivo) => {
  // Crea un objeto Blob a partir del contenido de la cadena
  const blob = new Blob([contenido], { type: "text/plain" });

  // Crea un enlace para descargar el archivo
  const url = window.URL.createObjectURL(blob);

  // Crea un elemento 'a' temporal para descargar el archivo
  const link = document.createElement("a");
  link.href = url;
  link.download = nombreArchivo;

  // Agrega el enlace al DOM y simula un clic para iniciar la descarga
  document.body.appendChild(link);
  link.click();

  // Elimina el enlace del DOM después de la descarga
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
