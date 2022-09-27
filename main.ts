clockFont.setColor(0x808000)
basic.forever(function () {
    ds3231.getClock()
    clockFont.showClock(ds3231.getClockData(clockData.hour), ds3231.getClockData(clockData.minute), ds3231.getClockData(clockData.second))
    basic.pause(100)
})
