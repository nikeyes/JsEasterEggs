/*Based on: 
http://thecodeplayer.com/walkthrough/html5-canvas-snow-effect
http://jumptofive.com/canvas-como-crear-efecto-de-nieve-cayendo/
*/
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
		__resizeWidth,
		__resizeHeight,
		__canvas,
		__ctx,
		__maxSnowflakes,
		__maxSizeSnowflake,
	    __snowflakes = [],
		__fps,
		__interval,
		__horizontalSwingFactor,
        __windFactor;
		
	var JsSnow = function (options) {
		//Default Options
		__fps = 30;
		__interval = 1000/__fps;
		__maxHeight = window.innerHeight;
		__maxWidth = window.innerWidth;
		__resizeWidth = true;
		__resizeHeight = true;
		__maxSnowflakes = 500;
		__maxSizeSnowflake = 5;
		__horizontalSwingFactor = 2;
        __windFactor = 1;
		
		__configureOptions.call(this, options);
		__createCanvas.call(this);
		__initializeEvents.call(this);
		__createInitialSnowflakes.call(this,__maxSnowflakes);
		
		/*To simplify the code I use setInterval instead of requestAnimationFrame
		You can view the changes in this commit: 
		"replace setInterval with requestAnimationFrame(__draw);"*/
		setInterval(__drawSnowflakes, __interval);
	};

	var __configureOptions = function (options) {
		//Configure FPS
		if (options && options.fps) {
			__fps = options.fps;
			__interval = 1000/__fps;
		}
		else if (window.JsSnowOptions && window.JsSnowOptions.fps) {
			__fps = window.JsSnowOptions.fps;
			__interval = 1000/__fps;
		}
		
		//Configure Canvas Witdh
		if (options && options.maxWidth) {
			__maxWidth = options.maxWidth;
			__resizeWidth = false;
		}
		else if (window.JsSnowOptions && window.JsSnowOptions.maxWidth) {
			__maxWidth = window.JsSnowOptions.maxWidth;
			__resizeWidth = false;
		} 
		
		//Configure Canvas Height
		if (options && options.maxHeight) {
			__maxHeight = options.maxHeight;
			__resizeHeight = false;
		}
		else if (window.JsSnowOptions && window.JsSnowOptions.maxHeight) {
			__maxHeight = window.JsSnowOptions.maxHeight;
			__resizeHeight = false;
		} 
		
		//Configure Number of Snowflakes
		if (options && options.snowflakesNumber) {
			__maxSnowflakes = options.snowflakesNumber;
		}
		else if (window.JsSnowOptions && window.JsSnowOptions.snowflakesNumber) {
			__maxSnowflakes = window.JsSnowOptions.snowflakesNumber;
		} 
		
		//Configure Winf Factor
		if (options && options.windFactor) {
			__windFactor = options.windFactor;
		}
		else if (window.JsSnowOptions && window.JsSnowOptions.windFactor) {
			__windFactor = window.JsSnowOptions.windFactor;
		} 
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
	
	var __initializeEvents = function () {
		__addEventHandler(window, "resize", function() {
			if (__resizeWidth === true)
			{
				__maxWidth = window.innerWidth;
				__canvas.width = __maxWidth;	
			}
			if (__resizeHeight === true)
			{
				__maxHeight = window.innerHeight;
				__canvas.height = __maxHeight;	
			}
		});	
	};
	
	var __createInitialSnowflakes = function (snowflakesNumber) {
		for(var i = 0; i < snowflakesNumber; i++)
		{
			__snowflakes.push({
				x: Math.random() * __maxWidth,
				y: Math.random() * __maxHeight, 
				radius: Math.random() * __maxSizeSnowflake,
				density: Math.random() * __maxSnowflakes
			});
		}
	};
	
	var __drawSnowflakes = function () {
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
			__updateSnowflakesPosition.call(this);	
			
	};
	
	var angle = 0;
	var __updateSnowflakesPosition = function () {
		angle += 0.01;
		for(var i = 0; i < __maxSnowflakes; i++)
		{
			var p = __snowflakes[i];
			
			//We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
			//Every particle has its own density which can be used to make the downward movement different for each flake
			//Lets make it more random by adding in the radius
			p.x += Math.sin(angle) * __horizontalSwingFactor + __windFactor;
			p.y += ((Math.cos(angle + p.density) + 1) + p.radius / 2);
			
			//Sending flakes back from the top when it exits
			//Lets make it a bit more organic and let flakes enter from the left and right also.
			if(p.x > __maxWidth + 5 || p.x < -5 || p.y > __maxHeight)
			{
				if(i%3 > 0) //66.67% of the flakes
				{
					__snowflakes[i].x = Math.random() * __maxWidth;
					__snowflakes[i].y = -10;
				}
				else
				{
					//If the flake is exitting from the right
					if(Math.sin(angle) > 0)
					{
						//Enter from the left
						__snowflakes[i].x = -5;
					}
					else
					{
						//Enter from the right
						__snowflakes[i].x = __maxWidth + 5;
					}
					__snowflakes[i].y = Math.random() * __maxHeight;
				}
			}
		}
	};
	
	JsSnow.prototype = {
		constructor : JsSnow,
	};
	
	new JsSnow({});
}());

