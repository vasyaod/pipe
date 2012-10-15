
(function ($) {

	$.fn.pipeDraggable = function(props) {
		// Вешаем обработчик на книпку "свернуть/развернуть"
		this.each( function() {
			var state = {
				element: this,

				down: function(event) {

					this.x = event.pageX;
					this.y = event.pageY;
					this.containerPosition = $(this.element).offset();
					$(this.element).addClass("unselectable");

					this.draged = true;
					this.moved = false;

				//	this.fn = this.element.onclick;
				//	this.element.onClick = null;
					$(this.element).attr("disabled", true);
					this.element.onclick = function(){return false};

					event.preventDefault();
				//	event.stopImmediatePropagation();
					event.stopPropagation();

				//	return false;
				},
					
				move: function(event) {
					
					if (!this.draged)
						return true;

					var tX = event.pageX;
					var tY = event.pageY;
					// Если сдвиг не очень большой, то стоим на месте.
					//if (!this.moved && Math.abs(tY - this.y) < PermGuide.deadRadius/2)
					//	return;
					this.moved = true;
					var top = this.containerPosition.top + (tY - this.y);
					var left = this.containerPosition.left + (tX - this.x);
					
					$(this.element).offset({ 
						top: top,
						left: left
					});

					event.preventDefault();
				//	event.stopImmediatePropagation();
					event.stopPropagation();

				//	return true;
				},
				
				up: function(event) {
					//alert("!");

					if (!this.draged)
						return true;
					this.draged = false;


					$(this.element).removeClass("unselectable");

					if (!this.moved)
						return true;
					this.moved = false;
					
					//this.element.onclick = this.fn;
					//if (tY - this.y > 0 && Math.abs(tY - this.y) > $(this.element).height()*0.25)
					//	this.closed = false;
					//else if (tY - this.y < 0 && Math.abs(tY - this.y) > $(this.element).height()*0.25)
					//	this.closed = true;

					//this.refresh();

					event.preventDefault();
				//	event.stopImmediatePropagation();
					event.stopPropagation();
					
					$.proxy(props.up, this.element)();
				//	return true;
				}
			};

			// Вешаем событие на кнопку сварачивания меню.
			$(this).on("mousedown", $.proxy(state.down, state));
			$(this).on("mousemove", $.proxy(state.move, state));
			$(this).on("mouseup", $.proxy(state.up, state));
			$(this).on("mouseleave", $.proxy(state.up, state));

		//	$(this).mouseup($.proxy(state.up, state));
		//	$(this).mouseleave($.proxy(state.up, state));
		//	this.addEventListener("mousedown", $.proxy(state.down, state));
		//	this.addEventListener("mousemove", $.proxy(state.move, state));
		//	this.addEventListener("mouseup", $.proxy(state.up, state));

			$(this).data("state", state);
		});
	};	

})(jQuery);