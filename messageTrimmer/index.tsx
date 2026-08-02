/*
* hi im a plugin
* the top thing didn't generate so like
* do not sell me?
*
* partially uses code from other discord plugins included with vencord
* */

import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";
import { findByProps } from "@webpack";

let OriginalSendMessage: any;

const letters = "qwertyuiopasdfghjklzxcvbnm1234567890,.!?¿¿¿¿¿"
const lettersAsList = letters.split(",");

const beginRegex = /^[A-Za-z]?!/

const settings = definePluginSettings({
    trimAmount: {
        description: "Amount of letters at the end to cut off",
        type: OptionType.BIGINT,
        default: 1n,
    },
});

let requiresRestart = true;
export default definePlugin({
    name: "MessageTrimmer",
    description: "trims the ends of a message",
    authors: [{ name: "sunnyflops", id: 961709273946161192n }],
    settings,
    requiresRestart,

    start() {
        const MessageActions = findByProps("sendMessage");

        if (!MessageActions?.sendMessage) return;

        OriginalSendMessage = MessageActions.sendMessage;

        MessageActions.sendMessage = (channelId: string, message: any, ...args: any[]) => {
            if (typeof message.content === "string") {

                console.log(message.content);

                const trimAmount = Number(settings.store.trimAmount);

                if (trimAmount > 0) {
                    if (!(message.content.endsWith(">") || message.content.endsWith(":") || beginRegex.test(message.content))) {
                        message.content = message.content.slice(0, -trimAmount);

                        if (message.content === "") {
                            message.content = "_ _";
                        }
                    }
                } else if (trimAmount < 0) {
                    console.log("!!!!!!")
                    let toAppend = ""

                    for (let i = 0; i <= Math.abs(trimAmount); i++) {
                        toAppend = toAppend + letters[Math.floor(Math.random() * letters.length)];
                    }

                    message.content = message.content + toAppend;
                }
            }

            return OriginalSendMessage(channelId, message, ...args);
        };
    },

    // imagine if this kept running even if you disabled the plugin :skull:
    stop() {
        const MessageActions = findByProps("sendMessage");

        if (MessageActions && OriginalSendMessage) {
            MessageActions.sendMessage = OriginalSendMessage;
        }
    }
});
