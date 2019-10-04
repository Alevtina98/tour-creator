import sendMessage from "../util/sendMessage";

const agentActions = {
    enableSelectMode: function() {
        sendMessage("enableSelectMode");
    },

    disableSelectMode: function() {
        sendMessage("disableSelectMode");
    }
};

export default agentActions;
