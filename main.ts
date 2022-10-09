radio.onReceivedNumber(function (receivedNumber) {
    changeColor(receivedNumber)
})
function changeBrightness (No: number) {
    if (No == 1) {
        brightness = brightness / 2
    } else {
        brightness = brightness * 2
    }
    brightness = Math.constrain(brightness, 1, 255)
    watchfont.showSorobanNumber(brightness, 0, 5)
}
radio.onReceivedValue(function (name, value) {
    if (name == "v") {
        changeBrightness(value)
    } else if (name == "d") {
        changeDisplay(value)
    }
})
function changeDisplay (displayMode: number) {
    display = displayMode
    watchfont.showNumber2(displayMode)
}
function changeColor (colorNo: number) {
    if (display == 1) {
        clockColor = colorList[colorNo]
        watchfont.showSorobanNumber(clockColor, 0, 5)
    } else {
        for (let カウンター = 0; カウンター <= 5; カウンター++) {
            if (カウンター >= colorNo - 1) {
                limitList[カウンター] = 0
            } else {
                limitList[カウンター] = 1
            }
        }
    }
}
let buttonNo = 0
let display = 0
let clockColor = 0
let brightness = 0
let limitList: number[] = []
let colorList: number[] = []
pins.digitalWritePin(DigitalPin.P2, 0)
pins.setPull(DigitalPin.P8, PinPullMode.PullUp)
pins.setPull(DigitalPin.P12, PinPullMode.PullUp)
pins.setPull(DigitalPin.P13, PinPullMode.PullUp)
radio.setGroup(1)
colorList = [
neopixel.rgb(255, 200, 0),
neopixel.rgb(255, 72, 0),
neopixel.colors(NeoPixelColors.Red),
neopixel.rgb(255, 64, 64),
neopixel.colors(NeoPixelColors.Green),
neopixel.colors(NeoPixelColors.Blue),
neopixel.colors(NeoPixelColors.White),
neopixel.colors(NeoPixelColors.Violet)
]
limitList = [
0,
0,
0,
0,
0,
0
]
brightness = 32
clockFont.setBrightness(brightness)
clockColor = colorList[1]
clockFont.setColor(clockColor)
display = 1
basic.forever(function () {
    if (display == 1) {
        ds3231.getClock()
        clockFont.setColor(clockColor)
        clockFont.showClock(ds3231.getClockData(clockData.hour), ds3231.getClockData(clockData.minute), ds3231.getClockData(clockData.second))
    } else {
        clockFont.clearColumn(0, 64)
        for (let カウンター = 0; カウンター <= 5; カウンター++) {
            clockFont.setColor(colorList[カウンター])
            clockFont.displayNumber(Math.constrain(カウンター * 11, 0, 54), limitList[カウンター], 10)
        }
        clockFont.show()
    }
    buttonNo = 0
    buttonNo = buttonNo + (1 - pins.digitalReadPin(DigitalPin.P8)) * 1
    buttonNo = buttonNo + (1 - pins.digitalReadPin(DigitalPin.P12)) * 2
    buttonNo = buttonNo + (1 - pins.digitalReadPin(DigitalPin.P13)) * 4
    if (buttonNo > 0) {
        if (input.buttonIsPressed(Button.A)) {
            changeBrightness(buttonNo)
        } else if (input.buttonIsPressed(Button.B)) {
            changeDisplay(buttonNo)
        } else {
            changeColor(buttonNo)
        }
    }
    basic.pause(100)
})
