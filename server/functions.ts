import { type LocationObject, type openHoursObject } from './interfaces'
import moment, { isDate } from 'moment'

// returns distance (km)
export const getDistance = (Location1: LocationObject, Location2: LocationObject) => {
  if ((Location1.coordinates != null) && (Location2.coordinates != null)) {
    const dy = (+Location1.coordinates[0]) - (+Location2.coordinates[0])
    const dx = (+Location1.coordinates[1]) - (+Location2.coordinates[1])
    const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * 110.574 // im km
    return distance
  } else {
    return 0
  }
}

export const makeid = (length: number) => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let counter = 0
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  return result
}

export const getSeconds = (addDay: boolean) => {
  if (addDay) return (+moment() - +moment().startOf('day')) / 1000 + 86400
  return (+moment() - +moment().startOf('day')) / 1000
}

export const isOpen = (openHoursObject: openHoursObject, hasCloseNextDay: boolean) => {
  const time = getSeconds(hasCloseNextDay)
  if (time < openHoursObject.closedFrom && time > openHoursObject.openFrom) return true
  return false
}

export const timeToSecondsFromStartOfDay = (time: string, isNextDay: boolean) => {
  try {
    const timeAndDate = moment('2023031' + 'T' + time)
    let asd = ((+timeAndDate - +timeAndDate.startOf('day')) / 1000)
    if (isNextDay) {
      asd += 86400
    }
    return asd
  } catch {

  }
}
