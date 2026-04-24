function obtenerConfiguracion(host) {
  // Verificamos si estamos en la tienda de España o USA
  if (host.includes('amazon.es')) {
    return {
      lang: 'es',
      tag: 'abellan27-21', // Tu ID de España
      camelUrl: 'https://es.camelcamelcamel.com/product/',
      texts: {
        title: 'ABELLANLABS™ VERIFICADOR',
        question: '¿Es este su precio más bajo?',
        button: 'Verificar Historial Real',
        disclaimer: 'AbellanLabs™ es un Asociado Oficial de Amazon.'
      }
    };
  } 
  
  // Configuración por defecto para Amazon.com
  return {
    lang: 'en',
    tag: 'abellanusa-20', // Tu ID de USA
    camelUrl: 'https://camelcamelcamel.com/product/',
    texts: {
      title: 'ABELLANLABS™ PRICE CHECKER',
      question: 'Is this the lowest price?',
      button: 'Check Real History',
      disclaimer: 'AbellanLabs™ is an official Amazon Associate.'
    }
  };
}

function inyectarPopupGlobal() {
  const currentHost = window.location.hostname;
  const url = window.location.href;
  const asinMatch = url.match(/\/([A-Z0-9]{10})(?:[\/?]|$)/);
  const asin = asinMatch ? asinMatch[1] : null;
  const precioElem = document.querySelector('.a-price-whole');

  if (!asin || !precioElem) return;

  const config = obtenerConfiguracion(currentHost);
  const actual = precioElem.innerText.replace('\n', '');

  const aviso = document.createElement('div');
  aviso.id = 'abellan-popup';
  aviso.style.cssText = `
    position: fixed; top: 20px; right: 20px; background: #111; color: white;
    padding: 20px; border-radius: 15px; z-index: 999999; width: 280px;
    box-shadow: 0 15px 40px rgba(0,0,0,0.6); font-family: 'Segoe UI', sans-serif;
    border-top: 5px solid #ff9900;
  `;

  aviso.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
      <span style="font-size:10px; color:#666; font-weight:bold; letter-spacing:1px;">${config.texts.title}</span>
      <span id="close-abellan" style="cursor:pointer; color:#444; font-size:20px;">&times;</span>
    </div>

    <div style="margin-bottom:20px;">
      <div style="font-size:28px; font-weight:bold;">${actual}${config.lang === 'es' ? '€' : '$'}</div>
      <div style="font-size:12px; color:#aaa; margin-top:5px;">${config.texts.question}</div>
    </div>

    <button id="btn-verificar" style="background:#ff9900; color:black; border:none; padding:12px; width:100%; border-radius:8px; cursor:pointer; font-weight:bold; font-size:14px;">
      ${config.texts.button}
    </button>

    <div style="text-align:center; margin-top:15px; font-size:9px; color:#333;">
      ${config.texts.disclaimer}
    </div>
  `;

  document.body.appendChild(aviso);

  // Cerrar el popup
  document.getElementById('close-abellan').onclick = () => aviso.remove();

  // Acción del botón con redirección dual
  document.getElementById('btn-verificar').onclick = () => {
    // Construimos las URLs usando las constantes locales para evitar errores de scope
    const urlAfiliado = `https://${currentHost}/dp/${asin}?tag=${config.tag}`;
    const urlFinalGrafica = config.camelUrl + asin;

    // 1. Abrimos tu enlace de afiliado en una pestaña nueva
    const nuevaPestana = window.open(urlAfiliado, '_blank');
    
    // 2. Si la pestaña se abrió correctamente, redirigimos a la gráfica tras 1 segundo
    if (nuevaPestana) {
      setTimeout(() => {
        nuevaPestana.location.href = urlFinalGrafica;
      }, 1000);
    }
  };
}

// Ejecutamos la función al cargar la página
inyectarPopupGlobal();