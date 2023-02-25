"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeid = exports.getDistance = void 0;
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
