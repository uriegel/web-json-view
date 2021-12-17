export class JsonView extends HTMLElement {
    constructor() {
        super()

        var style = document.createElement("style")
        document.head.appendChild(style)
        style.sheet.insertRule(`:root {
            --vtc-color: black;
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
                border-color: rgb(92, 92, 92) transparent transparent transparent;
                transition: transform 0.2s;
                transform: rotate(-90deg);
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
            #container {
                margin-left: 30px;
            }    
            #container.root {
                margin-left: 0px;
            }
            </style>
        ` 

        this.childTemplate =  ` 
            <json-view id="jsonView"></json-view>
        `

        this.objectTemplate =  ` 
            <div id="objectOpener" class="toggle" v-if="!isRoot(data)">         	
                <div id="node" class="node"> </div>
                <span id="key"></span>
                <span class="watermark" v-show="!isOpen"><span id="propCount"></span> Eigenschaft(en)</span>
            </div>        
            <div id="container"></div>
        `
        this.valueTemplate =  ` 
            <div>
                <span class="bull">&bull;</span>
                <span id="key"></span>       
                <span>: </span>
                <span id="value"></span>
            </div>
        `
        const rootElement = template.content.cloneNode(true)
        this.shadowRoot.appendChild(rootElement)
    }

    /**
     * @param {any} value
     */
    set data(value) {
        this._value = value
        if (isObject(value)) 
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
                    container.appendChild(jsonView)
                    jsonView.setData(key, this.data[key])

                    // const childTemplate = document.createElement('template')
                    // childTemplate.innerHTML = this.childTemplate
                    // const jsonView = childTemplate.content.getElementById("jsonView")
                    // setTimeout(() => {
                    //     console.log("mist", jsonView)
                    //     jsonView.setData(key, this.data[key])

                    // }, 2000)
                    
                    // const node = childTemplate.content.cloneNode(true)
                    // container.appendChild(node)
                })
            }
            else {
                node.classList.remove("opened")
                for (let i = container.children.length -1; i >= 0; i--)
                    container.removeChild(container.children[i])
            }
        }

        if (!this.key) {
            objectOpener.click()    
            objectOpener.classList.add("hidden")
            container.classList.add("root")
        }
    }

    setData(key, value) {
        this.key = key
        this.data = value
    }

    fillValue(data) {
        const contentTemplate = document.createElement('template')
        contentTemplate.innerHTML = this.valueTemplate
        this.shadowRoot.appendChild(contentTemplate.content.cloneNode(true))
        const key = this.shadowRoot.getElementById("key")
        key.innerText = this.key
        const value = this.shadowRoot.getElementById("value")
        value.innerText = data
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
// TODO array
// TODO number: without ""
// TODO strings with ""
// TODO property names with ""
// TODO array indexes without ""
// TODO Style bullet and node triangle color