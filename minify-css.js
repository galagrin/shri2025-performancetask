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
    if (!fs.existsSync("vendors/bootstrap.css")) {
        throw new Error("vendors/bootstrap.css not found");
    }

    // Читаем CSS файлы
    const resetCSS = fs.readFileSync("reset.css", "utf8");
    let stylesCSS = fs.readFileSync("styles.css", "utf8");
    const bootstrapCSS = fs.readFileSync("vendors/bootstrap.css", "utf8");

    // Удаляем строку импорта bootstrap из styles.css
    stylesCSS = stylesCSS.replace(/@import\s+url\(["']?vendors\/bootstrap\.css["']?\);\s*/g, "");

    // Проверяем, что файлы не пустые
    if (!resetCSS.length) {
        throw new Error("reset.css is empty");
    }
    if (!stylesCSS.length) {
        throw new Error("styles.css is empty");
    }
    if (!bootstrapCSS.length) {
        throw new Error("vendors/bootstrap.css is empty");
    }

    console.log("Input files size:");
    console.log("reset.css:", resetCSS.length, "bytes");
    console.log("styles.css:", stylesCSS.length, "bytes");
    console.log("vendors/bootstrap.css:", bootstrapCSS.length, "bytes");

    // Объединяем все CSS
    const combinedCSS = resetCSS + stylesCSS + bootstrapCSS;

    // Минифицируем
    const minified = new CleanCSS({
        level: {
            1: { all: true },
            2: { all: true },
        },
    }).minify(combinedCSS);

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
