var idleTime = 0;
var xmlhttp;
$(document).ready(function() {
    //Increment the idle time counter every minute.
    var idleInterval = setInterval(timerIncrement, 60000); // 1 minute

    //Zero the idle timer on mouse movement.
    $(this).mousemove(function(e) {
        idleTime = 0;
    });
    $(this).keypress(function(e) {
        idleTime = 0;
    });


    brotkrümel();
});

function timerIncrement() {
    idleTime = idleTime + 1;
    if (idleTime > 10) { // 20 minutes
        xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", "/logout", true);
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                window.location.reload();
            }
        };
        xmlhttp.send();
    }
}

/// navbar selection:
$('a[data-toggle="pill"]').on('shown.bs.tab', function(e) {



    if (typeof e.relatedTarget == 'undefined') {

        // removals.... deselections... set states to starting states...
        if (e.target.getAttribute('id').split("-")[3] == "2") {
            var innerlist = document.querySelectorAll('#pills-tab-1 a')
            $.each(innerlist, function(i, v) {
                v.setAttribute('class', 'nav-link');
                v.setAttribute('aria-selected', false);
            })
            var innerlist = document.querySelectorAll('#subnavbar a')
            $.each(innerlist, function(i, v) {
                v.setAttribute('class', 'nav-link');
                v.setAttribute('aria-selected', false);
            })
            document.getElementById("subnavbar").innerHTML = "";
            var topLevelNav = document.getElementById("topLevelNavbar");
            topLevelNav.classList.remove("pb-0", "pt-3");
            topLevelNav.classList.add("py-3");
            document.getElementsByTagName("BODY")[0].style.height = "100vh";
            document.getElementsByTagName("BODY")[0].style.paddingTop = "74px";

        } else {
            var innerlist = document.querySelectorAll('#pills-tab-2 a')
            $.each(innerlist, function(i, v) {
                v.setAttribute('class', 'nav-link');
                v.setAttribute('aria-selected', false);
            })
            var innerlist = document.querySelectorAll('#subnavbar a')
            $.each(innerlist, function(i, v) {
                v.setAttribute('class', 'nav-link');
                v.setAttribute('aria-selected', false);
            })
        }
    } else {
        // on wegklicken von pills-firma-tab
        var pillsTabList = ["pills-firma-tab", "pills-mitarbeiter-tab", "pills-auftraege-tab", "pills-finanzen-tab", "pills-vorlagen-tab", "pills-system-tab"];
        if (pillsTabList.includes(e.relatedTarget.id)) {
            document.getElementById("subnavbar").innerHTML = "";
            var topLevelNav = document.getElementById("topLevelNavbar");
            topLevelNav.classList.remove("pb-0", "pt-3");
            topLevelNav.classList.add("py-3");
            document.getElementsByTagName("BODY")[0].style.height = "100vh";
            document.getElementsByTagName("BODY")[0].style.paddingTop = "74px";
        }
    }

    //  adding content to main navbar 
    if (e.target.id == "pills-firma-tab") {
        var subnavContent = SubNavbarContent(["Stammdaten", "Karte", "Lager", "Maschinen und Werkzeuge", "Fahrzeuge", "Fachfirmen"]);
        appendSubNavbar(subnavContent, "firma");
    }
    if (e.target.id == "pills-mitarbeiter-tab") {
        var subnavContent = SubNavbarContent(["Übersicht Mitarbeiter", "Arbeitszeit", "Urlaubstool"]);
        appendSubNavbar(subnavContent, "mitarbeiter");
    }
    if (e.target.id == "pills-auftraege-tab") {
        var subnavContent = SubNavbarContent(["Übersicht Aufträge", "Auftraggeber", "Objekte", "Leistungen", "Zählerstand"]);
        appendSubNavbar(subnavContent, "auftraege");
    }
    if (e.target.id == "pills-finanzen-tab") {
        var subnavContent = SubNavbarContent(["Rechnungen", "Extra Tool Bank API", "Bilanz", "Datev export"]);
        appendSubNavbar(subnavContent, "finanzen");
    }
    if (e.target.id == "pills-vorlagen-tab") {
        var subnavContent = SubNavbarContent(["Vertrag Mitarbeiter", "Aushang", "Brief an Mitarbeiter", "Brief an Auftraggeber"]);
        appendSubNavbar(subnavContent, "vorlagen");
    }
    if (e.target.id == "pills-system-tab") {
        var subnavContent = SubNavbarContent(["Benutzerverwaltung", "Sonstiges"]);
        appendSubNavbar(subnavContent, "system");
    }


    brotkrümel();
})

function appendSubNavbar(subnavContent, tabName) {
    var subnavbar = document.getElementById("subnavbar");
    subnavContent.classList.add("hidden");
    subnavbar.innerHTML = subnavContent.innerHTML;
    var topLevelNav = document.getElementById("topLevelNavbar");
    topLevelNav.classList.remove("py-3");
    topLevelNav.classList.add("pb-0", "pt-3");
    document.getElementsByTagName("BODY")[0].style.height = "100%";
    document.getElementsByTagName("BODY")[0].style.paddingTop = "86px";

    var innerlist = document.querySelectorAll('#pills-' + tabName + '-tabContent .tab-pane.fade')
    $.each(innerlist, function(i, v) {
        if (i == 0) {
            v.setAttribute('class', 'tab-pane fade show active');
        } else {
            v.setAttribute('class', 'tab-pane fade');
        }
    });
}

function SubNavbarContent(subtabNames) {
    returnHtml = document.createElement("ul");
    for (var i = 0; i < subtabNames.length; i++) {
        var liTag = document.createElement("li");
        var aTag = document.createElement("a");
        liTag.setAttribute("class", "nav-item");
        if (i == 0) {
            aTag.setAttribute("class", "nav-link subnavlink active");
            aTag.setAttribute("aria-selected", "true")
        } else {
            aTag.setAttribute("class", "nav-link subnavlink");
            aTag.setAttribute("aria-selected", "false")
        }
        aTag.setAttribute("data-toggle", "pill");
        aTag.setAttribute("role", "tab");
        var loCase = subtabNames[i].toLowerCase();
        if (loCase.includes(" ")) {
            loCase = loCase.replace(/ /g, '');
        }
        aTag.setAttribute("id", "pills-" + loCase + "-tab");
        aTag.setAttribute("href", "#pills-" + loCase);
        aTag.setAttribute("aria-controls", "pills-" + loCase);
        aTag.innerHTML = subtabNames[i];
        liTag.appendChild(aTag);
        returnHtml.appendChild(liTag)


    }
    return returnHtml;
}




function brotkrümel() {

    var hauptseite = document.getElementById("Hauptseite");
    var unterseite = document.getElementById("Unterseite");





    var active_elements = document.getElementById("pills-tab-1").getElementsByClassName("active")[0].innerHTML;



    if (document.getElementById("subnavbar").getElementsByClassName("active")[0] != undefined) {
        var subnavBar = document.getElementById("subnavbar").getElementsByClassName("active")[0].innerHTML.toString();
        console.log(subnavBar)
    } else {
        var subnavbar = ""

    }

    var hauptseite = document.getElementById("Hauptseite")
    var unterseite = document.getElementById("Unterseite")

    console.log(active_elements)

    var hauptseite_string = active_elements.toString();
    var unterseite_string = subnavBar;


    if (unterseite_string == undefined) {
        hauptseite.innerHTML = hauptseite_string
        unterseite.innerHTML = ""
    } else {
        hauptseite.innerHTML = hauptseite_string + ' <span class="ui-icon ui-icon-caret-1-e"></span>'
        unterseite.innerHTML = unterseite_string
    }


}




$(document).on('click', '#help', function() {

    console.log("tooltip gecklickt")

    $('[data-toggle="tooltip"]').tooltip({ boundary: 'window' })


});

$(document).on('click', '.subnavlink', function() {

    brotkrümel();


});