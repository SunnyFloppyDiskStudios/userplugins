/*
* hi im a plugin
* the top thing didn't generate so like
* do not sell me?
*
* partially uses code from other discord plugins included with vencord
* */

import { definePluginSettings } from "@api/Settings";
import { classNameFactory } from "@api/Styles";
import { HeadingSecondary } from "@components/Heading";
import { Paragraph } from "@components/Paragraph";
import definePlugin, { OptionType } from "@utils/types";
import { ColorPicker } from "@webpack/common";

const cl = classNameFactory("vc-evilPurpleBlocker-");

const colorPalette = [
    "#400ee6", // Evil Purple
    "#f8312f", // Red
    "#ff6723", // Orange
    "#fcd53f", // Yellow
    "#00d26a", // Green
    "#00dcff", // Light Blue
    "#0074ba", // Blue
    "#8d65c5", // Purple
    "#ff4bfc", // Hot Pink
    "#ff98e7", // Pastel Pink
    "#6d4534", // Brown
    "#9c3a49", // Brick Red
    "#4a412a", // Schlorange (PANTONE 448C)
    "#ffffff", // White
    "#000000", // Black
];

const nums = "64, 14, 230"

function SettingsColourPicker({ name, description, settingName, suggestedColors }: { name: string, description: string, settingName: string, suggestedColors: string[]; }) {
    function onChange(color: number) {
        settings.store[settingName] = color.toString(16).padStart(6, "0");
        applyColor();
    }

    return (
        <div className={cl("settings")}>
            <div className={cl("container")}>
                <div className={cl("settings-labels")}>
                    <HeadingSecondary>{name}</HeadingSecondary>
                    <Paragraph>{description}</Paragraph>
                </div>
                <ColorPicker
                    color={parseInt(settings.store[settingName], 16)}
                    onChange={onChange}
                    suggestedColors={suggestedColors}
                />
            </div>
        </div>
    );
}

function OverrideColourPicker() {
    return <SettingsColourPicker name="Override Colour" description="The colour to replace Targetted Colours with" settingName="overrideColour" suggestedColors={colorPalette} />;
}

const settings = definePluginSettings({
    targetColours: {
        description: "Colours to filter (hex) (separate however and # is optional)", // gonna set it up so it gets every 6 character group after filtering out stuff like '#' or ',' or ' '
        type: OptionType.STRING,
        default: "400ee6",
    },
    overrideColour: {
        type: OptionType.COMPONENT,
        default: "ffffff",
        component: OverrideColourPicker,
    },
});

// https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
let observer: MutationObserver | null = null;

function applyColor(root: ParentNode = document) {
    const elements = root.querySelectorAll<HTMLElement>(
        `.c19a557985eb7793-username, ._703b91fc872193e8-nameContainer, .vc-typing-user, .f61d60ed65f9a128-wrapper, .mention, ._752971923a1e6683-roleMention, ._07f9193042954787-usernameFont, ._07f9193042954787-username, ._4bd5201c86a2042b-defaultColor, .b8880176888cc928-text`
    );

    for (const el of elements) {
        const comp = getComputedStyle(el)

        if (comp.color.includes(nums)) {
            el.style.setProperty("color", "#" + settings.store.overrideColour, "important")
        }

        if (comp.backgroundColor.includes(nums)) {
            el.style.setProperty("background-color", "#" + settings.store.overrideColour + "22", "important") // transparency for pings background
        }
    }
}

export default definePlugin({
    name: "EvilColourBlocker",
    description: "blocks colours and replaces them",
    authors: [{ name: "arlocomotive", id: 772797877118435358n }, { name: "sunnyflops", id: 961709273946161192n }],
    settings,

    start() {
        applyColor();

        observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (!(node instanceof HTMLElement)) continue;
                    setTimeout(() => applyColor(), 0.001);
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });
    },

    // imagine if this kept running even if you disabled the plugin :skull:
    stop() {
        observer?.disconnect();
        observer = null;
    }
});
