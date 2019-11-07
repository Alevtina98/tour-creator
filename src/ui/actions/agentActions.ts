import sendMessage from "../util/sendMessage";

const agentActions = {
    enableSelectMode: function() {
        sendMessage("enableSelectMode");
    },

    disableSelectMode: function() {
        sendMessage("disableSelectMode");
    },
    runScript: function(codeJS: string) {
        sendMessage("runScript", codeJS);
    },
    disableRunScript: function() {
        sendMessage("disableRunScript");
    }
};

export default agentActions;
