"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeToSecondsFromStartOfDay = exports.isOpen = exports.getSeconds = exports.getDistance = void 0;
const moment_1 = __importDefault(require("moment"));
// returns distance (km)
const getDistance = (Location1, Location2) => {
    const longAndLatToKm = 110.574;
    if ((Location1.coordinates != null) && (Location2.coordinates != null)) {
        const dy = (+Location1.coordinates[0]) - (+Location2.coordinates[0]);
        const dx = (+Location1.coordinates[1]) - (+Location2.coordinates[1]);
        // im km
        return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * longAndLatToKm;
    }
    else {
        return 0;
    }
};
exports.getDistance = getDistance;
const getSeconds = (addDay) => {
    if (addDay)
        return (+(0, moment_1.default)() - +(0, moment_1.default)().startOf('day')) / 1000 + 86400;
    return (+(0, moment_1.default)() - +(0, moment_1.default)().startOf('day')) / 1000;
};
exports.getSeconds = getSeconds;
const isOpen = (openHoursObject, hasCloseNextDay) => {
    const time = (0, exports.getSeconds)(hasCloseNextDay);
    if (time < openHoursObject.closedFrom && time > openHoursObject.openFrom)
        return true;
    return false;
};
exports.isOpen = isOpen;
const timeToSecondsFromStartOfDay = (time, isNextDay) => {
    try {
        var timeAndDate = (0, moment_1.default)("2023031" + 'T' + time);
        var asd = ((+timeAndDate - +timeAndDate.startOf('day')) / 1000);
        if (isNextDay) {
            asd += 86400;
        }
        return asd;
    }
    catch (_a) {
    }
};
exports.timeToSecondsFromStartOfDay = timeToSecondsFromStartOfDay;
