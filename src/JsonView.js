export class JsonView extends HTMLElement {
    constructor() {
        super()

        var style = document.createElement("style")
        document.head.appendChild(style)
        style.sheet.insertRule(`:root {
            --wjv-color-triangle: lightgray;
            --wjv-color-hover-triangle: darkred;
            --wjv-child-padding: 15px;
        }`)

        this.attachShadow({ mode: 'open'})

        this.isOpened = false
        this.key = null

        const template = document.createElement('template')
        template.innerHTML = `  
            <style>
            .node {
                display: inline-block;
                width: 0;
                margin: 2px;
                height: 0;
                border-style: solid;
                border-width: 6px 3.5px 0 3.5px;
                border-color: var(--wjv-color-triangle) transparent transparent transparent;
                transition: transform 0.3s, border-color 0.4s;
                transform: rotate(-90deg);
            }
            .toggle:hover .node {
                border-color: var(--wjv-color-hover-triangle) transparent transparent transparent;
            }
            .node.opened {
                transform: rotate(0deg);
            }            
            .watermark {
                font-size: smaller;
                color: gray;
                margin-left: 10px;
            }        
            .hidden {
                display: none;
            }
            .invisible {
                opacity: 0;
            }
            #container {
                margin-left: var(--wjv-child-padding);
            }    
            #container.root {
                margin-left: 0px;
            }
            </style>
        ` 

        this.objectTemplate =  ` 
            <div id="objectOpener" class="toggle">         	
                <div id="node" class="node"> </div>
                <span id="key"></span>
                <span class="watermark" v-show="!isOpen"><span id="propCount"></span> Eigenschaft(en)</span>
            </div>        
            <div id="container"></div>
        `
        this.arrayTemplate =  ` 
            <div id="arrayOpener" class="toggle">         	
                <div id="node" class="node"> </div>
                <span id="key"></span>
                <span class="watermark" v-show="!isOpen"><span id="propCount"></span> Einträg(e)</span>
            </div>        
            <div id="container"></div>
        `
        this.valueTemplate =  ` 
            <div>
                <span class="node invisible"> </span>
                <span id="key"></span>       
                <span>: </span>
                <span id="value"></span>
            </div>
        `

        this.autoOpen = parseInt(this.getAttribute("auto-open") || 0)
        console.log("autoOpen", this.autoOpen)

        const rootElement = template.content.cloneNode(true)
        this.shadowRoot.appendChild(rootElement)
    }

    /**
     * @param {any} value
     */
    set data(value) {
        this._value = value
        if (isArray(value)) 
            this.fillArray(value)
        else if (isObject(value)) 
            this.fillObject(value)
        else if (isValue(value)) 
            this.fillValue(value)
    }
    get data() { 
        return this._value
    }    

    fillObject(data) {
        const contentTemplate = document.createElement('template')
        contentTemplate.innerHTML = this.objectTemplate
        this.shadowRoot.appendChild(contentTemplate.content.cloneNode(true))
        const propCount = this.shadowRoot.getElementById("propCount")
        propCount.innerText = Object.keys(data).length
        const objectOpener = this.shadowRoot.getElementById("objectOpener")
        const node = this.shadowRoot.getElementById("node")
        const container = this.shadowRoot.getElementById("container")
        const key = this.shadowRoot.getElementById("key")
        key.innerText = this.key

        objectOpener.onclick = () => {
            this.isOpened = !this.isOpened
            if (this.isOpened) {
                node.classList.add("opened")
                const props = Object.keys(this.data)
                props.forEach(key => {
                    const jsonView = new JsonView()
                    jsonView.autoOpen = this.autoOpen
                    container.appendChild(jsonView)
                    jsonView.setData(key, this.data[key])
                })
            }
            else {
                node.classList.remove("opened")
                for (let i = container.children.length -1; i >= 0; i--)
                    container.removeChild(container.children[i])
            }
        }

        if (!this.key && this.key != 0) {
            objectOpener.click()    
            objectOpener.classList.add("hidden")
            container.classList.add("root")
        } else if (Object.keys(data).length < this.autoOpen)
            objectOpener.click()    
    }

    fillArray(data) {
        const contentTemplate = document.createElement('template')
        contentTemplate.innerHTML = this.arrayTemplate
        this.shadowRoot.appendChild(contentTemplate.content.cloneNode(true))
        const propCount = this.shadowRoot.getElementById("propCount")
        propCount.innerText = data.length
        const arrayOpener = this.shadowRoot.getElementById("arrayOpener")
        const node = this.shadowRoot.getElementById("node")
        const container = this.shadowRoot.getElementById("container")
        const key = this.shadowRoot.getElementById("key")
        key.innerText = this.key

        arrayOpener.onclick = () => {
            this.isOpened = !this.isOpened
            if (this.isOpened) {
                node.classList.add("opened")
                this.data.forEach((n, i) => {
                    const jsonView = new JsonView()
                    jsonView.autoOpen = this.autoOpen
                    container.appendChild(jsonView)
                    jsonView.setData(i, n)
                })
            }
            else {
                node.classList.remove("opened")
                for (let i = container.children.length -1; i >= 0; i--)
                    container.removeChild(container.children[i])
            }
        }

        if (!this.key) {
            arrayOpener.click()    
            arrayOpener.classList.add("hidden")
            container.classList.add("root")
        } else if (data.length < this.autoOpen)
            arrayOpener.click()    
    }

    setData(key, value) {
        this.key = typeof key == "string" ? `"${key}"` : key
        this.data = value
    }

    fillValue(data) {
        const contentTemplate = document.createElement('template')
        contentTemplate.innerHTML = this.valueTemplate
        this.shadowRoot.appendChild(contentTemplate.content.cloneNode(true))
        const key = this.shadowRoot.getElementById("key")
        key.innerText = this.key
        const value = this.shadowRoot.getElementById("value")
        value.innerText = typeof data == "string" ? `"${data}"` : data
    }
}

function isObject(value) {
    return !isArray(value) && value instanceof Object
}

function isArray(value) {
    return Array.isArray(value)
}

function isValue(value) {
    return !isObject(value) && !isArray(value)
}        

customElements.define('json-view', JsonView)
