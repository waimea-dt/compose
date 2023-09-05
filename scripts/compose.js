function parse() {
    const windows = document.getElementsByTagName('window');

    for (const window of windows) {
        addTagInfo(window);
        addWrappers(window);
        doStyling(window);
        addLabels(window);
        addTimers(window);
        addAnimations(window);
        addIcons(window);
    }

    const articles = document.getElementsByTagName('article');

    for (const article of articles) {
        addStructure(article);
    }
}

//-----------------------------------------------------------------

function addStructure(article) {
    if (article.children.length) {
        const wrapper = document.createElement('div');
        wrapper.className = 'info';

        while(article.children.length) {
            wrapper.append(article.children[0]);
        }

        article.append(wrapper);
    }

    const codeBlocks = article.getElementsByTagName('pre');
    if (codeBlocks.length) {
        const toggle = document.createElement('label');
        toggle.className = 'toggle-code';
        toggle.innerHTML = '<input type="checkbox"><span class="open">See Code</span><span class="close">🗙</span>';

        toggle.append(codeBlocks[0]);
        article.append(toggle);
    }
}


//-----------------------------------------------------------------
// function setWindowSize(window) {
//     for (const attr of window.attributes) {
//         if (attr.name == 'width')  { window.style.width  = `${attr.value}px`; }
//         if (attr.name == 'height') { window.style.height = `${attr.value}px`; }
//     }
// }


//-----------------------------------------------------------------

function addIcons(el) {
    if (el.nodeType != Node.ELEMENT_NODE) { return; }

    if (el.hasAttribute('icon')) {
        const image = el.getAttribute('icon');

        if(image) {
            let icon = document.createElement('img');
            icon.src = 'images/' + image;
            icon.alt = 'Window icon';
            icon.classList.add('win-icon');
            icon.setAttribute('hide-highlight', '');

            el.append(icon);
        }
    }

    var children = el.childNodes;

    children.forEach(child => {
        doStyling(child);
    });
}


//-----------------------------------------------------------------

function addTagInfo(el) {
    if (el.nodeType != Node.ELEMENT_NODE) { return; }

    if (!el.hasAttribute('hide-highlight')) {
        var inf = '';

        if      (el.tagName == 'IMG' && el.hasAttribute('icon')) { inf += "Icon"; }
        else if (el.tagName == 'IMG')                            { inf += "Image"; }
        else if (el.tagName == 'INPUT')                          { inf += "OutlinedTextField"; }
        else                                                     { inf += titleCase(el.tagName); }

        for (const attr of el.attributes) {
            if (attr.name == 'var' && attr.value != '') {
                inf += ` [${attr.value}]`;
            }
            else if (!el.hasAttribute('hide-info')) {
                if      (attr.name == 'id')    { inf += `#${attr.value}`; }
                else if (attr.name == 'class') { inf += `.${attr.value}`; }
                else if (attr.name == 'src')   { inf += `(${attr.value.split(/[\/\.\-]/).at(-2)})`; }
                else if (attr.name == 'style') { continue; }
                else if (attr.name == 'icon')  { continue; }
                else{
                    inf += ` ${kebabToCamelCase(attr.name)}`;
                    if (attr.value != '') {
                        inf += `(${attr.value})`;
                    }
                }
            }
        }

        el.setAttribute('info', inf);
    }

    var children = el.childNodes;

    children.forEach(child => {
        addTagInfo(child);
    });
}


//-----------------------------------------------------------------

function doStyling(el) {
    if (el.nodeType != Node.ELEMENT_NODE) { return; }

    for (const attr of el.attributes) {
        if      (attr.name == 'size')            { el.style.width           = `${attr.value}px`; el.style.maxWidth  = `${attr.value}px`; }
        else if (attr.name == 'width')           { el.style.width           = `${attr.value}px`; el.style.maxWidth  = `${attr.value}px`; }
        else if (attr.name == 'height')          { el.style.height          = `${attr.value}px`; el.style.maxHeight = `${attr.value}px`; }
        else if (attr.name == 'vert-spaced-by')  { el.style.gap             = `${attr.value}px`; }
        else if (attr.name == 'horiz-spaced-by') { el.style.gap             = `${attr.value}px`; }
        else if (attr.name == 'padding')         { el.style.padding         = `${attr.value}px`; }
        else if (attr.name == 'max-lines')       { el.style.maxHeight       = `${attr.value}em`; }
        else if (attr.name == 'content-fit')     { el.style.objectFit       = 'contain'; }
        else if (attr.name == 'content-crop')    { el.style.objectFit       = 'cover'; }
        else if (attr.name == 'font-size')       { el.style.fontSize        = `${attr.value * 1.2}px`; }
        else if (attr.name == 'color')           { el.style.color           = `${attr.value}`; }
        else if (attr.name == 'background')      { el.style.backgroundColor = `${attr.value}`; }
    }

    var children = el.childNodes;

    children.forEach(child => {
        doStyling(child);
    });
}


//-----------------------------------------------------------------

function addWrappers(window) {
    let elements = window.querySelectorAll('input, img');

    for (const el of elements) {
        const wrapper = document.createElement('div');
        wrapper.className = 'wrapper';
        wrapper.setAttribute('info', el.getAttribute('info'));

        const parent = el.parentElement;
        parent.insertBefore(wrapper, el);

        wrapper.append(el);
    }

    elements = window.querySelectorAll('text[max-lines]');

    for (const el of elements) {
        const wrapper = document.createElement('div');
        wrapper.setAttribute('max-lines', el.getAttribute('max-lines'));
        wrapper.innerHTML = el.innerHTML

        el.innerHTML = ''
        el.removeAttribute('max-lines')

        el.append(wrapper)
    }
}


//-----------------------------------------------------------------

function addLabels(window) {
    const inputs = window.getElementsByTagName('input');

    for (const input of inputs) {
        if (input.hasAttribute('label')) {
            input.required = true;

            const label = document.createElement('label');
            label.innerHTML = input.getAttribute('label');

            const parent = input.parentElement;
            parent.append(label);
        }
    }
}


//-----------------------------------------------------------------

function addTimers(window) {
    const timers = window.getElementsByTagName('timer');

    for (const timer of timers) {
        if (timer.hasAttribute('interval') && timer.hasAttribute('target')) {
            const target = document.getElementById(timer.getAttribute('target'));
            const interval = timer.getAttribute('interval');

            if(target) {
                setInterval(() => {
                    var curValue = parseInt(target.innerText);
                    curValue++;
                    target.innerText = curValue;
                    timer.classList.toggle('on');
                }, interval);
            }
        }
    }
}


//-----------------------------------------------------------------

function addAnimations(window) {
    const dialogs   = window.querySelectorAll('[animate-open]');
    const showHides = window.querySelectorAll('[animate-show-hide]');
    const swaps     = window.querySelectorAll('[animate-swap]');
    const typers    = window.querySelectorAll('[animate-typing]');
    const clickers  = window.querySelectorAll('[animate-click]');
    const pressers  = window.querySelectorAll('[animate-press]');
    const sounds    = window.querySelectorAll('[animate-sound]');

    for (const dialog of dialogs) {
        let delay    = dialog.getAttribute('animate-delay');
        let interval = dialog.getAttribute('animate-interval');
        let close    = dialog.getAttribute('animate-close-after');
        if (!delay)    delay = 0;
        if (!interval) interval = 0;
        if (!close)    close = 0;

        // Hide at first
        dialog.close();

        (function repeatLoop() {
            setTimeout(() => {
                dialog.show();
                if (close) {
                    setTimeout(() => {
                        dialog.close();
                    }, close);
                }
            }, delay);

            if (interval) setTimeout(repeatLoop, interval);
        })();
    }

    for (const sound of sounds) {
        let delay    = sound.getAttribute('animate-delay');
        let interval = sound.getAttribute('animate-interval');
        let file     = sound.getAttribute('animate-sound');
        if (!delay)    delay = 0;
        if (!interval) interval = 0;
        if (!file)     return;

        const audio = new Audio('audio/' + file);

        (function repeatLoop() {
            setTimeout(() => {
                audio.play();
            }, delay);

            if (interval) setTimeout(repeatLoop, interval);
        })();
    }

    for (const showHide of showHides) {
        let interval = showHide.getAttribute('animate-interval');
        if (!interval) interval = 500;

        const children = showHide.children;

        // Hide at first
        for (const child of children) {
            child.style.display = 'none';
        }

        let show = 0;
        let offset = 1;

        setInterval(() => {
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                child.style.display = (i < show) ? 'block' : 'none';
            }

            show += offset;
            if (show < 0 || show > children.length) {
                offset *= -1
                show += offset
            }
        }, interval);
    }

    for (const swap of swaps) {
        let interval = swap.getAttribute('animate-interval');
        if (!interval) interval = 500;

        const children = swap.children;

        // Hide all but first
        for (let i = 1; i < children.length; i++) {
            children[i].style.display = 'none';
        }

        let show = 1;

        setInterval(() => {
            for (let i = 0; i < children.length; i++) {
                const child = children[i];

                child.style.display = (i == show) ? 'block' : 'none';
            }
            if (++show >= children.length) show = 0
        }, interval);
    }

    for (const typer of typers) {
        let speed    = typer.getAttribute('animate-typing');
        let delay    = typer.getAttribute('animate-delay');
        let interval = typer.getAttribute('animate-interval');
        if (!speed)    speed = 100;
        if (!delay)    delay = 0;
        if (!interval) interval = 0;

        const text = typer.value;

        (function repeatLoop() {
            typer.value = "";

            setTimeout(() => {
                let show = 0;

                const typist = setInterval(() => {
                    // typer.focus();
                    typer.classList.add('typing');
                    typer.value += text[show++];

                    if (show >= text.length) {
                        clearInterval(typist);
                        setTimeout(() => {
                            typer.classList.remove('typing');
                        }, 1000);
                    }
                }, speed);
            }, delay);


            if (interval) setTimeout(repeatLoop, interval);
        })();
    }

    for (const clicker of clickers) {
        let delay    = clicker.getAttribute('animate-delay');
        let interval = clicker.getAttribute('animate-interval');
        if (!delay)    delay = 0;
        if (!interval) interval = 0;

        (function repeatLoop() {
            setTimeout(() => {
                clicker.classList.add('clicking');
                setTimeout(() => {
                    clicker.classList.remove('clicking');
                }, 300);
            }, delay);

            if (interval) setTimeout(repeatLoop, interval);
        })();
    }

    for (const presser of pressers) {
        let delay    = presser.getAttribute('animate-delay');
        let interval = presser.getAttribute('animate-interval');
        if (!delay)    delay = 0;
        if (!interval) interval = 0;

        // Hide at first
        presser.style.display = 'none';

        (function repeatLoop() {
            setTimeout(() => {
                presser.style.display = 'flex';
                setTimeout(() => {
                    presser.classList.add('pressing');
                    setTimeout(() => {
                        presser.classList.remove('pressing');
                        setTimeout(() => {
                            presser.style.display = 'none';
                        }, 250);
                    }, 1000);
                }, 250);
            }, delay);

            if (interval) setTimeout(repeatLoop, interval);
        })();
    }
}


//-----------------------------------------------------------------

const titleCase = str => `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

const lowerCaseFirst = str => `${str[0].toLowerCase()}${str.slice(1)}`;

const kebabToCamelCase = str => str.split('-').map(word => titleCase(word)).join('');
