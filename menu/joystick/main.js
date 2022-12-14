function setTouch() {
	var touch = {};

	/*
	 * Joystick
	 */
	touch.joystick = {};
	touch.joystick.active = false; // time tick

	touch.joystick.$element = document.createElement("div");
	touch.joystick.$element.style.position = "fixed";
	touch.joystick.$element.style.bottom = "10px";
	touch.joystick.$element.style.left = "10px";
	touch.joystick.$element.style.width = "170px";
	touch.joystick.$element.style.height = "170px";
	touch.joystick.$element.style.borderRadius = "50%";
	document.body.appendChild(touch.joystick.$element);

	touch.joystick.$cursor = document.createElement("div"); // 游标
	touch.joystick.$cursor.style.width = "60px";
	touch.joystick.$cursor.style.height = "60px";
	touch.joystick.$cursor.style.position = "absolute";
	touch.joystick.$cursor.style.top = "calc(50% - 30px)";
	touch.joystick.$cursor.style.left = "calc(50% - 30px)";
	touch.joystick.$cursor.style.backgroundColor = "#fff";
	touch.joystick.$cursor.style.opacity = "0.2";
	touch.joystick.$cursor.style.borderRadius = "50%";
	touch.joystick.$element.appendChild(touch.joystick.$cursor);

	touch.joystick.$limit = document.createElement("div"); // 限制框
	touch.joystick.$limit.style.position = "absolute";
	touch.joystick.$limit.style.width = "150px";
	touch.joystick.$limit.style.height = "150px";
	touch.joystick.$limit.style.top = "calc(50% - 77px)";
	touch.joystick.$limit.style.left = "calc(50% - 77px)";
	touch.joystick.$limit.style.borderRadius = "50%";
	touch.joystick.$limit.style.border = "2px solid #fff";
	touch.joystick.$limit.style.opacity = "0.25";
	touch.joystick.$limit.style.transition = "opacity 0.3 0.0";
	touch.joystick.$element.appendChild(touch.joystick.$limit);

	// angle
	touch.joystick.angle = {};

	touch.joystick.angle.center = {};
	touch.joystick.angle.center.x = 0;
	touch.joystick.angle.center.y = 0;

	touch.joystick.angle.current = {};
	touch.joystick.angle.current.x = 0;
	touch.joystick.angle.current.y = 0;

	function resize() {
		var boundings = touch.joystick.$element.getBoundingClientRect();

		touch.joystick.angle.center.x = boundings.left + boundings.width * 0.5;
		touch.joystick.angle.center.y = boundings.top + boundings.height * 0.5;
	}
	resize();

	// time tick
	function render() {
		if (touch.joystick.active) {
			// active
			// calculate angle
			touch.joystick.angle.value = Math.atan2(
				touch.joystick.angle.current.y - touch.joystick.angle.center.y,
				touch.joystick.angle.current.x - touch.joystick.angle.center.x
			);

			//update joystick
			const distance = Math.hypot(
				touch.joystick.angle.current.y - touch.joystick.angle.center.y,
				touch.joystick.angle.current.x - touch.joystick.angle.center.x
			);

			let radius = distance;
			if (radius > 43) {
				radius = 43;
			}

			const cursorX = radius * Math.cos(touch.joystick.angle.value);
			const cursorY = radius * Math.sin(touch.joystick.angle.value);

			touch.joystick.$cursor.style.transform = `translateX(${cursorX}px) translateY(${cursorY}px)`;
		}

		requestAnimationFrame(render);
	}
	render();

	// Events
	touch.joystick.events = {};
	touch.joystick.touchIdentifier = null;

	touch.joystick.events.touchstart = (_event) => {
		touch.joystick.touched = true;

		const _touch = _event.changedTouches[0];

		if (_touch) {
			touch.joystick.touchIdentifier = _touch.identifier;

			touch.joystick.$limit.style.opacity = "0.7";
			touch.joystick.$cursor.style.opacity = "0.7";

			touch.joystick.angle.current.x = _touch.clientX;
			touch.joystick.angle.current.y = _touch.clientY;

			document.addEventListener("touchend", touch.joystick.events.touchend);
			document.addEventListener("touchmove", touch.joystick.events.touchmove, {
				passive: false
			});
		}
	};

	touch.joystick.events.touchmove = (_event) => {
		const touches = [..._event.changedTouches];
		const _touch = touches.find(
			(__touch) => __touch.identifier === touch.joystick.touchIdentifier
		); //  find() 方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined。

		if (_touch) {
			touch.joystick.active = true;

			touch.joystick.angle.current.x = _touch.clientX;
			touch.joystick.angle.current.y = _touch.clientY;
		}
	};

	touch.joystick.events.touchend = (_event) => {
		const touches = [..._event.changedTouches];
		const _touch = touches.find(
			(__touch) => __touch.identifier === touch.joystick.touchIdentifier
		);

		if (_touch) {
			touch.joystick.active = false;

			touch.joystick.$limit.style.opacity = "0.2";
			touch.joystick.$cursor.style.opacity = "0.2";

			touch.joystick.$cursor.style.transform = `translateX(0px) translateY(0px)`;

			document.removeEventListener("touchend", touch.joystick.events.touchend);
			document.removeEventListener("touchmove", touch.joystick.events.touchmove, {
				passive: false
			});
		}
	};

	touch.joystick.$element.addEventListener(
		"touchstart",
		touch.joystick.events.touchstart,
		{ passive: false }
	);

	/*
	 * Forward
	 */

	touch.forward = {};

	touch.forward.$element = document.createElement("div");
	touch.forward.$element.style.position = "fixed";
	touch.forward.$element.style.width = "95px";
	touch.forward.$element.style.height = "80px";
	touch.forward.$element.style.bottom = "100px";
	touch.forward.$element.style.right = "0px";
	touch.forward.$element.style.transition = "opacity 0.3 0.3";
	// touch.forward.$element.style.backgroundColor = "#000";
	document.body.appendChild(touch.forward.$element);

	touch.forward.$border = document.createElement("div");
	touch.forward.$border.style.position = "absolute";
	touch.forward.$border.style.width = "60px";
	touch.forward.$border.style.height = "60px";
	touch.forward.$border.style.border = "2px solid #fff";
	touch.forward.$border.style.borderRadius = "10px";
	touch.forward.$border.style.top = "calc(50% - 32px)";
	touch.forward.$border.style.left = "calc(50% - 32px)";
	touch.forward.$border.style.opacity = "0.2";
	touch.forward.$element.appendChild(touch.forward.$border);

	touch.forward.$icon = document.createElement("div");
	touch.forward.$icon.style.position = "absolute";
	touch.forward.$icon.style.width = "22px";
	touch.forward.$icon.style.height = "18px";
	touch.forward.$icon.style.top = "calc(50% - 9px)";
	touch.forward.$icon.style.left = "calc(50% - 11px)";
	// touch.forward.$icon.style.backgroundImage = "url(arrow.png)";
	touch.forward.$icon.style.backgroundImage =
		"url(https://i.postimg.cc/K89CYvDz/arrow.png)";
	touch.forward.$icon.style.backgroundSize = "cover";
	touch.forward.$element.appendChild(touch.forward.$icon);

	// Event
	touch.forward.events = {};
	touch.forward.touchIdentifier = null;
	touch.forward.events.touchstart = (_event) => {
		const _touch = _event.changedTouches[0];

		if (_touch) {
			touch.forward.touchIdentifier = _touch.identifier;

			touch.forward.$border.style.opacity = "0.7";

			document.addEventListener("touchend", touch.forward.events.touchend);
		}
	};

	touch.forward.events.touchend = (_event) => {
		const touches = [..._event.changedTouches];
		const _touch = touches.find(
			(__touch) => __touch.identifier === touch.forward.touchIdentifier
		);

		if (_touch) {
			touch.forward.$border.style.opacity = "0.2";

			document.removeEventListener("touchend", touch.forward.events.touchend);
		}
	};

	touch.forward.$element.addEventListener(
		"touchstart",
		touch.forward.events.touchstart
	);

	/*
	 * Backward
	 */
	touch.backward = {};

	touch.backward.$element = document.createElement("div");
	touch.backward.$element.style.position = "fixed";
	touch.backward.$element.style.width = "95px";
	touch.backward.$element.style.height = "80px";
	touch.backward.$element.style.bottom = "20px";
	touch.backward.$element.style.right = "0px";
	// touch.backward.$element.style.backgroundColor = "#000";
	document.body.appendChild(touch.backward.$element);

	touch.backward.$border = document.createElement("div");
	touch.backward.$border.style.position = "absolute";
	touch.backward.$border.style.width = "60px";
	touch.backward.$border.style.height = "60px";
	touch.backward.$border.style.border = "2px solid #fff";
	touch.backward.$border.style.borderRadius = "10px";
	touch.backward.$border.style.top = "calc(50% - 32px)";
	touch.backward.$border.style.left = "calc(50% - 32px)";
	touch.backward.$border.style.opacity = "0.2";
	touch.backward.$element.appendChild(touch.backward.$border);

	touch.backward.$icon = document.createElement("div");
	touch.backward.$icon.style.position = "absolute";
	touch.backward.$icon.style.width = "22px";
	touch.backward.$icon.style.height = "18px";
	touch.backward.$icon.style.top = "calc(50% - 9px)";
	touch.backward.$icon.style.left = "calc(50% - 11px)";
	// touch.backward.$icon.style.backgroundImage = "url(arrow.png)";
	touch.backward.$icon.style.backgroundImage =
		"url(https://i.postimg.cc/K89CYvDz/arrow.png)";
	touch.backward.$icon.style.transform = "rotate(180deg)";
	touch.backward.$icon.style.backgroundSize = "cover";
	touch.backward.$element.appendChild(touch.backward.$icon);

	// Event
	touch.backward.events = {};
	touch.backward.touchIdentifier = null;
	touch.backward.events.touchstart = (_event) => {
		const _touch = _event.changedTouches[0];

		if (_touch) {
			touch.backward.touchIdentifier = _touch.identifier;

			touch.backward.$border.style.opacity = "0.7";

			document.addEventListener("touchend", touch.backward.events.touchend);
		}
	};

	touch.backward.events.touchend = (_event) => {
		const touches = [..._event.changedTouches];
		const _touch = touches.find(
			(__touch) => __touch.identifier === touch.backward.touchIdentifier
		);

		if (_touch) {
			touch.backward.$border.style.opacity = "0.2";

			document.removeEventListener("touchend", touch.backward.events.touchend);
		}
	};

	touch.backward.$element.addEventListener(
		"touchstart",
		touch.backward.events.touchstart
	);
}

setTouch();