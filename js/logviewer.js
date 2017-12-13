
// Add a log item row to the table
function addLogRow(logitem){

    $("#logtable").find('tbody')
        .append($('<tr>')
            .addClass('logitem')
            .addClass(logitem.level + 'ROW')
            .append($('<td>')
                .addClass('levelcol')
                .addClass(logitem.level)
                .text(logitem.level)
            )
            .append($('<td>')
                .addClass('timecol')
                .text((new Date(logitem.timeMillis)).toLocaleString())
            )
            .append($('<td>')
                .text(logitem.message)
            )
            .append($('<td>')
                .text(logitem.source.class)
            )
            .append($('<td>')
                .text(logitem.source.method)
            )
        );

}

$(document).ready( function(){

    var levels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal']

    // click for filter buttons
    $.each(levels, function(index, value){
        var myid = '#' + value + 'filter'
        var myclass = '.' + value.toUpperCase() + 'ROW'
        $(myid).click(function(){
            $(this).toggleClass('active')
            $(myclass).toggleClass('filtered')
        })
    })

    // show all levels filter button
    $('#allfilter').click(function(){
        $.each(levels, function(index, value){
            var myid = '#' + value + 'filter'
            var myclass = '.' + value.toUpperCase() + 'ROW'
            $(myid).addClass('active')
            $(myclass).removeClass('filtered')
        })
    })



    // search input
    $('#searchInput').bind("enterKey",function(e){
       console.log('searching for ' + $(this).val())
       var v = $(this).val()
       var rows = $('#logtable').find('.logitem')
       rows.addClass('nosearch')
       rows.filter(":contains('" + v + "')").removeClass('nosearch')
    });
    $('#searchInput').keyup(function(e){
        if(e.keyCode == 13)
        {
            $(this).trigger("enterKey");
        }
    });



    // load file function
    $("#the-file-input").change(function() {

        var file = this.files[0]

        // generate a new FileReader object
          var reader = new FileReader();

          // inject an image with the src url
          reader.onload = function(event) {

            $("#logtable>tbody").empty();

            // parse the loaded data
            var raw = event.target.result
            var withcommas = raw.split('\n').slice(0,-1).join(', ')
            var loglist = '[' + withcommas + ']'
            var data = JSON.parse(loglist)

            // put in rows
            for(i=0; i<data.length; i++){
                addLogRow(data[i]);
            }
          }

          // when the file is read it triggers the onload event above.
          reader.readAsText(file);

    });

})

