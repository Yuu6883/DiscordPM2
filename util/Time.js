const SEC = 1000;
const MIN = 60 * SEC;
const HR  = 60 * MIN;
const DAY = 24 * HR;
const WK  = 7  * DAY;
const MTH = 30 * DAY;
const YR  = 365 * DAY;

module.exports = {
    short: ms => {
        if (ms < SEC) return `${ms} MS`;
        if (ms < MIN) return `${Math.round(ms / SEC)} Sec`;
        if (ms < HR)  return `${Math.round(ms / MIN)} Min`;
        if (ms < DAY) return `${(ms / HR).toFixed(1)} Hr`;
        if (ms < WK)  return `${(ms / DAY).toFixed(1)} Day`;
        if (ms < MTH) return `${(ms / DAY).toFixed(1)} Day`;
        if (ms < YR)  return `${(ms / MTH).toFixed(1)} Mth`;
        return `${(ms / YR).toFixed(2)} Yr`;
    }
}