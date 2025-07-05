const inputPassword = document.querySelector("input[password]");
if (inputPassword) {
  const viewPassword = document.querySelector("[view-password]");
  if (viewPassword) {
    viewPassword.addEventListener("click", () => {
        const currentType = inputPassword.getAttribute("type")
      const type = currentType === "password" ? "text" : "password";
      inputPassword.setAttribute("type", type);
    });
  }
}
