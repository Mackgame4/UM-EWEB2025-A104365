const TCOLORS = {
    GREEN: "\x1b[32m%s\x1b[0m",
    RED: "\x1b[31m%s\x1b[0m",
    YELLOW: "\x1b[33m%s\x1b[0m",
    BLUE: "\x1b[34m%s\x1b[0m",
    MAGENTA: "\x1b[35m%s\x1b[0m",
    CYAN: "\x1b[36m%s\x1b[0m",
    WHITE: "\x1b[37m%s\x1b[0m",
    RESET: "\x1b[0m",
    BG_RED: "\x1b[41m%s\x1b[0m",
    BG_GREEN: "\x1b[42m%s\x1b[0m",
    BG_YELLOW: "\x1b[43m%s\x1b[0m",
    BG_BLUE: "\x1b[44m%s\x1b[0m",
    BG_MAGENTA: "\x1b[45m%s\x1b[0m",
    BG_CYAN: "\x1b[46m%s\x1b[0m",
    BG_WHITE: "\x1b[47m%s\x1b[0m",
    BG_RESET: "\x1b[49m",
    BOLD: "\x1b[1m%s\x1b[0m",
    UNDERLINE: "\x1b[4m%s\x1b[0m",
    INVERSE: "\x1b[7m%s\x1b[0m",
    STRIKETHROUGH: "\x1b[9m%s\x1b[0m"
};

module.exports = { TCOLORS };