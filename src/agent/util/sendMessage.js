const sendMessage = function (name, data) {
  window.postMessage({
    source: 'coquette-inspect-agent',
    name: name,
    data: data || {}
  }, '*');
};

export default sendMessage;

