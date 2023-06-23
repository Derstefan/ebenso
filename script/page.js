function showModal(element) {
    var modalText;
    var modalWindow = document.getElementById("modal");
    var modalContent = document.getElementById("modal-content");
    for (var i = 0; i < element.childNodes.length; i++) {
        if (element.childNodes[i].className == "bubble-modal") {
            modalText = element.childNodes[i].innerHTML;
            break;
        }
    }
    modalContent.innerHTML = modalText;
    modalWindow.style.display = "block";
}

function closeModal() {
    var modalWindow = document.getElementById("modal");
    var modalContent = document.getElementById("modal-content");
    modalWindow.style.display = "none";
    modalContent.innerHTML = "";
}