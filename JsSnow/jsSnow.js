/*Based on: http://thecodeplayer.com/walkthrough/html5-canvas-snow-effect*/

window.onload = function(){
	//canvas init
	var maxWidth = window.innerWidth;
	var maxHeight = window.innerHeight;
	
	var canvas = document.createElement("canvas");
	canvas.id = "canvas";
	canvas.setAttribute('width', maxWidth);
	canvas.setAttribute('height', maxHeight);
	canvas.setAttribute('style', 'pointer-events:none;position: absolute; z-index: 1000000; left:0; top:0;');
	var ctx = canvas.getContext("2d");
		
	document.body.insertBefore(canvas, document.body.firstChild);
	
	//snowflake particles
	var maxSnowflakes = 1000; //max particles
	var snowflakes = [];
	for(var i = 0; i < maxSnowflakes; i++)
	{
		snowflakes.push({
			x: Math.random() * maxWidth,
			y: Math.random() * maxHeight, 
			radius: Math.random() * 5,
			density: Math.random() * maxSnowflakes
		})
	}
	
	//Lets draw the flakes
	function draw()
	{
		ctx.clearRect(0, 0, maxWidth, maxHeight);
		
		ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
		ctx.beginPath();
		for(var i = 0; i < maxSnowflakes; i++)
		{
			var snowflake = snowflakes[i];
			ctx.moveTo(snowflake.x, snowflake.y);
			ctx.arc(snowflake.x, snowflake.y, snowflake.radius, 0, Math.PI * 2, true);
		}
		ctx.fill();
		update();
	}
	
	//Function to move the snowflakes
	//angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
	var angle = 0;
	function update()
	{
		angle += 0.01;
		for(var i = 0; i < maxSnowflakes; i++)
		{
			var p = snowflakes[i];
			//Updating X and Y coordinates
			//We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
			//Every particle has its own density which can be used to make the downward movement different for each flake
			//Lets make it more random by adding in the radius
			p.y += Math.cos(angle + p.density) + 1 + p.radius / 2;
			p.x += Math.sin(angle) * 2;
			
			//Sending flakes back from the top when it exits
			//Lets make it a bit more organic and let flakes enter from the left and right also.
			if(p.x > maxWidth + 5 || p.x < -5 || p.y > maxWidth)
			{
				if(i%3 > 0) //66.67% of the flakes
				{
					snowflakes[i] = {x: Math.random() * maxWidth, y: -10, radius: p.radius, density: p.density};
				}
				else
				{
					//If the flake is exitting from the right
					if(Math.sin(angle) > 0)
					{
						//Enter from the left
						snowflakes[i] = {x: -5, y: Math.random() * maxHeight, radius: p.radius, density: p.density};
					}
					else
					{
						//Enter from the right
						snowflakes[i] = {x: maxWidth + 5, y: Math.random() * maxHeight, radius: p.radius, density: p.density};
					}
				}
			}
		}
	}
	
	//animation loop
	setInterval(draw, 33);
}