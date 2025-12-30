/*
* plugin plugin plugin plugin plugin plugin!
*/

import definePlugin, { OptionType, PluginNative } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const commandHelper = VencordNative.pluginHelpers.DevVencordUpdater as PluginNative<typeof import("./native")>;

const settings = definePluginSettings({
    startExclusive: {
        description: "Only check on discord start?",
        type: OptionType.BOOLEAN,
        default: false,
    },
    checkFrequency: {
        description: "Frequency to check for updates (minutes)",
        type: OptionType.NUMBER,
        default: 240,
        disabled: () => settings.store.startExclusive
    }
});

let requiresRestart = true;
export default definePlugin({
    name: "DevVencordUpdater",
    description: "checks for updates on vencord github and updates development builds",
    authors: [{ name: "sunnyflops", id: 961709273946161192n }],
    settings,
    requiresRestart,

    async checkUpdates() {
        if (!commandHelper) {
            console.log("helper did not load");
            setTimeout(() => this.checkUpdates(), 1000);
            return;
        }

        console.log("checking for updates");
        await commandHelper.checkForUpdates();
    },

    start() {
        console.log("start!")
        this.checkUpdates();

        if (!settings.store.startExclusive) {
            this.updateInterval = setInterval(() => { this.checkUpdates(); }, settings.store.checkFrequency * 60 * 1000); // if this isnt minutes please tell me
        }
    },

    stop() {
        clearInterval(this.updateInterval);
    }
});
