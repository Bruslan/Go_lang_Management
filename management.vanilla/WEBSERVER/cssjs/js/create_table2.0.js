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
    });
}

$(document).on('click', '#pills-fahrzeuge-tab', function() {
    console.log("firma wurde geklickt")
    Columns = ["Kennzeichen_in", "Kilometerstand_in", "Fahrzeugnummer_in", "Notiz_in", "Tuvbis_in", "edit"]
    createTable("/get_protocol_table", Columns, "callback_json_tabelle")

    // responsive table designs:
    console.log($(".table.tablebody tbody tr"))

});