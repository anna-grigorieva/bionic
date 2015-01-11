var
    fieldCanvas = document.getElementById("field"),
    settingsForm = document.getElementById("settings").elements,
    startBtn = document.getElementById("startButton"),
    settings = {},
    i;

VIEW = VIEW(fieldCanvas);

startBtn.onclick = function () {
    for (i in settingsForm) {
        settings[i] = settingsForm[i].value;
    }
    settings.moveTime *= 1000;

    CONTROLLER(settings).startGame();
};