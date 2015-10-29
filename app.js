var express = 	require("express"),
	app		= 	express(),
	cons 	=	require("consolidate"),
	puerto 	= 	process.env.PORT || 8082,
	bodyParser 	= require('body-parser');

//consolidate integra swig con express...
app.engine("html", cons.swig); //Template engine...
app.set("view engine", "html");
app.set("views", __dirname + "/vistas");
app.use(express.static('public'));

//Para indicar que se envía y recibe información por medio de Json...
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Crear un token único relacionado al ID de la tarea...
var guid = function()
{
	function s4()
	{
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

var listaTareas = [];

app.get("/", function(req, res)
{
	res.render("index", {
		titulo 	:  	"To-Do"
	});
});

//Servicios REST...
app.get('/getAllTask', function(req, res)
{
	res.json(listaTareas);
});

app.post('/createTask', function (req, res)
{
	res.json(crearEditarTarea(req.body, 1));
});

app.put('/updateTask', function (req, res)
{
	res.json(crearEditarTarea(req.body, 2));
});

app.delete('/deleteTask/:id', function(req, res)
{
	var ind = buscarIDTarea(req.param("id"));
	if(ind >= 0)
	{
		listaTareas.splice(ind, 1);
	}
	res.json({status : ind >= 0 ? true : false});
});

app.get('/getTask/:id', function(req, res)
{
	var ind = buscarIDTarea(req.param("id"));
	var devuelve = {datos : ind >= 0 ? listaTareas[ind] : "", status : ind >= 0 ? true : false};
	res.json(devuelve);
});

//Para cualquier url que no cumpla la condición...
app.get("*", function(req, res)
{
	res.status(404).send("Página no encontrada :( en el momento");
});

//Crear o edita un usuario...
var crearEditarTarea = function(data, tipo)
{
	var indice = 0;
	var date = new Date();
	var fechaActual = (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
	//se esta creando una nueva tarea...
	if(tipo === 1)
	{
		listaTareas.push(data);
		indice = listaTareas.length - 1;
		listaTareas[indice].id = guid();
		listaTareas[indice].date = fechaActual;

	}
	else
	{
		//Se está editando una tarea...
		indice = buscarIDTarea(data.id); //La posción en el array...
		if(indice >= 0)
		{
			listaTareas[indice][data.field] = data[data.field];
		}
	}
	return listaTareas[indice];
}
//Busca la posición del usuario en el array...
var buscarIDTarea = function(id)
{
	var ind = -1;
	for(var i = 0; i < listaTareas.length; i++)
	{
		if(listaTareas[i].id === id)
		{
			ind = i;
			break;
		}
	}
	return ind;
};

app.listen(puerto);
console.log("Express server iniciado en el " + puerto);