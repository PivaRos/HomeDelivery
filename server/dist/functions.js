"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeToSecondsFromStartOfDay = exports.isOpen = exports.getSeconds = exports.makeid = exports.getDistance = void 0;
const moment_1 = __importDefault(require("moment"));
//returns distance (km)
const getDistance = (Location1, Location2) => {
    const dy = (+Location1.coordinates[0]) - (+Location2.coordinates[0]);
    const dx = (+Location1.coordinates[1]) - (+Location2.coordinates[1]);
    const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * 110.574;
    return distance;
};
exports.getDistance = getDistance;
const makeid = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
};
exports.makeid = makeid;
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
