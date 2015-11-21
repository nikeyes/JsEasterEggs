/*Based on: http://thecodeplayer.com/walkthrough/html5-canvas-snow-effect*/
(function () {
    "use strict";
	
	var __addEventHandler = function (elem,eventType,handler) {
		if (elem.addEventListener)
			elem.addEventListener (eventType,handler,false);
		else if (elem.attachEvent)
			elem.attachEvent ('on'+eventType,handler); 
	};
	
	var __maxWidth,
		__maxHeight,
		__canvas,
		__ctx,
		__maxSnowflakes,
	    __snowflakes = [],
		__fps = 30;

	var JsSnow = function (options) {
		//Configure Canvas Witdh
		if (options && options.maxWidth) {
			__maxWidth = options.maxWidth;
		}
		else if (window.JsSnowOptions && window.JsSnowOptions.maxWidth) {
			__maxWidth = window.JsSnowOptions.maxWidth;
		} 
		else {
			__maxWidth = window.innerWidth;	
		} 
		
		//Configure Canvas Height
		if (options && options.maxHeight) {
			__maxHeight = options.maxHeight;
		}
		else if (window.JsSnowOptions && window.JsSnowOptions.maxHeight) {
			__maxHeight = window.JsSnowOptions.maxHeight;
		} 
		else {
			__maxHeight = window.innerHeight;	
		}
		
		//Configure Number of Snowflakes
		if (options && options.snowflakesNumber) {
			__maxSnowflakes = options.snowflakesNumber;
		}
		else if (window.JsSnowOptions && window.JsSnowOptions.snowflakesNumber) {
			__maxSnowflakes = window.JsSnowOptions.snowflakesNumber;
		} 
		else {
			__maxSnowflakes = 500;	
		}
		
		
		__createCanvas.call(this);
		__initializeEvents.call(this);
		__createInitialSnowflakes.call(this,__maxSnowflakes);
		setInterval(__draw, 1000/__fps);
	};
	
	var __initializeEvents = function () {
		__addEventHandler(window, "resize", function() {
			__maxWidth = window.innerWidth;
			__maxHeight = window.innerHeight;
			__canvas.width = __maxWidth;
			__canvas.height = __maxHeight;
			//__maxSnowflakes -=10;
			//__createInitialSnowflakes.call(this,__maxSnowflakes);
		});	
	};
	
	var __createCanvas = function () {
		__canvas = document.createElement("canvas");
		__canvas.id = "canvas";
		__canvas.width = __maxWidth;
		__canvas.height = __maxHeight;
		__canvas.setAttribute('style', 'pointer-events:none;position: absolute; z-index: 1000000; left:0; top:0;');
		__ctx = __canvas.getContext("2d");
			
		document.body.insertBefore(__canvas, document.body.firstChild);		
	};
	
	var __createInitialSnowflakes = function (snowflakesNumber) {
		for(var i = 0; i < snowflakesNumber; i++)
		{
			__snowflakes.push({
				x: Math.random() * __maxWidth,
				y: Math.random() * __maxHeight, 
				radius: Math.random() * 5,
				density: Math.random() * __maxSnowflakes
			});
		}
	};
	
	var __draw = function () {
		__ctx.clearRect(0, 0, __maxWidth, __maxHeight);
	
		__ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
		__ctx.beginPath();
		for(var i = 0; i < __maxSnowflakes; i++)
		{
			var snowflake = __snowflakes[i];
			__ctx.moveTo(snowflake.x, snowflake.y);
			__ctx.arc(snowflake.x, snowflake.y, snowflake.radius, 0, Math.PI * 2, true);
		}
		
		__ctx.fill();
		__update.call(this);		
	};
	
	var angle = 0;
	var __update = function () {
		angle += 0.01;
		for(var i = 0; i < __maxSnowflakes; i++)
		{
			var p = __snowflakes[i];
			
			//angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
			//Updating X and Y coordinates
			//We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
			//Every particle has its own density which can be used to make the downward movement different for each flake
			//Lets make it more random by adding in the radius
			p.y += Math.cos(angle + p.density) + 1 + p.radius / 2;
			p.x += Math.sin(angle) * 2;
			
			//Sending flakes back from the top when it exits
			//Lets make it a bit more organic and let flakes enter from the left and right also.
			if(p.x > __maxWidth + 5 || p.x < -5 || p.y > __maxHeight)
			{
				if(i%3 > 0) //66.67% of the flakes
				{
					__snowflakes[i] = {x: Math.random() * __maxWidth, y: -10, radius: p.radius, density: p.density};
				}
				else
				{
					//If the flake is exitting from the right
					if(Math.sin(angle) > 0)
					{
						//Enter from the left
						__snowflakes[i] = {x: -5, y: Math.random() * __maxHeight, radius: p.radius, density: p.density};
					}
					else
					{
						//Enter from the right
						__snowflakes[i] = {x: __maxWidth + 5, y: Math.random() * __maxHeight, radius: p.radius, density: p.density};
					}
				}
			}
		}
	};
	
	JsSnow.prototype = {
		constructor : JsSnow,
	};
	
	new JsSnow({});
}());