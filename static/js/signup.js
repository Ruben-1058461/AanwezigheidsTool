if (document.querySelector("#roleSelection").length > 0) {
    const roleSelection = document.querySelectorAll("#roleSelection");
    console.log(roleSelection)

    roleSelection.forEach((el) => {
        el.addEventListener("change", (i) => {
            if (el.value == "teacher") {
                document.getElementById("teacher").style.display = "block";
                document.getElementById("student").style.display = "none";
            } else {
                document.getElementById("teacher").style.display = "none";
                document.getElementById("student").style.display = "block";
            }
        })
    })
}