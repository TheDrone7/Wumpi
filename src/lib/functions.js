const fs = require("fs");
module.exports = (client) => {
    fs.readdir("./handlers/", (err, files) => {
        if (err) console.error(err);
        let handlers = files.filter(f => f.split(".").pop() === "js");
        if (handlers.length <= 0) return console.log("There are no events to load...");
        console.log(`Loading ${handlers.length} events...`);
        handlers.forEach((f, i) => {
            require(`../handlers/${f}`);
            console.log(`${i + 1}: ${f} loaded!`);
        });
    });
};