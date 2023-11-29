function showModal(element) {
    var modalText;
    var modalHeading;
    var modalWindow = document.getElementById("modal");
    var modalContent = document.getElementById("modal-content");
    var modalHeader = document.getElementById("modal-header");
    for (var i = 0; i < element.childNodes.length; i++) {
        if (element.childNodes[i].className == "bubble-modal") {
            modalText = element.childNodes[i].innerHTML;
            break;
        }
    }
    for (var i = 0; i < element.childNodes.length; i++) {
        if (element.childNodes[i].className == "bubble-name") {
            modalHeading = element.childNodes[i].innerText;
            break;
        }
    }
    modalHeader.innerHTML = modalHeading;
    modalContent.innerHTML = modalText;
    modalWindow.style.display = "block";
}

function closeModal() {
    var modalWindow = document.getElementById("modal");
    var modalContent = document.getElementById("modal-content");
    modalWindow.style.display = "none";
    modalContent.innerHTML = "";
}


