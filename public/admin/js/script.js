//PHẦN PREVIEW UP ẢNH
function createImagePreview(url, container) {
    const wrapper = document.createElement("div");
    wrapper.className = "position-relative me-2 mb-2";
    wrapper.style.width = "100px";
    wrapper.style.height = "100px";

    const img = document.createElement("img");
    img.src = url;
    img.classList.add("img-thumbnail");
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.innerHTML = "×";
    closeBtn.className = "btn btn-sm btn-danger position-absolute";
    closeBtn.style.top = "2px";
    closeBtn.style.right = "2px";
    closeBtn.style.borderRadius = "50%";
    closeBtn.style.width = "20px";
    closeBtn.style.height = "20px";
    closeBtn.style.padding = "0";
    closeBtn.style.fontSize = "14px";
    closeBtn.style.lineHeight = "18px";
    closeBtn.style.display = "flex";
    closeBtn.style.justifyContent = "center";
    closeBtn.style.alignItems = "center";
    closeBtn.onclick = () => wrapper.remove();

    wrapper.appendChild(img);
    wrapper.appendChild(closeBtn);
    container.appendChild(wrapper);
}

function previewImages(event) {
    const files = event.target.files;
    const container = document.getElementById("uploadPreview");
    container.innerHTML = "";

    for (const file of files) {
        const reader = new FileReader();
        reader.onload = function (e) {
            createImagePreview(e.target.result, container);
        };
        reader.readAsDataURL(file);
    }
}

function previewImageUrls(text) {
    const urls = text.trim().split("\\n").filter(Boolean);
    const container = document.getElementById("urlPreview");
    container.innerHTML = "";

    for (const url of urls) {
        createImagePreview(url, container);
    }
}
//  END PHẦN PREVIEW UP ẢNH

//Flash
const flash = document.querySelectorAll(".alert-flash");
if (flash) {
    setTimeout(() => {
        flash.forEach(alert => {
            alert.classList.add("hide");
            setTimeout(() => alert.remove(), 500); // xóa hẳn khỏi DOM sau 0.5s
        })
    }, 3000);
}
//End Flash


//PANIGATION - PHÂN TRANG
const buttonPanigation = document.querySelectorAll("[button-panigation]");
if (buttonPanigation) {
    buttonPanigation.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-panigation");
            const url = new URL(window.location.href);
            url.searchParams.set("page", page);
            window.location.href = url.href;
        })
    })
}
//END PANIGATION - PHÂN TRANG


//PHẦN READ ONLY EDIT
const formEdit = document.querySelector("[form-edit]");
if (formEdit) {
    const allInput = formEdit.querySelectorAll("input, textarea, select");
    allInput.forEach(item => {
        item.setAttribute("readonly", true)
        item.setAttribute("disabled", true)
    });
    const buttonEdit = document.querySelector("#btn-edit");
    const bttonSubmitEdit = document.querySelector("#btn-submit-edit");
    buttonEdit.addEventListener("click", () => {
        const valueCurrent = buttonEdit.getAttribute("valueCurrent");
        if (valueCurrent === "readonly") {
            allInput.forEach(item => {
                item.removeAttribute("readonly")
                item.removeAttribute("disabled")
            });
            bttonSubmitEdit.classList.remove("d-none")
            buttonEdit.setAttribute("valueCurrent", "read");
            buttonEdit.innerText = "Hủy";
        } else {
            allInput.forEach(item => {
                item.setAttribute("readonly", true)
                item.setAttribute("disabled", true)
            });
            bttonSubmitEdit.classList.add("d-none")
            buttonEdit.setAttribute("valueCurrent", "readonly");
            buttonEdit.innerText = "Cập nhật";
        }
    })
}
//END PHẦN READ ONLY EDIT