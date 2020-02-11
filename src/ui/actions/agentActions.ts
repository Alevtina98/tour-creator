import sendMessage from "../util/sendMessage";

const agentActions = {
    enableSelectMode: function() {
        sendMessage("enableSelectMode");
    },

    disableSelectMode: function() {
        sendMessage("disableSelectMode");
    },
    runScript: function(codeJS: string | null) {
        sendMessage("runScript", codeJS);
    },
    disableRunScript: function() {
        sendMessage("disableRunScript");
    }
};

export default agentActions;
