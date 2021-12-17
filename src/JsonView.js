export class JsonView extends HTMLElement {
    constructor() {
        super()

        var style = document.createElement("style")
        document.head.appendChild(style)
        style.sheet.insertRule(`:root {
            --vtc-color: black;
        }`)

        this.attachShadow({ mode: 'open'})

        const template = document.createElement('template')
        template.innerHTML = `  
            <style>
            </style>
            <div class="tableroot" tabIndex=1>
            </div>
        ` 
        this.shadowRoot.appendChild(template.content.cloneNode(true))
    }
}

customElements.define('json-view', JsonView)