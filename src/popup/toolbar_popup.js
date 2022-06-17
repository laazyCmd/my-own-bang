const goToSettings = () => {
    window.open(browser.runtime.getURL("settings.html"), "_blank");
    window.close();
}

document.getElementById("settings").addEventListener("click", goToSettings);