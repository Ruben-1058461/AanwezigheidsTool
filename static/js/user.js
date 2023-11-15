export default class User {
    constructor() {
        this.userId();
    }

    userId() {
        if (document.querySelectorAll(".loggedInUser").length > 0) {
            axios.get("/user/user-id").then((response) => {
                const results = response.data;
                if (results) {
                    let el = document.querySelector(".loggedInUser");
        
                    for (var i in results) {
                        el.innerHTML = results.user.name;
                    }
                }
            })
        }
    }
}