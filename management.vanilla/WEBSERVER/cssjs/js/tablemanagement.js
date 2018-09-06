$('#fahrzeuginputs').on('submit', function(event) {
    // prevent reload
    event.preventDefault();
    // clears appended msg
    //clearMsg("responsemsg");
    var params = {};
    var childDivs = document.getElementById('fahrzeuginputs').getElementsByTagName('input');
    for (i = 0; i < childDivs.length; i++) {
        params[childDivs[i].placeholder] = childDivs[i].value;
    }
    params["table_name"] = "fahrzeuge";

    var checkall = true;
    if (!(/^([0-9a-zA-Z]+(,[0-9a-zA-Z]+)*)?$/g.test(params["Mitarbeiternummer"]))) {
        checkall = false;
    }
    // check for validity of input:
    if (checkall) {
        console.log("calling insert with:", params);
        postRequest(params, "/insert_table");
    } else {
        $.growl.error({ message: "Bitte überprüfen Sie die Mitarbeiternamen.", duration: 3000, size: "medium", location: "bc" });
        return;
    }
});

// Fahrzeuge Update
$('#fahrzeuginputs-edit').on('submit', function(event) {
    event.preventDefault();
    //clearMsg("responsemsg2");
    var params = {};
    //alle Tabelleneinträge des editierten Modals
    var childDivs = this.getElementsByTagName('input');
    for (i = 0; i < childDivs.length; i++) {
        params[childDivs[i].placeholder] = childDivs[i].value;
    }
    params["table_name"] = "fahrzeuge";
    var checkall = true;
    if (!(/^([0-9a-zA-Z]+(,[0-9a-zA-Z]+)*)?$/g.test(params["Mitarbeiternummer"]))) {
        checkall = false;
    }
    // check for validity of input:
    if (checkall) {
        postRequest(params, "/update_table_row");
    } else {
        $.growl.error({ message: "Bitte überprüfen Sie die Mitarbeiternamen.", duration: 3000, size: "medium", location: "bc" });
        //addMsg("Mitarbeiternamen müssen Wörter in einer Komma separierte Liste sein. (bsp: bruse,franzi,jansen)", "responsemsg2")
        return;
    }
});

// Fahrzeug löschen
$(document).on('click', '.delete-fahrzeug', function() {
    var params = {};
    var tabelleneinträge = this.parentElement.parentElement.parentElement.parentElement.getElementsByTagName("td");
    params["Fahrzeugnummer"] = tabelleneinträge[0].firstChild.nodeValue;
    params["Kennzeichen"] = tabelleneinträge[1].firstChild.nodeValue;
    params["table_name"] = "fahrzeuge";
    postRequest(params, "/delete_table_row");
});

// post request to go backend
function postRequest(params, handler) {
    var r = new XMLHttpRequest();
    r.open("POST", handler, true);
    r.setRequestHeader("Content-Type", "application/json");
    r.onreadystatechange = function() {
        if (r.readyState === 4 && r.status === 200) {
            var json_resp = JSON.parse(r.responseText);
            if (json_resp["Success"] == true) {
                $.growl.notice({ message: json_resp["Message"], duration: 1000, size: "medium", location: "bc" });
                setTimeout(function() {
                    location.reload();
                }, 1000);
            } else {
                $.growl.error({ message: json_resp["Message"], duration: 3000, size: "medium", location: "bc" });
            }
            return false;
        }
    };
    r.send(JSON.stringify(params));
}



/* checkbox change catch::: checks if checked, checks for which checkbox, toggles bootstrap table */
$(document).on('change', '.checkbox', function() {
    var outter_this = this;
    if ($("#checkboxes input:checked").length < 1) {
        // $("table[name=fahrzeuge] thead tr th[name=delete]")[0].classList.add("hidden");
        $("table[name=fahrzeuge] thead tr th[name=edit]")[0].classList.add("hidden");
        // $("table[name=fahrzeuge] tbody tr td[name=delete]").each(function() {
        //   this.classList.add("hidden");
        // });
        $("table[name=fahrzeuge] tbody tr td[name=edit]").each(function() {
            this.classList.add("hidden");
        });
    }
    if ($("#checkboxes input:checked").length > 0) {
        //$("table[name=fahrzeuge] thead tr th[name=delete]")[0].classList.remove("hidden");
        $("table[name=fahrzeuge] thead tr th[name=edit]")[0].classList.remove("hidden");
        // $("table[name=fahrzeuge] tbody tr td[name=delete]").each(function() {
        //   this.classList.remove("hidden");
        // });
        $("table[name=fahrzeuge] tbody tr td[name=edit]").each(function() {
            this.classList.remove("hidden");
        });
    }
    if (outter_this.getElementsByTagName("input")[0].checked) { // checkbox is checked
        // remove hidden field to td and th:
        $("table[name=fahrzeuge] thead tr th").each(function() {
            if (this.getAttribute("name") == outter_this.getElementsByTagName("input")[0].name) {
                this.classList.remove("hidden");
            }
        });
        $("table[name=fahrzeuge] tbody tr td").each(function() {
            if (this.getAttribute("name") == outter_this.getElementsByTagName("input")[0].name) {
                this.classList.remove("hidden");
            }
        });
    } else { // checkbox unchecked
        // add hidden class to td and th:
        $("table[name=fahrzeuge] thead tr th").each(function() {
            if (this.getAttribute("name") == outter_this.getElementsByTagName("input")[0].name) {
                this.classList.add("hidden");
            }
        });
        $("table[name=fahrzeuge] tbody tr td").each(function() {
            if (this.getAttribute("name") == outter_this.getElementsByTagName("input")[0].name) {
                this.classList.add("hidden");
            }
        });
    }
});

/* adds calendar to input field date picking */
$(".datepicker").datepicker({ dateFormat: 'dd-mm-yy' });

//edit Fahrzeuge wurde geklickt
$(document).on('click', '.update-fahrzeug', function() {
    var params = {};
    //alle Tabelleneinträge der gecklickten Zeile
    var tabelleneinträge = this.parentElement.parentElement.parentElement.getElementsByTagName("td");
    /*console.log(tabelleneinträge)*/
    for (i = 0; i < tabelleneinträge.length; i++) {
        /*console.log(tabelleneinträge[i])*/
        if (tabelleneinträge[i].innerHTML == "-") {
            params[tabelleneinträge[i].getAttribute("name")] = "";
        } else {
            if (tabelleneinträge[i].getAttribute("name") == "Mitarbeiternummer") {
                params[tabelleneinträge[i].getAttribute("name")] = tabelleneinträge[i].innerHTML.slice(1, -1);
                params[tabelleneinträge[i].getAttribute("name")] = params[tabelleneinträge[i].getAttribute("name")].replace(/\s/g, ",");
            } else if (tabelleneinträge[i].getAttribute("name") == "Kilometerstand") {
                var numb = tabelleneinträge[i].innerHTML.split(" ");
                params[tabelleneinträge[i].getAttribute("name")] = numb[0];
            } else {
                params[tabelleneinträge[i].getAttribute("name")] = tabelleneinträge[i].innerHTML;
            }
        }
        /*params[tabelleneinträge[i].getAttribute("name")] = tabelleneinträge[i].innerHTML;*/
    }
    params["table_name"] = "fahrzeuge";
    //Modal Input Fields mit den Tabelleneinträgen ergänzen
    var childDivs = document.getElementById('fahrzeuginputs-edit').getElementsByTagName('input');
    for (i = 0; i < childDivs.length; i++) {
        childDivs[i].value = params[childDivs[i].placeholder];
    }
});


// sending csv import file to backend, insert/append to fahzeuge table:
$(document).on('click', '.importcsv', function() {
    var fileList = document.getElementById('fahrzeugecsvfile').files;
    if (fileList.length < 1) {
        $.growl.error({ message: "Es wurde kein csv file ausgewählt.", duration: 3000, size: "medium", location: "bc" });
    } else {
        console.log(document.getElementById('fahrzeugecsvfile').files)
        var csv = document.getElementById('fahrzeugecsvfile').files[0];
        var formData = new FormData();
        console.log('formData=', formData)
        formData.append("fahrzeugCsv", csv);
        console.log('formData2=', formData)
        // console.log(formData.get("fahrzeugCsv"))
        var r = new XMLHttpRequest();

        //here you can set the request header to set the content type, this can be avoided.
        //The browser sets the setRequestHeader and other headers by default based on the formData that is being passed in the request.
        r.setRequestHeader("Content-type", "multipart/form-data"); //----(*)
        r.open("POST", "/handleFile", true);
        r.onreadystatechange = function() {
            if (r.readyState === XMLHttpRequest.DONE && r.status === 200) {
                console.log("yey");
            }
        }
        r.send(formData);
    }
});



$(document).on('click', '.protocol', function() {

    console.log("in protocol load function")
    var button = this;
    console.log(this.getAttribute("aria-controls"))
    var selfid = this.getAttribute("aria-controls")
    if (button.style.color == "") {
        button.style.color = "rgb(85, 0, 0)";

        var params = {};
        var tabelleneinträge = this.parentElement.parentElement.parentElement.getElementsByTagName("td");

        params["Fahrzeugnummer"] = tabelleneinträge[0].firstChild.nodeValue;
        params["Kennzeichen"] = tabelleneinträge[1].firstChild.nodeValue;
        params["table_name"] = "fahrzeuge";

        console.log(params);

        // postRequest(params, "/get_protocol");
        var r = new XMLHttpRequest();
        r.open("POST", "/get_protocol", true);
        r.setRequestHeader("Content-Type", "application/json");
        r.onreadystatechange = function() {
            if (r.readyState === 4 && r.status === 200) {

                //console.log(r.responseText)
                var json_resp = JSON.parse(r.responseText);

                //console.log(json_resp)
                if (json_resp["Success"] == true) {
                    console.log(json_resp["Data"])
                    var Columns = ["Erstellt_von", "Kennzeichen_in", "Mitarbeiternummer_in", "Tuvbis_in", "Servicefallig_in", "Kilometerstand_in", "Notiz_in", "Erstellt"]
                    for (i = 0; i < json_resp["Data"].length; i++) {

                        //rows für collapse

                        var row = document.createElement("tr")
                        row.setAttribute("style", "background-color: lightgrey")

                        var cell = []
                        var cellText = []

                        //ändert die Column einträge in abhängigkeit von Collumns array

                        for (j = 0; j < Columns.length; j++)

                        {
                            cell[j] = document.createElement("td")



                            if (json_resp["Data"][i][Columns[j]] == null || json_resp["Data"][i][Columns[j]] == 0) {
                                cellText[j] = document.createTextNode("-")

                            } else {
                                cellText[j] = document.createTextNode(json_resp["Data"][i][Columns[j]])

                            }






                            cell[j].appendChild(cellText[j])
                            row.appendChild(cell[j])

                        }

                        document.getElementById(selfid).appendChild(row)

                    }
                } else {
                    $.growl.error({ message: "Protocol konnte nicht geladen werden!", duration: 3000, size: "medium", location: "bc" });
                }
                return false;
            }
        };
        r.send(JSON.stringify(params));

    } else {
        button.style.color = "";
        document.getElementById(selfid).innerHTML = "";
    }

});


/* example javascript for pop up of protokol table rows */
$(document).on('click', '#mybutton1', function() {
    console.log("blabla");
    var hidden_tr = document.getElementsByClassName("mybutton1");
    if (hidden_tr[0].classList.contains("hidden")) {
        hidden_tr[0].classList.remove("hidden");
        hidden_tr[1].classList.remove("hidden");
    } else {
        hidden_tr[0].classList.add("hidden");
        hidden_tr[1].classList.add("hidden");
    }
    tableHeaderAlign();
});

$(document).ready(function() {
    tableHeaderAlign();
});

window.onresize = function() {
    tableHeaderAlign();
}

function tableHeaderAlign() {


    var colWidths = [];
    $(".table.tablebody tbody tr:first td").each(function(index) {
        colWidths.push(this.offsetWidth);
    });
    $(".tablehead div").each(function(index) {
        this.style.width = colWidths[index].toString() + "px";
    });
}

function sortTable(n) {


    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    // table = document.getElementById("fahrzeuge");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = document.getElementsByClassName("no-protocol");
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 0; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            x = rows[i].getElementsByTagName("TD")[n];



            y = rows[i + 1].getElementsByTagName("TD")[n];
            /* Check if the two rows should switch place,
            based on the direction, asc or desc: */
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            // Each time a switch is done, increase this count by 1:
            switchcount++;
        } else {
            /* If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again. */
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }

    var protocol = $(".protocol");
    var no_protocol = $(".no-protocol");
    var tbody = $("tbody");
    var newtbody = "";
    for (var i = 0; i < no_protocol.length; i++) {
        var id = no_protocol[i].getElementsByTagName("button")[0].id;
        newtbody += $(no_protocol[i]).wrap('<p/>').parent().html();

        var protocol = tbody[0].getElementsByClassName(id)
        protocol_html = "";
        for (var j = 0; j < protocol.length; j++) {
            protocol_html += $(protocol[j]).wrap('<p/>').parent().html();
        }
        newtbody += protocol_html;
    }
    tbody[0].innerHTML = newtbody;

    tableHeaderAlign();

}

function filterTable() {
    // Declare variables
    var input, filter, table, tr, td, i;
    input = document.getElementById("searchTable");
    filter = input.value.toUpperCase();
    table = document.getElementById("fahrzeuge");
    tr = table.getElementsByTagName("tr");


    // Loop through all table rows, and hide those who don't match the search query
    for (var i = 0; i < tr.length; i++) {
        var check = false;
        for (var j = 0; j < tr[i].getElementsByTagName("td").length; j++) {
            td = tr[i].getElementsByTagName("td")[j];
            if (td) {

                //console.log("Inner HTML ist ",td.innerHTML.toUpperCase())

                //console.log("Boolean ",td.innerHTML == '<*')
                if (td.innerHTML.includes("</") == false) {
                    if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                        check = true;
                    }
                }
            }
        }

        if (check) {
            tr[i].style.display = "";



            if (tr[i].getElementsByTagName("button").length != 0) {
                button_id = tr[i].getElementsByTagName("button")[0].id

                var protocol_elemets = table.getElementsByClassName(button_id)

                for (j = 0; j < protocol_elemets.length; j++) {

                    protocol_elemets[j].style.display = "";

                }
            }

        } else {
            tr[i].style.display = "none";
        }

    }
}


$(document).on('click', '.sort_caret', function() {

    console.log(this.innerHTML.includes('<i class="fas fa-caret-down"></i>'));

    if (this.innerHTML.includes('<i class="fas fa-caret-down"></i>')) {

        //this.getElementsByTagName("i")[0].classList.remove("fa-caret-down")
        this.getElementsByTagName("i")[0].classList.add("fa-caret-up")
        

        //umdrehen
    } else if (this.innerHTML.includes('<i class="fas fa-caret-up"></i>')) {

        //this.getElementsByTagName("i")[0].classList.remove("fa-caret-up")
        this.getElementsByTagName("i")[0].classList.add("fa-caret-down")
       

        //umdrehen
    } else {



        var all_carets = document.getElementsByClassName("sort_caret")


        for (i = 0; i < all_carets.length; i++) {

            if (all_carets[i].innerHTML.includes("<i")) {

                var i_element = all_carets[i].getElementsByTagName("i");
                console.log(i_element)
                all_carets[i].removeChild(i_element[0]);

            }
        }

        var new_i_element = document.createElement("i");
        new_i_element.setAttribute("class", "fas fa-caret-down")
        this.appendChild(new_i_element)



    }
});