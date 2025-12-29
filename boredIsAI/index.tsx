/*
* hi im a plugin
* the top thing didn't generate so like
* do not sell me?
*/

import definePlugin from "@utils/types";

// https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
let observer: MutationObserver | null = null;

function boredify(root: ParentNode = document) {
    const elements = root.querySelectorAll<HTMLElement>(
        `.c19a557985eb7793-messageContent`
    );

    for (const el of elements) {
        const spans = el.querySelectorAll("span")
        for (let i = 0; i < spans.length; i++) {
            if (!spans[i].classList.contains("_75abce0dd8453367-emojiContainer") || !spans[i].classList.contains("c19a557985eb7793-timestamp")) {
                const text = spans[i].textContent ?? "";
                const parts = text.split(/(\bai\b)/gi); // this will replace ai with the extra span eventually

                if (parts.length > 1) {
                    const fragment = document.createDocumentFragment();

                    parts.forEach(part => {
                        if (/^ai$/i.test(part)) {
                            // create emoji span
                            const emojiSpan = document.createElement("span");
                            emojiSpan.className = "_75abce0dd8453367-emojiContainer _75abce0dd8453367-emojiContainerClickable";
                            emojiSpan.innerHTML = `<img class="emoji" data-type="emoji" data-name=":question:" alt="❓" draggable="false" src="/assets/881ed827548f38c6.svg">`; // emoji url will match when on discord
                            fragment.appendChild(emojiSpan);
                        } else if (part.length > 0) {
                            // normal text span
                            const textSpan = document.createElement("span");
                            textSpan.textContent = part;
                            fragment.appendChild(textSpan);
                        }
                    });
                    spans[i].replaceWith(fragment); // replace old span with new replaced thing
                }
            }
        }
    }
}

// totally not reused from the evil colour plugin :)
export default definePlugin({
    name: "BoredIsAI",
    description: "replaces all instances of 'ai' with ':bored:'",
    authors: [{ name: "sunnyflops", id: 961709273946161192n }],

    start() {
        boredify();

        observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (!(node instanceof HTMLElement)) continue;
                    setTimeout(() => boredify(), 0.001);
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });
    },

    stop() {
        observer?.disconnect();
        observer = null;
    }
});

// <span class="_75abce0dd8453367-emojiContainer _75abce0dd8453367-emojiContainerClickable" aria-expanded="false" role="button" tabindex="0"><img class="emoji" data-type="emoji" data-name=":question:" alt="❓" draggable="false" src="/assets/881ed827548f38c6.svg"></span>
