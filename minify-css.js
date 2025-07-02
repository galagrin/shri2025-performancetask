const CleanCSS = require("clean-css");
const fs = require("fs");

try {
    // Проверяем существование файлов
    if (!fs.existsSync("reset.css")) {
        throw new Error("reset.css not found");
    }
    if (!fs.existsSync("styles.css")) {
        throw new Error("styles.css not found");
    }

    // Читаем CSS файлы
    const resetCSS = fs.readFileSync("reset.css", "utf8");
    const stylesCSS = fs.readFileSync("styles.css", "utf8");

    // Проверяем, что файлы не пустые
    if (!resetCSS.length) {
        throw new Error("reset.css is empty");
    }
    if (!stylesCSS.length) {
        throw new Error("styles.css is empty");
    }

    console.log("Input files size:");
    console.log("reset.css:", resetCSS.length, "bytes");
    console.log("styles.css:", stylesCSS.length, "bytes");

    // Минифицируем
    const minified = new CleanCSS({
        level: {
            1: {
                all: true,
            },
            2: {
                all: true,
            },
        },
    }).minify(resetCSS + stylesCSS);

    // Проверяем результат
    if (minified.errors.length) {
        console.error("Minification errors:", minified.errors);
        throw new Error("Minification failed");
    }

    if (!minified.styles.length) {
        throw new Error("Minification produced empty output");
    }

    console.log("Minification stats:", minified.stats);
    console.log("Output size:", minified.styles.length, "bytes");

    // Сохраняем результат
    fs.writeFileSync("styles.min.css", minified.styles);
    console.log("Successfully saved to styles.min.css");
} catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
}
