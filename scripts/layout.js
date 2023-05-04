function replaceNames() {
    var portraits = document.getElementsByClassName('portrait');

    for (i = 0; i < portraits.length; i++) {
        portraits[i].style.backgroundImage = 'url(pics/ebenso/' + portraits[i].firstElementChild.innerText.toLowerCase() + '.png)';
    }
}