
let textarea = document.createElement('textarea');
textarea.classList = "use-keyboard-input";
textarea.setAttribute("autofocus", "autofocus");
document.body.prepend(textarea);

const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: "",
        capsLock: false
    },

    init() {
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");

        this.elements.main.classList.add("keyboard");
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.keysContainer.appendChild(this._createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus", () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });
            });
        });
    },

    _createKeys() {
        const fragment = document.createDocumentFragment();
        // const keyLayout = [
        //     "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace",
        //     "tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "|",
        //     "Caps Lock", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter",
        //     "shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?", "UP", "Shift",
        //     "Ctrl", "Fn", "Win", "Alt", "space", "Alt", "Ctrl", "left", "down", "right"
        // ];

        const keyLayoutRu = [
            "ё", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace",
            "tab", "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", "|",
            "Caps Lock", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter",
            "shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".", "UP", "Shift",
            "Ctrl", "Fn", "Win", "Alt", "space", "Alt", "Ctrl", "left", "down", "right"
        ];

        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        keyLayoutRu.forEach(key => {
            const keyElement = document.createElement("button");

            const insertLineBreak = ["backspace", "|", "enter", "Shift"].indexOf(key) !== -1;


            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key");

            switch (key) {
                case "backspace":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("backspace");

                    keyElement.addEventListener("click", () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvent("oninput");
                    });

                    break;

                case "Caps Lock":
                    keyElement.classList.add("keyboard__key--wider", "keyboard__key--activatable");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");

                    keyElement.addEventListener("click", () => {
                        this._toggleCapsLock();
                        keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
                    });

                    break;

                case "tab":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_tab");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += "   ";
                        this._triggerEvent("oninput");
                    });

                    break;

                case "enter":
                    keyElement.classList.add("keyboard__key--wider");
                    keyElement.innerHTML = createIconHTML("keyboard_return");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += "\n";
                        this._triggerEvent("oninput");
                    });

                    break;

                case "space":
                    keyElement.classList.add("keyboard__key--extra-wide");
                    keyElement.innerHTML = createIconHTML("space_bar");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += " ";
                        this._triggerEvent("oninput");
                    });

                    keyElement.addEventListener("keydown", () => {
                        keyElement.classList.add('active');
                    });
                    keyElement.addEventListener("keyup", () => {
                        this.classList.remove('active');
                    });

                    break;

                case "shift":
                    keyElement.classList.add("keyboard__key--wide--shift", "keyboard__key--dark");
                    keyElement.innerHTML = createIconHTML("check_circle");

                    keyElement.addEventListener("click", () => {
                        this.close();
                        this._triggerEvent("onclose");
                    });

                    break;

                case "right":
                    keyElement.classList.add("keyboard__key--narrow");
                    keyElement.innerHTML = createIconHTML("east");

                    break;

                case "UP":
                    keyElement.classList.add("keyboard__key--narrow");
                    keyElement.innerHTML = createIconHTML("arrow_upward");



                    break;

                case "left":
                    keyElement.classList.add("keyboard__key--narrow");
                    keyElement.innerHTML = createIconHTML("west");

                    break;

                case "down":
                    keyElement.classList.add("keyboard__key--narrow");
                    keyElement.innerHTML = createIconHTML("arrow_downward");

                    break;

                case "Shift":
                    keyElement.classList.add("keyboard__key--narrow");
                    keyElement.innerHTML = createIconHTML("expand_less");

                    break;

                case "Ctrl":
                    keyElement.classList.add("keyboard__key--wide--ctrl");
                    keyElement.innerHTML = "Ctrl";

                    break;

                case "Win":
                    keyElement.classList.add("keyboard__key");
                    keyElement.innerHTML = createIconHTML("window");

                    break;

                default:
                    keyElement.textContent = key.toLowerCase();

                    keyElement.addEventListener("click", () => {
                        this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                        this._triggerEvent("oninput");
                    });

                    break;
            }

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
        });

        return fragment;
    },


    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard--hidden");
    },

    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard--hidden");
    }
};



document.querySelector('.use-keyboard-input').onkeydown = function (event) {
    switch (event.key) {
        case "ArrowUp":
            document.querySelector('.keyboard__key--narrow').classList.add('active');
            break;

        case " ":
            document.querySelector('.keyboard__key--extra-wide').classList.add('active');
            break;

        case "Shift":
            document.querySelector('.keyboard__key--wide--shift').classList.add('active');
            break;

        case "Control":
            document.querySelector('.keyboard__key--wide--ctrl').classList.add('active');
            break;

        case event.key:
            event.key.classList.add('active');
            break;

    }
}

document.querySelector('.use-keyboard-input').onkeyup = function (event) {
    switch (event.key) {
        case "ArrowUp":
            document.querySelector('.keyboard__key--narrow').classList.remove('active');
            break;

        case " ":
            document.querySelector('.keyboard__key--extra-wide').classList.remove('active');
            break;

        case "Shift":
            document.querySelector('.keyboard__key--wide--shift').classList.remove('active');
            break;

        case "Control":
            document.querySelector('.keyboard__key--wide--ctrl').classList.remove('active');
            break;
    }
}

window.addEventListener("DOMContentLoaded", function () {
    Keyboard.init();
});

