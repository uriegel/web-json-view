import '../src/JsonView.js'

const jsonView = document.getElementById("jsonView")

setTimeout(() => jsonView.data = {
    name: "Uwe Riegel",
    id: "08/15",
    datum: "21.05.2019 17:23",
    objekt: {
        nummer: 8908998,
        users: [
            { name: "Uwe", email: "uriegel@hotmail.de" },
            { name: "Paul", email: "paul@hotmail.de" },
            { name: "Masta Killa", email: "masta@hotmail.de" }
        ],
        name: "Objektname"
    },
    items: [
        12, 34, 45, 657, 768, 789, 890, 
    ]
}, 2000)