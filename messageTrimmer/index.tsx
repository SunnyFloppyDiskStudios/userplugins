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
                const trimAmount = Number(settings.store.trimAmount);

                if (trimAmount > 0) {
                    message.content = message.content.slice(0, -trimAmount);
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
