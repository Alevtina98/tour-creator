import sendMessage from "../util/sendMessage";

const agentActions = {
    enableSelectMode: function() {
        sendMessage("enableSelectMode");
    },

    disableSelectMode: function() {
        sendMessage("disableSelectMode");
    },
    runScript: function(descr: string) {
        sendMessage("runScript", descr);
    }
};

export default agentActions;
