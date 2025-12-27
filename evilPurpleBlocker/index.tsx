/*
* hi im a plugin
* the top thing didn't generate so like
* do not sell me?
*
* partially uses code from other discord plugins included with vencord
* */

import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";
import { classNameFactory } from "@api/Styles";
import { ColorPicker, Forms } from "@webpack/common";

const cl = classNameFactory("vc-funnyplugin-");

const targetOne = "c19a557985eb7793-username"
const targetTwo = "_703b91fc872193e8-nameContainer"

const evil = "rgb(64, 14, 230)"

function onPickColour(color: number) {
    settings.store.overrideColour = color.toString(16).padStart(6, "0");
}

export function ColourPicker() {
    return (
        <div className={cl("settings")}>
            <div className={cl("container")}>
                <div className={cl("settings-labels")}>
                    <Forms.FormTitle tag="h3">New Colour</Forms.FormTitle>
                    <Forms.FormText>new colour thing (ctrl+r/cmd+r/reload/re-open discord to apply)</Forms.FormText>
                </div>

                <ColorPicker // woah it's a colour picker!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    color={parseInt(settings.store.overrideColour, 16)}
                    onChange={onPickColour}
                    showEyeDropper={false}
                    suggestedColors={[ "#FFFFFF" ]}
                />
            </div>
        </div>
    );
}

const settings = definePluginSettings({
    overrideColour: {
        type: OptionType.COMPONENT,
        default: "FFFFFF",
        component: ColourPicker
    },
});

// https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver

let observer: MutationObserver | null = null;

function applyColor(root: ParentNode = document) {
    const elements = root.querySelectorAll<HTMLElement>(
        `.${targetOne}, .${targetTwo}`
    );

    for (const el of elements) {
        if (el.style.color == evil) {
            el.style.color = "#" + settings.store.overrideColour;
        }
    }
}

export default definePlugin({
    name: "evil purple blocker",
    description: "only blocks evil purple (too hard to make it support other colours)",
    authors: [{ name: "SunnyFlops", id: 961709273946161192n }],
    settings,

    start() {
        console.log(settings.store.overrideColour)
        applyColor();

        observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (!(node instanceof HTMLElement)) continue;

                    if (node.classList.contains(targetOne) || node.classList.contains(targetTwo)) {
                        if (node.style.color == evil) {
                            node.style.color = "#" + settings.store.overrideColour;
                        }
                    }
                    applyColor(node);
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    },

    // does this actually work? i don't know...
    stop() {
        observer?.disconnect();
        observer = null;
    }
});
