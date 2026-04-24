chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchPrice") {
    // Intentamos buscar el precio en la sombra
    fetch(`https://es.camelcamelcamel.com/product/${request.asin}`)
      .then(response => response.text())
      .then(html => {
        // Buscamos el precio más bajo en el HTML (Regex simple)
        const regex = /Lowest.*?([0-9]+[,.][0-9]{2})/;
        const match = html.match(regex);
        if (match) {
          sendResponse({ success: true, min: match[1] });
        } else {
          sendResponse({ success: false });
        }
      })
      .catch(() => sendResponse({ success: false }));
    return true; // Mantiene el canal abierto para la respuesta asíncrona
  }
});