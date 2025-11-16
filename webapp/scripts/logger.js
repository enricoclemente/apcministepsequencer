function createLogger(moduleName, opts = {}) {
    const colors = Object.assign({
        info: "dodgerblue",
        warn: "goldenrod",
        error: "crimson",
        debug: "violet"
    }, opts.colors);

    const enabled = Object.assign({
        info: true,
        warn: true,
        error: true,
        debug: true
    }, opts.enabled);

    function formatPrefix(level, fnName) {
        const prefix = `%c[${level.toUpperCase()}] %c[${moduleName}] %c(${fnName}) %c`;
        const styles = [
            `font-weight:700; color:${colors[level]};`,     // level (colorato)
            "font-weight:700; color:#6b7280;",              // module (grigio)
            "font-weight:700; color:orange;",               // function name (arancione)
            "color:inherit;"                                // message (default)
        ];
        return { prefix, styles };
    }

    function baseLog(level, fnName, message, ...meta) {
        if (!enabled[level]) return;

        // accetta sia message string che oggetti, fallback se chiamato male
        if (typeof fnName !== "string") {
            // se per errore passano message come primo arg, proviamo ad adattare:
            meta = [message, ...meta];
            message = fnName;
            fnName = "anonymous";
        }

        const { prefix, styles } = formatPrefix(level, fnName);
        // stampo: prefix + message; poi passo meta come argomenti separati
        // uso %o nel caso vogliamo che console tratti bene gli oggetti: ma
        // lasciamo che console gestisca gli argomenti (più flessibile).
        console.log(prefix + "%c" + message, ...styles, "font-weight:normal;", ...meta);
    }

    return {
        info(fnName, message, ...meta) { baseLog("info", fnName, message, ...meta); },
        warn(fnName, message, ...meta) { baseLog("warn", fnName, message, ...meta); },
        error(fnName, message, ...meta) { baseLog("error", fnName, message, ...meta); },
        debug(fnName, message, ...meta) { baseLog("debug", fnName, message, ...meta); },

        // util per abilitare/disabilitare livelli a runtime
        enable(level) { if (level in enabled) enabled[level] = true; },
        disable(level) { if (level in enabled) enabled[level] = false; }
    };
}
