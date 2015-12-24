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
	    __snowflakes,
		__fps,
		__intervalTime,
		__horizontalSwingFactor,
        __windFactor,
		__now,
 		__then,
 		__delta;
		
		
	var JsSnow = function (options) {
		__updateOptions.call(this, options);
	};
	
	var __updateOptions = function (options) {
		//Default Options
		__fps = 30;
		__intervalTime = 1000/__fps;
		__then = Date.now();
		__maxHeight = window.innerHeight;
		__maxWidth = window.innerWidth;
		__resizeWidth = true;
		__resizeHeight = true;
		__maxSnowflakes = 250;
		__maxSizeSnowflake = 5;
		__horizontalSwingFactor = 2;
        __windFactor = 0.5;
		__snowflakes = [];
		
		__configureOptions.call(this, options);
		__createCanvas.call(this);
		__initializeEvents.call(this);
		__createInitialSnowflakes.call(this,__maxSnowflakes);
		
		__drawSnowflakes.call(this);
	};
	
	var __configureOptions = function (options) {
		//Configure FPS
		if (options && options.fps) {
			__fps = parseInt(options.fps);
			__intervalTime = 1000/__fps;
		}
		else if (window.JsSnowOptions && window.JsSnowOptions.fps) {
			__fps = parseInt(window.JsSnowOptions.fps);
			__intervalTime = 1000/__fps;
		}
		
		//Configure Canvas Witdh
		if (options && 
			options.maxWidth && 
			options.maxWidth > 0) {
			__maxWidth = parseInt(options.maxWidth);
			__resizeWidth = false;
		}
		else if (window.JsSnowOptions && 
				window.JsSnowOptions.maxWidth && 
				window.JsSnowOptions.maxWidth > 0) {
			__maxWidth = parseInt(window.JsSnowOptions.maxWidth);
			__resizeWidth = false;
		} 
		
		//Configure Canvas Height
		if (options && 
			options.maxHeight && 
			options.maxHeight > 0) {
			__maxHeight = parseInt(options.maxHeight);
			__resizeHeight = false;
		}
		else if (window.JsSnowOptions && 
				window.JsSnowOptions.maxHeight && 
				window.JsSnowOptions.maxHeight > 0) {
			__maxHeight = parseInt(window.JsSnowOptions.maxHeight);
			__resizeHeight = false;
		} 
		
		//Configure Number of Snowflakes
		if (options && options.snowflakesNumber) {
			__maxSnowflakes = parseInt(options.snowflakesNumber);
		}
		else if (window.JsSnowOptions && window.JsSnowOptions.snowflakesNumber) {
			__maxSnowflakes = parseInt(window.JsSnowOptions.snowflakesNumber);
		} 
		
		//Configure Wind Factor
		if (options && options.windFactor) {
			__windFactor = parseFloat(options.windFactor);
		}
		else if (window.JsSnowOptions && window.JsSnowOptions.windFactor) {
			__windFactor = parseFloat(window.JsSnowOptions.windFactor);
		}
		
		//Configure Snowflake maxSize
		if (options && options.maxSizeSnowflake) {
			__maxSizeSnowflake = parseInt(options.maxSizeSnowflake);
		}
		else if (window.JsSnowOptions && window.JsSnowOptions.maxSizeSnowflake) {
			__maxSizeSnowflake = parseInt(window.JsSnowOptions.maxSizeSnowflake);
		} 
		
		//Configure horizontal Swing Factor
		if (options && options.horizontalSwingFactor) {
			__horizontalSwingFactor = options.horizontalSwingFactor > 0 ? parseInt(options.horizontalSwingFactor) : 1;
		}
		else if (window.JsSnowOptions && window.JsSnowOptions.horizontalSwingFactor) {
			__horizontalSwingFactor = window.JsSnowOptions.horizontalSwingFactor > 0 ? parseInt(window.JsSnowOptions.horizontalSwingFactor): 1;
		} 
	};
	
	var __createCanvas = function () {
		__canvas = document.getElementById("JsSnowCanvas") || document.createElement("canvas");
		__canvas.id = "JsSnowCanvas";
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
		
		// Limit the frame-rate being targeted with requestAnimationFrame
		// https://gist.github.com/addyosmani/5434533
			
		requestAnimationFrame(__drawSnowflakes);
     
		__now = Date.now();
		__delta = __now - __then;
		
		if (__delta > __intervalTime) {
			// update time stuffs
			
			// Just `then = now` is not enough.
			// Lets say we set fps at 10 which means
			// each frame must take 100ms
			// Now frame executes in 16ms (60fps) so
			// the loop iterates 7 times (16*7 = 112ms) until
			// delta > interval === true
			// Eventually this lowers down the FPS as
			// 112*10 = 1120ms (NOT 1000ms).
			// So we have to get rid of that extra 12ms
			// by subtracting delta (112) % interval (100).
			// Hope that makes sense.
			
			__then = __now - (__delta % __intervalTime);

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
		}
	};
	
	var __angle = 0;
	var __updateSnowflakesPosition = function () {
		__angle += 0.01;
		for(var i = 0; i < __maxSnowflakes; i++)
		{
			var p = __snowflakes[i];
			
			//We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
			//Every particle has its own density which can be used to make the downward movement different for each flake
			//Lets make it more random by adding in the radius
			p.x += Math.cos(__angle) + 1 * __horizontalSwingFactor + __windFactor;
			p.y += Math.sin(__angle + p.density) + 1 + p.radius / 2;	
			
			//Sending flakes back from the top when it exits
			//Lets make it a bit more organic and let flakes enter from the left and right also.
			if(p.x > __maxWidth + __maxSizeSnowflake || p.x < -__maxSizeSnowflake || p.y > __maxHeight)
			{
				if(i%3 > 0) //66.67% of the flakes
				{
					__snowflakes[i].x = Math.random() * __maxWidth;
					__snowflakes[i].y = -__maxSizeSnowflake;
				}
				else
				{
					//If the flake is exitting from the right
					if(p.x > __maxWidth + __maxSizeSnowflake)
					{
						//Enter from the left
						__snowflakes[i].x = -__maxSizeSnowflake;
						__snowflakes[i].y = Math.random() * __maxHeight;
					}
					else
					{
						//Enter from the right
						__snowflakes[i].x = __maxWidth + __maxSizeSnowflake;
						__snowflakes[i].y = Math.random() * __maxHeight;
					}
				}
			}
		}
	};
	
	JsSnow.prototype = {
		constructor : JsSnow,
		updateOptions : function (options)
		{
			__updateOptions.call(this, options);
		}
	};
	
	if (typeof module !== 'undefined' && module.exports) {
        module.exports = new JsSnow({});
    }
    else {
        window.JsSnow = new JsSnow({});
    }
}());


/*jshint ignore:start*/
// requestAnimationFrame polyfill
// https://gist.github.com/paulirish/1579671
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
/*jshint ignore:end*/ 