(function () {
    "use strict";
	/*********************************
	 * Helper fnuctions
	 *********************************/
	var __randomFloat = function (min, max)
	{
		return min + Math.random()*(max-min);
	};
	
	var __addEventHandler = function (elem,eventType,handler) {
		if (elem.addEventListener)
			elem.addEventListener (eventType,handler,false);
		else if (elem.attachEvent)
			elem.attachEvent ('on'+eventType,handler); 
	};


	/*********************************
	 * Particle Class
	 *********************************/
	var Particle = function () {
		this.scale = 1.0;
		this.x = 0;
		this.y = 0;
		this.radius = 20;
		this.color = "#000";
		this.velocityX = 0;
		this.velocityY = 0;
		this.scaleSpeed = 0.5;
    };

	var __drawStar = function (context2D, cx, cy, spikes, outerRadius, innerRadius) {
		var rot = Math.PI / 2 * 3;
		var x = cx;
		var y = cy;
		var step = Math.PI / spikes;
	
		context2D.strokeSyle = "#000";
		context2D.beginPath();
		context2D.moveTo(cx, cy - outerRadius)
		for (var i = 0; i < spikes; i++) {
			x = cx + Math.cos(rot) * outerRadius;
			y = cy + Math.sin(rot) * outerRadius;
			context2D.lineTo(x, y)
			rot += step
	
			x = cx + Math.cos(rot) * innerRadius;
			y = cy + Math.sin(rot) * innerRadius;
			context2D.lineTo(x, y)
			rot += step
		}
		context2D.lineTo(cx, cy - outerRadius)
		context2D.closePath();
		context2D.lineWidth=5;
		context2D.strokeStyle='blue';
		context2D.stroke();
		context2D.fillStyle='skyblue';
		context2D.fill();
	
	};


	Particle.prototype = {
		constructor : Particle,
		update :  function(ms)
		{
			// shrinking
			this.scale -= this.scaleSpeed * ms / 1000.0;
			
			if (this.scale <= 0)
			{
				this.scale = 0;
			}
			
			// moving away from explosion center
			this.x += this.velocityX * ms/1000.0;
			this.y += this.velocityY * ms/1000.0;
		},
		draw: function(context2D)
		{
			// translating the 2D context to the particle coordinates
			context2D.save();
			context2D.translate(this.x, this.y);
			context2D.scale(this.scale, this.scale);
			
			// drawing a filled circle in the particle's local space
			context2D.beginPath();
			context2D.arc(0, 0, this.radius, 0, Math.PI*2, true);
			context2D.closePath();
			
			context2D.fillStyle = this.color;
			context2D.fill();
			
			//__drawStar(context2D,this.x, this.y, 5, 30, 15)
			
			context2D.restore();
		}
	};
	
	/*********************************
	 * JsExplosion Class
	 *********************************/
	var __canvas,
	    __context2D,
	    __particles = [],
	    __frameRate = 60.0,
	    __frameDelay = 1000.0 / __frameRate,
		__canvasWidth = 150,//;window.innerWidth,
		__canvasHeight = 150,//window.innerHeight,
		__canvasWidthHalf = __canvasWidth / 2,
		__canvasHeightHalf = __canvasHeight / 2; 
	   
    var JsExplosion = function () {
		__initializeCanvas.call(this);
		__registerEvents.call(this);
		__activateExplosions.call(this);
    };
	
	var __initializeCanvas = function () {
		__canvas = document.createElement("canvas");
		__canvas.id = "canvas";
		__canvas.setAttribute('width',__canvasWidth);
		__canvas.setAttribute('height',__canvasHeight);
		__canvas.setAttribute('style', 'pointer-events:none;position: absolute; z-index: 1000000; left: -' + __canvasWidth + 'px; top: -' + __canvasHeight + 'px;border: 5px solid blue;');
		//__canvas.setAttribute('style', 'pointer-events:none;position: absolute; z-index: 1000000; left:0; top:0;border: 5px solid blue;');
		document.body.insertBefore(__canvas, document.body.firstChild);
		//document.body.appendChild(canvas);
		__context2D = __canvas.getContext("2d");
	};
	
	var __registerEvents = function () {
		var self = this;
		
		__addEventHandler(window, "click", function(e) {
			var target,
				posX,
				posY;
				
			e = e || event;   
			target = e.target || e.srcElement; 
			
			posX = event.clientX;
			posY = event.clientY; 
			
			if (target.nodeName != "BODY" && 
				target.nodeName != "HTML" && 
				target.nodeName != "CANVAS") {
								
				target.parentNode.removeChild(target);
				
				__createComplexExplosion.call(self, posX, posY);
			}
			return false;
		});
	};
	
	var __activateExplosions = function () {
		var self = this;
		setInterval(function() {
			__update.call(self, __frameDelay);
		}, __frameDelay);
	};
		
	var __update = function (frameDelay)
	{
		__context2D.clearRect(0, 0, __canvas.width, __canvas.height);
		
		// update and draw particles
		for (var i = 0; i < __particles.length; i++)
		{
			var particle = __particles[i];
			
			particle.update(frameDelay);
			particle.draw(__context2D);
		}
	};
	
	var __createComplexExplosion = function (posX, posY) {
		this.createExplosion(posX, posY, "#53397F");
		this.createExplosion(posX, posY, "#FF6600");
	}
	
    JsExplosion.prototype = {
        constructor : JsExplosion,
				
		createExplosion : function (posX, posY, color) {
			var minSize = 10;
			var maxSize = 30;
			var count = 10;
			var minSpeed = 60.0;
			var maxSpeed = 200.0;
			var minScaleSpeed = 1.0;
			var maxScaleSpeed = 4.0;
			
			__canvas.setAttribute('style', 'pointer-events:none;position: absolute; z-index: 1000000; left: ' + (posX - __canvasWidthHalf) + 'px; top: ' + (posY - __canvasHeightHalf) + 'px;border: 5px solid blue;');
			
			for (var angle=0; angle<360; angle += Math.round(360/count))
			{
				var particle = new Particle();
				
				particle.x = __randomFloat(__canvasWidthHalf - 2, __canvasWidthHalf + 2);
				particle.y = __randomFloat(__canvasHeightHalf - 2, __canvasHeightHalf + 2);
				
				particle.radius = __randomFloat(minSize, maxSize);
				
				particle.color = color;
				
				particle.scaleSpeed = __randomFloat(minScaleSpeed, maxScaleSpeed);
				
				var speed = __randomFloat(minSpeed, maxSpeed);
				
				particle.velocityX = speed * Math.cos(angle * Math.PI / 180.0);
				particle.velocityY = speed * Math.sin(angle * Math.PI / 180.0);
				
				__particles.push(particle);
			}
		}
    };

    window.JsExplosion = new JsExplosion();
}());