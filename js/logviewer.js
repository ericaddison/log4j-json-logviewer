
// Add an object to an element with .append, recursively
function addObjectToElem(obj, elem, level, prefix)
{
    prefix = (prefix == '') ? '' : (prefix + ".");

    for (var key in obj) {
        if (typeof obj[key] == "object" && obj[key] !== null)
          addObjectToElem(obj[key], elem, level, key);
        else { 

	       elem.append($('<div>')
	             .addClass('infocell')
	    	     .addClass('w-100')
	       )
	       .append($('<div>')
	    	   .addClass('infocell')
                   .addClass(level)
	    	   .addClass('col-md-1')
		   .append("&nbsp;")
	       )
	       .append($('<div>')
	    	   .addClass('infocell')
	    	   .addClass('keycell')
	    	   .addClass('col-md-2')
		   .text(prefix + key)
	       )
	       .append($('<div>')
	    	   .addClass('infocell')
	    	   .addClass('col-md-auto')
		   .text(obj[key])
	       )
	}
    }
}


// Add a log item row to the table
function addLogRow(logitem){

    var bgcolor = 'white'

    var newrow = $('<div>')
                   .addClass('logitem')
	           .addClass('row')
                   .addClass(logitem.level + 'ROW')
                   .append($('<div>')
                      .addClass('col-md-1')
                      .addClass('levelcol')
                      .addClass('mainlogrow')
                      .addClass(logitem.level)
                      .text(logitem.level)
                    )
                   .append($('<div>')
                      .addClass('col-md-2')
                      .addClass('timecol')
                      .addClass('mainlogrow')
                      .text((new Date(logitem.timeMillis)).toLocaleString())
                    )
                   .append($('<div>')
                      .addClass('col-md-9')
                      .addClass('mainlogrow')
                      .text(logitem.message)
                    );

    var infodiv = $('<div>').addClass('infodiv').toggle();
    addObjectToElem(logitem, infodiv, logitem.level, '');
    newrow.append(infodiv);

    $("#logcontainer").append(newrow);

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
       var rows = $('#logcontainer').find('.logitem')
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

            // add click behavior to rows
	    $('.mainlogrow').click(function(){

		$(this).parent().find('.infodiv').toggle()
	    })

          }

          // when the file is read it triggers the onload event above.
          reader.readAsText(file);

    });

})

