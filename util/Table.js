// const top    = (kl, vl) => "┏" + "━".repeat(kl + vl + 2) + "┓";
// const middle = (kl, vl) => "┣" + "━".repeat(kl + vl + 2) + "┫";
// const bottom = (kl, vl) => "┗" + "━".repeat(kl + vl + 2) + "┛";

/** @param {Object.<string, string|number>} obj */
module.exports = obj => {

    let keys   = Object.keys(obj);
    let values = Object.values(obj).map(v => String(v));

    let longestKey   = Math.max(  ...keys.map(k => k.length));
    let longestValue = Math.max(...values.map(v => v.length));

    keys   =   keys.map(k => k[0].toUpperCase() + k.slice(1) + " ".repeat(longestKey   - k.length));
    values = values.map(v => v[0].toUpperCase() + v.slice(1) + " ".repeat(longestValue - v.length));

    return keys.map((k, i) => k + ": " + values[i]).join("\n");
}