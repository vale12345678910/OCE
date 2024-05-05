


class MyEditor extends HTMLElement {
    // The browser calls this method when the element is
    // added to the DOM.
    connectedCallback() {
        let v = this.getAttribute("value")
        this.innerHTML = `<div class="editor">${v}</div>`;
        let element = this.querySelector(".editor")
        var editor = ace.edit(element);
        editor.setTheme("ace/theme/twilight");
        editor.session.setMode("ace/mode/javascript");

    }
}




customElements.define('my-editor', MyEditor);