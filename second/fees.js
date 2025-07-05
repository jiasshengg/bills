document.addEventListener('DOMContentLoaded', function () {
    const backBtn = document.querySelector('#back-btn'); 

    backBtn.addEventListener('click', function(event) {
        window.location.href = "../index.html" ;
    });
});
