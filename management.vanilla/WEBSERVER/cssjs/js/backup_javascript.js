// Get the button, and when the user clicks on it, execute myFunction
document.getElementById("button1").onclick = function() {myFunction()};

/* myFunction toggles between adding and removing the show class, which is used to hide and show the dropdown content */
function myFunction() {
    document.getElementById("button1").style.color = "red";

    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET","/bruse", true);
    xmlhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
	        console.log(this.responseText)
	        // var myArr = JSON.parse(this.responseText);
	        // console.log(myArr)
    	}
    };
    xmlhttp.send();
}

/* growl examples */
// https://ksylvest.github.io/jquery-growl/
$.growl({ title: "Growl", message: "The kitten is awake!" });
$.growl.error({ message: "The kitten is attacking!" });
$.growl.notice({ message: "The kitten is cute!" });
$.growl.warning({ message: "The kitten is ugly!" });

/*growl options*/
/*
delayOnHover: while hovering over the alert, prevent it from being dismissed (true | false - default: true)
duration: the duration (in milliseconds) for which the alert is displayed (default: 3200)
fixed: whether the alert should be fixed rather than auto-dismissed (true | false - default: false)
location: the alert's position ('tl' | 'tr' | 'bl' | 'br' | 'tc' | 'bc' - default: 'tr')
size: the alert's size ('small' | 'medium' | 'large' - default: 'medium')
style: the alert's style ('default' | 'error' | 'notice' | 'warning' - default: 'default')
*/



