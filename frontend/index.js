
const protocol = "http";
const server = "192.168.1.88:5000";

var drawing = false;

var prevX, prevY;

document.onreadystatechange = function () 
{
	var canvas = document.getElementById("canvas");
	var clearButton = document.getElementById("clear_button");

	//It is necessary to set the height and width of the canvas element to the 
	//actual values that are rendered, because the coordinate system does not 
	//match them by default and instead stays at a default 300x150 pixels.
	canvas_style = getComputedStyle(canvas);
	canvas.setAttribute('width', parseInt(canvas_style.width));
	canvas.setAttribute('height', parseInt(canvas_style.height));

	const ctx = canvas.getContext('2d');

	//////////////////////////////////////////////////////
	//               Canvas Mouse Events                //
	//////////////////////////////////////////////////////

	canvas.onmousedown = function(event)
	{
		drawing = true;
		prevX=event.offsetX;
		prevY=event.offsetY;
		draw_point(event.offsetX, event.offsetY, 4, ctx);
	}
	
	canvas.onmousemove = function(event)
	{	
		if(drawing)
		{
			draw_point(event.offsetX, event.offsetY, 4, ctx);
		}
	}

	canvas.onmouseup = function(event)
	{
		drawing = false;

		send_image(canvas);
	}

	canvas.onmouseout = function(event)
	{
		if(drawing)
		{
			drawing = false;
			send_image(canvas);
		}
	}

	//////////////////////////////////////////////////////
	//               Canvas Touch Events                //
	//////////////////////////////////////////////////////

	canvas.ontouchstart = function(event)
	{	
		event.preventDefault();
		drawing = true;
		prevX = event.touches[0].pageX - event.target.offsetLeft;
		prevY = event.touches[0].pageY - event.target.offsetTop;
		draw_point(prevX, prevY, 4, ctx);
	}

	canvas.ontouchmove = function(event)
	{	
		event.preventDefault();
		console.log(event);
		console.log(event.touches[0].pageX, event.touches[0].pageY);
		if(drawing)
		{
			draw_point(event.touches[0].pageX - event.target.offsetLeft, 
					   event.touches[0].pageY - event.target.offsetTop, 4, ctx);
		}
	}

	canvas.ontouchend = function(event)
	{
		drawing = false;

		send_image(canvas);
	}

	canvas.ontouchout = function(event)
	{
		drawing = false;

		send_image(canvas);
	}

	//////////////////////////////////////////////////////
	//               Clear Button Events                //
	//////////////////////////////////////////////////////

	clear_button.onclick = function(event)
	{
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

};

window.onresize = function(event)
{
	var canvas = document.getElementById("canvas");
	canvas_style = getComputedStyle(canvas);
	canvas.setAttribute('width', parseInt(canvas_style.width));
	canvas.setAttribute('height', parseInt(canvas_style.height));
}


function draw_point(x,y,size,ctx)
{

	if(x==prevX && y==prevY)
	{
		ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.fillRect(x, y, size, size);
        ctx.closePath();
	}

	ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "white";
    ctx.lineWidth = size;
    ctx.stroke();
    ctx.closePath();

    prevX=x;
    prevY=y;

	/*
	ctx.fillStyle="white";
	ctx.beginPath();
	ctx.ellipse(x, y, size, size, 0, 0, 2*Math.PI, false);
	ctx.fill();
	*/
}

function send_image(canvas)
{	
	/*
	var img = canvas.toDataURL("image/jpeg");

	var req = new XMLHttpRequest();
	req.open("POST", protocol + "://" + server + "/upload", true);
	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	req.onreadystatechange = function () 
	{	
		if (req.readyState == XMLHttpRequest.DONE) {
			//Uploaded
			console.log(req.responseText)
		}
	};

	req.send(img);
	*/

	
	canvas.toBlob(function(blob)
	{
		var req = new XMLHttpRequest();
		req.open("POST", protocol + "://" + server + "/upload", true);
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

		req.onreadystatechange = function () 
		{	
			if (req.readyState == XMLHttpRequest.DONE) {
				//Uploaded
				document.getElementById("output_text").innerHTML = req.responseText;
				//console.log(req.responseText)
			}
		};

		req.send(blob);

	}, "image/jpeg", 1);
	
}