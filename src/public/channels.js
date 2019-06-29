function InitAllChannels() {
    let bodyObject = document.getElementById("MainPanel");
    let ChannelSelection = document.createElement("select");
    for (let i = 0; i < channels.length; i++) {
        let newOption = document.createElement('option');
        newOption.value = channels[i].ID;
        newOption.text = channels[i].Name;
        ChannelSelection.add(newOption);
    }
    bodyObject.appendChild(ChannelSelection);
}