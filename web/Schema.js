/**
 * https://github.com/vasyaod/pipe
 * Author: vasyaod (vasyaod@mail.ru)
 */

// Проверка существования неймспейса.
if (typeof Pipe == "undefined")
	Pipe = {};

Pipe.Schema = function(element, fileName) {
	this.data = {};
	this.fileName = fileName;
	this.element = element;
	this.stateManager = Pipe.StateManager;
	$(this.element).data("schema", this);
	
	this.init();
}

Pipe.Schema.prototype = {

	data: {},

	/**
	 * Менеджер состоянией, который обслуживает данную схему.
	 */
	stateManager: null,

	/**
	 * Инициализирует и загружает список прототипов
	 */
	init: function () {
		var self = this;
		var url = "data.php?action=load&file="+this.fileName;


		$.ajax({
			url: url,
			cache: false,
			dataType: 'json',
			success: function(data) {
				self.data = data;
				console.log("Загружена схема "+url+", количество деталей "+self.data.parts.length+".");
				self.processing();
			},
			error:function(jqXHR, textStatus, errorThrown) {
				alert("Ошибка загрузки схемы "+url);
			}
		});
	},

	_initPart: function (part) {
		var self = this;
		var partPrototype = Pipe.PartPrototypesManager.getPartPrototypeById(part.prototypeId);
		console.log("Загружена запчасть "+partPrototype.id+", img "+partPrototype.img+".");
		
		var img = $("<img class='part'/>");
		img.data("part", part);
		img.appendTo(this.element);

		if (part.top == null)
			part.top = 0;
		if (part.left == null)
			part.left = 0;
		if (part.angle == null)
			part.angle = 0;

		part.element = img[0];
		part.currentState = partPrototype.getDefaultState();

		part.getState = function() {
			return this.currentState;
		};

		part.setState = function(partStateName) {
			this.currentState = partPrototype.getStateByName(partStateName);
			this.refreshImg();
		};

		part.refreshImg = function() {
			$(this.element).attr("src", this.getState().img);

			$(this.element).css("top", this.top);
			$(this.element).css("left", this.left);

	//		$(this.element).offset({
	//			top: this.top,
	//			left: this.left
	//		});

			$(this.element).removeClass("rotate90");
			$(this.element).removeClass("rotate180");
			$(this.element).removeClass("rotate270");

			if (this.angle == 90) {
				$(this.element).addClass("rotate90");
			}
			if (this.angle == 180) {
				$(this.element).addClass("rotate180");
			}
			if (this.angle == 270) {
				$(this.element).addClass("rotate270");
			}

		}

		part.rotateCW = function() {

			this.angle += 90;
			if (this.angle >= 360)
				this.angle = 0;

			this.setAgnle(this.angle);
		}

		part.rotateCCW = function() {

			this.angle -= 90;
			if (this.angle <= 0)
				this.angle = 360;

			this.setAgnle(this.angle);
		}

		part.setAgnle = function(angle) {
			this.angle = angle;
			this.refreshImg();
		}

		part.setPosition = function(position) {
			this.top = position.top;
			this.left = position.left;
			this.refreshImg();
		}

		part.remove = function() {
			self.removePart(this);
		}

		part.doAction = function() {
		//	alert(this.action);
			if (this.action != null) {
				with (part) {
					eval(this.action);
				}
				//eval.call(part, this.action);
			}
		}

		part.refreshImg();
		self.onPartInited(part);
//*/
/*
		img.draggable({
			stop: function(event, ui) {
			//	$(img).removeClass("rotate90");
			//	$(img).removeClass("rotate180");
			//	$(img).removeClass("rotate270");

				part.setPosition($(this).position());
			}
		});
		img.on("dblclick", function() {
	//		alert("!!");
	///		part.rotate();
			var pWindow = $("<div/>");
			pWindow.css("top", img.position().top);
			pWindow.css("left", img.position().left);
			pWindow.css("position", "absolute");
			pWindow.appendTo(self.element);
			pWindow.hide();
			pWindow.css("width", 300);
			pWindow.css("height", 300);
			pWindow.css("background-color", "#fff");
			pWindow.css("background-repeat", "no-repeat");
			pWindow.css("background-size", "contain");
			pWindow.css("background-image", "url("+partPrototype.img+")");
			pWindow.slideDown(1000);
			pWindow.click(function() {
				pWindow.remove();
			});
			//window.open(partPrototype.img);

		});
	//*/
	//	img[0].addEventListener("dblclick", $.proxy(function() {
//
//			part.rotate();
//			return false;
//		}, part), true);

	},

	/**
	 * Метод устанавливает схеме новое состояние.
	 */
	setStates: function (states) {
		var self = this;
		$.each(states, function(partId, partStateName) {
			var parts = self.getPartsById(partId);
			if (parts.length > 0) {
				$.each(parts, function(index, part) {
					part.setState(partStateName);
				});
			}
		});
	},

	/**
	 * Метод обрабатывает загруженные данные.
	 */
	processing: function () {
		var self = this;

		// Проверяем есть ли у схемы размеры, если их нет, то укажем.
		// Если честно, то я вообще не уверен, что схеме нужны размеры,
		// но жизнь покажет!
		if (this.data.width == null)
			this.data.width = 640;
		if (this.data.height == null)
			this.data.height = 480;

		$(this.element).css("width", this.data.width);
		$(this.element).css("height", this.data.height);

		// Если у схемы есть фон то нужно его указать.
		if (this.data.background != null)
			$(this.element).css("background-image", "url("+this.data.background+")");

		$.each(this.data.parts, function(index, part) {
			self._initPart(part);
		});

		// После того как все детали проинициализированы, установим состояние
		// схемы.
		if (this.stateManager) {
			this.statesChangedListener = $.proxy(this.setStates,this);
			this.stateManager.attachListener("onStatesChanged", this.statesChangedListener);
			this.setStates(this.stateManager.getStates());		// Не дожидаемся генерации события, устанавливает
																// состояние сами.
		}

		this.onLoaded();
	},

	/**
	 * Возвращает СПИСОК деталей соответствующий данноиму id.
	 */
	getPartsById: function(id) {
		var res = [];
		$.each(this.data.parts, function(index, part) {
			if (part.id == id) {
				res.push(part);
			}
		});
		return res;
	},

	/**
	 * Метод создает новую запчасть на схеме.
	 */
	getCreatePartByPrototypeId: function(partPrototypeId) {

		var part = {
			prototypeId: partPrototypeId,
			angle: 0,
			top: 0,
			left: 0
		};

		this.data.parts.push(part);
		this._initPart(part);
	},

	/**
	 * Метод удаляет запчасть из схемы.
	 */
	removePart: function(part) {
        this.data.parts = $(this.data.parts).filter(function(){ return this != part; } )
		$(part.element).remove();
	},

	/**
	 * Метод возвращает состояние схемы для сохранения в
	 */
	getState: function() {
		var res = {
			width: this.data.width,
			height: this.data.height,
			background: this.data.background,
			parts:[]
		}
		$.each(this.data.parts, function(index, part) {
			res.parts.push({
				prototypeId: part.prototypeId,
				id: part.id,
				action: part.action,
				angle: part.angle,
				top: part.top,
				left: part.left
			});
		});

		return res;
	},

	/**
	 * Метод нужно вызывать для сборки мусора и удаление ресурсов.
	 */
	close: function() {
		if (this.stateManager) {
			this.stateManager.detachListener("onStatesChanged", this.statesChangedListener);
		}
	},

	/**
	 * Событие, срабатывает после загрузки списка.
	 */
	onLoaded: function() {},
	
	/**
	 * Событие возникает когда инициализируется новая деталь.
	 */
	onPartInited: function(part) {}
};

