$(document).on('click', '.fa-file-alt', function() {

    var fahrzeugnr = this.id

    console.log(fahrzeugnr)

    var childObjects = document.getElementsByClassName(fahrzeugnr);

    for (elements = 0; elements < childObjects.length; elements++) {

        if (childObjects[elements].classList.contains("hidden")) {
            console.log(childObjects[elements])
            childObjects[elements].classList.remove("hidden");
        } else {
            childObjects[elements].classList.add("hidden");
        }

    }

});


function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
        // return xmlHttp.responseText;

    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send();
}



function createTable(handler, Columns, table_id)

{
    httpGetAsync(handler, function(callback) {
        //Parse die eingehende Json
        var callback_json = JSON.parse(callback)




        console.log(callback_json)

        //erstelle ein Thead Überschriften der columns

        var tabelle = document.getElementById(table_id)
        var table_head = document.createElement("thead")
        var table_row = document.createElement("tr")

        var cell = []
        var cellText = []


        //Iteriere über die Spaltennamen der Columns array
        for (j = 0; j < Columns.length; j++)

        {
            cell[j] = document.createElement("th")


            cellText[j] = document.createTextNode([Columns[j]])
            cell[j].appendChild(cellText[j])
            table_row.appendChild(cell[j])

        }


        table_head.appendChild(table_row)
        tabelle.appendChild(table_head)



        //tbody
        //erstelle die einträge der Columns
        var table_body = document.createElement("tbody")

        table_body.setAttribute("class", "custom")


        for (element = 0; element < callback_json["Data"].length; element++) {


            var table_row = document.createElement("tr")



            if (element > 0) {

                if (callback_json["Data"][element]["Fahrzeugnummer_in"] == callback_json["Data"][element - 1]["Fahrzeugnummer_in"]) {

                    console.log("ich bin heir drinnen")

                    table_row.setAttribute("class", callback_json["Data"][element]["Fahrzeugnummer_in"] + " hidden protocoll_row")
                }

            }

            var cell = []
            var cellText = []



            for (j = 0; j < Columns.length; j++)

            {
                cell[j] = document.createElement("td")

                if ([Columns[j]] == "edit") {

                    cell[j].setAttribute("class", "btn-link align-middle")

                    cell[j].innerHTML = '<div class="row" style="width: 150px"><i data-toggle="modal" data-target="#exampleModal2" class="update-fahrzeug far fa-edit col m-0 ml-3 p-0"></i><i name ="delete" class="delete-fahrzeug far fa-trash-alt col m-0 ml-3 p-0"></i><i  data-toggle="collapse" data-target="#collapseOne{{.Fahrzeugnummer_in}}" aria-expanded="true" aria-controls="collapseOne{{.Fahrzeugnummer_in}}" class="far fa-file-alt col ml-1mr-3 " id ="' + callback_json["Data"][element]["Fahrzeugnummer_in"] + '"></i></div>'

                    table_row.appendChild(cell[j])



                } else {

                    cellText[j] = document.createTextNode(callback_json["Data"][element][Columns[j]])
                    cell[j].appendChild(cellText[j])
                    table_row.appendChild(cell[j])

                }



            }

            table_body.appendChild(table_row)

            //var table_body_protocoll =  document.createElement("tbody")
            //table_body.setAttribute("class","collapse")
            //tabelle.appendChild(table_body)  


        }

        tabelle.appendChild(table_body)







        $('#' + table_id).DataTable({
            "scrollY": "50vh",
            scrollCollapse: true,
            "paging": false
        }).columns.adjust();





        //click

        setTimeout(function() {

            document.querySelector('.sorting_asc').click();
            document.querySelector('.sorting_asc').click();



        }, 150);




    });



}
//$(document).ready(function() { $('#callback_json_tabelle').DataTable(); } );

//generate Fahrzeug tabelle
// A $( document ).ready() block.
// $( document ).ready(function() {

$(document).on('click', '#pills-fahrzeuge-tab', function() {




    console.log("firma wurde geklickt")


    Columns = ["Kennzeichen_in", "Kilometerstand_in", "Fahrzeugnummer_in", "Notiz_in", "Tuvbis_in", "edit"]


    createTable("/get_protocol_table", Columns, "callback_json_tabelle")


});


//Tabulator Tabelle
$(document).on('click', '#pills-maschinenundwerkzeuge-tab', function() {


    $("#example-table").tabulator({
        tooltips: false,
        height: "50vh", // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
        layout: "fitColumns",
        //fit columns to width of table (optional)
        columns: [ //Define Table Columns
            { title: "kennzeichen", field: "Kennzeichen_in", width: 150 },
            { title: "Erstellt am", field: "Erstellt", align: "left" },
            { title: "Erstellt von", field: "Erstellt_von" },
            { title: "Notiz", field: "Notiz_in", sorter: "date", align: "center" },
        ],
        rowClick: function(e, row) { //trigger an alert message when the row is clicked
            alert("Row " + row.getData().id + " Clicked!!!!");
        },
    });




    httpGetAsync("/get_protocol_table", function(callback) {
        //Parse die eingehende Json
        var callback_json = JSON.parse(callback)

        console.log(callback_json["Data"]);

        var tabledata = callback_json["Data"]


        //load sample data into the table
        $("#example-table").tabulator("setData", tabledata);
    });



});