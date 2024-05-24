<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<h1>Login</h1>
    <form name='f' action="login" method='POST' onsubmit="validate()">
        <table>
            <tr>
                <td>User:</td>
                <td><input type='text' name='username' value=''></td>
            </tr>
            <tr>
                <td>Password:</td>
                <td><input type='password' name='password' /></td>
            </tr>
            <tr>
                <td><input name="submit" type="submit" value="submit" /></td>
            </tr>
        </table>
    </form>
    <script type="text/javascript">
        function validate(event) {
            var isValidated = true;
            if (document.f.username.value === "" && document.f.password.value === "") {
                alert("Username and password are required");
                document.f.username.focus();
                isValidated = false;
            }
            if (document.f.username.value === "") {
                alert("Username is required");
                document.f.username.focus();
                isValidated = false;
            }
            if (document.f.password.value === "") {
                alert("Password is required");
                document.f.password.focus();
                isValidated = false;
            }
            return isValidated;
        }
    </script>
</body>
</html>