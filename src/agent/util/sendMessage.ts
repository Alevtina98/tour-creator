const sendMessage = function(name: string, data: string) {
    window.postMessage(
        {
            source: "coquette-inspect-agent",
            name: name,
            data: data || {}
        },
        "*"
    );
};

export default sendMessage;
