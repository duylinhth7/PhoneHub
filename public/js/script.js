//Flash
const flash = document.querySelectorAll(".alert-flash");
if(flash){
    setTimeout(() => {
        flash.forEach(alert => {
            alert.classList.add("hide");
            setTimeout(() => alert.remove(), 500); // xóa hẳn khỏi DOM sau 0.5s
        })
    }, 3000);
}
//End Flash