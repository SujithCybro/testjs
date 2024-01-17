$(document).ready(function () {
    //var user = sessionStorage.getItem('userdetails');
    //console.log(user);
    //if (user != null) {
    //    var uInfo = JSON.parse(user);
    //    var username = uInfo.user;
    //    var password = uInfo.password;
    //        $.ajax({
    //            url: "https://localhost:7134/account/index",
    //            type: "POST",
    //            data: {
    //                UsermailId: username,
    //                password: password
    //            },
    //            success: function () {
    //                location.href = "https://localhost:7134/account/dashboard";
    //            },
    //            error: function (error) {
    //                console.log(error);
    //            }

    //        })
    //}
    $("#login-box").submit(function (event) {
        var usermail = $("#UsermailId").val();
        var password = $("#Password").val();
        if (usermail.length == 0 || password.length == 0) {
            event.preventDefault();
        }
        else if (password.length < 6) {
            $("#passwordcheck").removeAttr("hidden");
            $("#passwordcheck").html("** Password must be at least 6 characters");
            event.preventDefault();
        }
        var userdetails = {
            'user': usermail,
            'password': password
        };
       // sessionStorage.setItem('userdetails', JSON.stringify(userdetails));

    });
    $("#signup-box").submit(function (event) {
        var username = $("#username").val();
        var usermail = $("#usermail").val();
        var password = $("#userpassword").val();
        var cnfpass = $("#cnfpass").val();
        if (username.length < 1 || usermail.length < 1 || password.length < 6 || cnfpass.length < 6) {
            event.preventDefault();
        }

    });
    
});
function inputvalidate(input) {
    var value = $(input).val();
    if (input.id === "UsermailId") {
        var mailregex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-z]{2,3}$/;
        if (value.length < 1) {
            $("#mailchck").removeAttr("hidden");
            $("#mailchck").html("** Mail Id required");
        }
        else if (!mailregex.test(value)) {
            $("#mailchck").removeAttr("hidden");
            $("#mailchck").html("** Mail Id invalid");
        }
        else {
            $("#mailchck").hide();
        }
    }
    else if (input.id === "Password") {
        var regxPass = /^(?=.*[a-zA-Z0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;
        if (value.length < 1) {
            $("#passwordcheck").removeAttr("hidden");
            $("#passwordcheck").html("** Password must be at least 6 characters");
        }
        else if (!regxPass.test(value)) {
            $("#passwordcheck").removeAttr("hidden");
            $("#passwordcheck").html("** Password must contain atleast 1 special character");
        }
        else {
            $("#passwordcheck").hide();
        }
    }
    else if (input.id === "username") {
        if (value.length < 3) {
            $("#usercheck").removeAttr("hidden");
            $("#usercheck").html("** invalid username");
        }
        else {
            $("#usercheck").hide();
        }
    }
    else if (input.id === "usermail") {
        var mailregex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-z]{2,3}$/;
        if (value.length < 1) {
            $("#usermailcheck").removeAttr("hidden");
            $("#usermailcheck").html("** Mail Id required");
        }
        else if (!mailregex.test(value)) {
            $("#usermailcheck").removeAttr("hidden");
            $("#usermailcheck").html("** Mail Id invalid");
        }
        else {
            $("#usermailcheck").hide();
        }
    }
    else if (input.id === "userpassword") {
        var regxPass = /^(?=.*[a-zA-Z0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;
        if (value.length < 6) {
            $("#userpasscheck").removeAttr("hidden");
            $("#userpasscheck").html("** Password must be at least 6 characters");
        }
        else if (!regxPass.test(value)) {
            $("#userpasscheck").removeAttr("hidden");
            $("#userpasscheck").html("** Password must contain atleast 1 special character");
        }
        else {
            $("#userpasscheck").hide();
        }
    }
    else if (input.id === "cnfpass") {
        var pass = $("#userpassword").val();
        var cnfpass = $("#cnfpass").val();
        if (pass.length < 1) {
            $("#cnfpasscheck").hide();
            return;
        }
        if (pass !== cnfpass) {
            console.log("passowrd calidate")
            $("#cnfpasscheck").removeAttr("hidden");
            $("#cnfpasscheck").html("Password does not match");
        }
        else {
            $("#cnfpasscheck").hide();
        }
    }

}
//function mailvalidate() {
//    var usermail = $("#UsermailId").val();
//    var mailregex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-z]{2,3}$/;

//    if (!mailregex.test(usermail)) {
//        $("#mailchck").removeAttr("hidden")
//        $("#mailchck").html("** Invalid email");
//    } else {
//        $("#mailchck").hide();
//    }
//}
//function passwordValidate() {
//    debugger;
//    var password = $("#Password").val();
//    var passwordRegex = /^(?=.*[a-zA-Z0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;

//    if (!passwordRegex.test(password)) {
//        $("#passwordcheck").removeAttr("hidden");
//        $("#passwordcheck").html("** Password must be at least 6 characters and should contain at least one special character");
//    } else {
//        $("#passwordcheck").hide();
//    }
//}
