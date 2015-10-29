$(window).load(function(){

	    var nomServicios = [
							{
								servicio 	: 	"Trae todas las tareas",
								urlServicio	: 	"getAllTask",
								metodo		: 	"GET"
							},
							{
								servicio 	: 	"Crear una nueva tarea",
								urlServicio	: 	"createTask",
								metodo		: 	"POST"
							},
							{
								servicio 	: 	"Editar una tarea",
								urlServicio	: 	"updateTask",
								metodo		: 	"PUT"
							},
							{
								servicio 	: 	"Eliminar Tarea",
								urlServicio	: 	"deleteTask",
								metodo		: 	"DELETE"
							},
							{
								servicio 	: 	"Trae una sola tarea",
								urlServicio	: 	"getTask",
								metodo		: 	"GET"
							}
						];

    var consumeServicios = function(tipo, val, callback)
	{
		var servicio = {
							url 	: nomServicios[tipo - 1].urlServicio,
							metodo	: nomServicios[tipo - 1].metodo,
							datos 	: ""
						};
		if(tipo === 4 || tipo === 5)
		{
			servicio.url += "/" + val;
		}
		else
		{
			servicio.datos = val !== "" ? JSON.stringify(val) : "";
		}
		//Invocar el servicio...
		$.ajax(
		{
			url 		: servicio.url,
			type 		: servicio.metodo,
			data 		: servicio.datos,
			dataType 	: "json",
			contentType: "application/json; charset=utf-8"
		}).done(function(data)
		{
            callback(data);
		});
	};

//var tasks = [];
//function Mostrar() {
    consumeServicios(1, "", function(data){
    	console.log(data);
        for(var i = 0; i < data.length; i++)
        {
        	NTareas(data[i].tasks);
        }
    });
    //return tasks;
//}

    
    function NTareas(Nueva) {
    $('#list').append($("<li id='task-' + i >  <img src='img/ok.png' onclick= 'done-btn'class='done-btn'href='#' />" +" " + Nueva  +
     "  <input class='delete-btn' type='submit' onclick='delete-btn' value='Borrar'></li>"));

    }




var addTask = function(){    
    var Nueva = $('#name');
     var newToDo = {finish : false, tasks :Nueva.val()};
     consumeServicios(2,newToDo, function(data){   
         NTareas(Nueva.val());
         $('#name').val("").focus();	
    });   
 };


$('#add-btn').click(addTask);
$('#name').keyup(function(e){
    if (e.keyCode === 13) {
        addTask();
    }
});
function tarea(ta)
{
	this.tar=ta;
}
var updateData = {
                    "id"        : "123456",
                    "finish"    : true,
                    "field"     : "finish"
                };

$(document).delegate('.done-btn', 'click', function() {

    consumeServicios(3, updateData, function(data){
    console.log("Actualizada, actualizar to-do");
});
    $(this).parent('li').addClass('done');
    return false;

	
});
 $(document).delegate('.delete-btn', 'click', function() {
  swal({   title: "Are you sure?",   text: "You will not be able to recover this imaginary file!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){   swal("Deleted!", "Your imaginary file has been deleted.", "success"); });

   consumeServicios(4, "123456", function(data){
    console.log("Eliminada, actualizar to-do");
    });
    $(this).parent('li').remove();
  });
  });
