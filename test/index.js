import '../src/JsonView.js'

const jsonView = document.getElementById("jsonView")

setTimeout(() => jsonView.data = {
    name: "Uwe Riegel",
    id: "08/15",
    datum: "21.05.2019 17:23",
    objekt: {
        name: "Objketname",
        nummer: "8908998"
    }
}, 2000)