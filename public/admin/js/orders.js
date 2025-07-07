//PHẦN CONFIRM ĐƠN HÀNG ADMIN
const buttonOrder = document.querySelectorAll("[button-order]");
if(buttonOrder){
    buttonOrder.forEach(button => {
        button.addEventListener("click", () => {
            const value = button.getAttribute("value");
            const statusChange = value==="initial" ? "confirmed" : "initial";
            const id = button.getAttribute("id");
            fetch(`/admin/orders/changeStatus/${id}`, {
                method: "PATCH",
                headers: {
                "Content-Type": "application/json"
            },
                body: JSON.stringify({statusChange: statusChange})
            })
            .then(res => res.json())
            .then(data => {
                if(data.code === 200){
                    location.reload()
                }
            })
        })
    })
}
//END PHẦN CONFIRM ĐƠN HÀNG ADMIN