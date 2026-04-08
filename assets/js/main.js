/*
	Portfolio v4 — Vanilla JS (no jQuery)
	Preserves all original Dimension template behavior:
	hash routing, ESC close, click-outside close, history.pushState,
	is-article-visible / is-switching state machine, 325ms animation timing.
*/

(function() {

	var body        = document.body,
		wrapper     = document.getElementById('wrapper'),
		header      = document.getElementById('header'),
		footer      = document.getElementById('footer'),
		main        = document.getElementById('main'),
		articles    = Array.from(main.querySelectorAll('article'));

	// Breakpoints — defined here for reference; CSS media queries handle the actual layout.
	// (breakpoints.min.js is no longer loaded)

	// Remove is-preload after paint to trigger entry animations.
	window.addEventListener('load', function() {
		setTimeout(function() {
			body.classList.remove('is-preload');
		}, 100);
	});

	// Nav: add "middle" alignment classes for even number of items.
	(function() {
		var nav    = header.querySelector('nav'),
			navLis = nav ? Array.from(nav.querySelectorAll('li')) : [];

		if (navLis.length % 2 === 0) {
			nav.classList.add('use-middle');
			navLis[navLis.length / 2].classList.add('is-middle');
		}
	})();

	// -------------------------------------------------------------------------
	// Main article show / hide state machine
	// -------------------------------------------------------------------------

	var delay  = 325,
		locked = false;

	function showArticle(id, initial) {
		var article = articles.find(function(a) { return a.id === id; });
		if (!article) return;

		// Fast-path: locked or initial load — skip delays.
		if (locked || initial === true) {
			body.classList.add('is-switching');
			body.classList.add('is-article-visible');
			articles.forEach(function(a) { a.classList.remove('active'); a.style.display = ''; });
			header.style.display = 'none';
			footer.style.display = 'none';
			main.style.display   = '';
			article.style.display = '';
			article.classList.add('active');
			locked = false;
			setTimeout(function() {
				body.classList.remove('is-switching');
			}, initial ? 1000 : 0);
			return;
		}

		locked = true;

		if (body.classList.contains('is-article-visible')) {
			// Swap articles.
			var current = articles.find(function(a) { return a.classList.contains('active'); });
			if (current) current.classList.remove('active');

			setTimeout(function() {
				if (current) current.style.display = 'none';
				article.style.display = '';
				setTimeout(function() {
					article.classList.add('active');
					window.scrollTo(0, 0);
					setTimeout(function() { locked = false; }, delay);
				}, 25);
			}, delay);

		} else {
			// Show from landing.
			body.classList.add('is-article-visible');

			setTimeout(function() {
				header.style.display = 'none';
				footer.style.display = 'none';
				main.style.display   = '';
				article.style.display = '';
				setTimeout(function() {
					article.classList.add('active');
					window.scrollTo(0, 0);
					setTimeout(function() { locked = false; }, delay);
				}, 25);
			}, delay);
		}
	}

	function hideArticle(addState) {
		var article = articles.find(function(a) { return a.classList.contains('active'); });

		if (!body.classList.contains('is-article-visible')) return;

		if (addState === true) history.pushState(null, null, '#');

		// Fast-path: locked.
		if (locked) {
			body.classList.add('is-switching');
			if (article) { article.classList.remove('active'); article.style.display = 'none'; }
			main.style.display   = 'none';
			footer.style.display = '';
			header.style.display = '';
			body.classList.remove('is-article-visible');
			locked = false;
			body.classList.remove('is-switching');
			window.scrollTo(0, 0);
			return;
		}

		locked = true;
		if (article) article.classList.remove('active');

		setTimeout(function() {
			if (article) article.style.display = 'none';
			main.style.display = 'none';
			footer.style.display = '';
			header.style.display = '';

			setTimeout(function() {
				body.classList.remove('is-article-visible');
				window.scrollTo(0, 0);
				setTimeout(function() { locked = false; }, delay);
			}, 25);
		}, delay);
	}

	// -------------------------------------------------------------------------
	// Inject close button into each article
	// -------------------------------------------------------------------------

	articles.forEach(function(article) {
		var closeBtn = document.createElement('div');
		closeBtn.className = 'close';
		closeBtn.textContent = 'Close';
		closeBtn.addEventListener('click', function() {
			location.hash = '';
		});
		article.appendChild(closeBtn);

		// Prevent clicks inside the article from bubbling to body (which hides it).
		article.addEventListener('click', function(e) {
			e.stopPropagation();
		});
	});

	// -------------------------------------------------------------------------
	// Events
	// -------------------------------------------------------------------------

	// Click outside article → hide.
	body.addEventListener('click', function() {
		if (body.classList.contains('is-article-visible')) hideArticle(true);
	});

	// ESC key → hide.
	window.addEventListener('keyup', function(e) {
		if (e.key === 'Escape' || e.keyCode === 27) {
			if (body.classList.contains('is-article-visible')) hideArticle(true);
		}
	});

	// Hash change → show/hide matching article.
	window.addEventListener('hashchange', function(e) {
		if (location.hash === '' || location.hash === '#') {
			e.preventDefault();
			hideArticle();
		} else {
			var id = location.hash.slice(1);
			if (articles.some(function(a) { return a.id === id; })) {
				e.preventDefault();
				showArticle(id);
			}
		}
	});

	// -------------------------------------------------------------------------
	// Scroll restoration (prevent scroll-to-top on hash change)
	// -------------------------------------------------------------------------

	if ('scrollRestoration' in history) {
		history.scrollRestoration = 'manual';
	} else {
		var oldScrollPos = 0, scrollPos = 0;
		window.addEventListener('scroll', function() {
			oldScrollPos = scrollPos;
			scrollPos = window.pageYOffset;
		});
		window.addEventListener('hashchange', function() {
			window.scrollTo(0, oldScrollPos);
		});
	}

	// -------------------------------------------------------------------------
	// Initialize
	// -------------------------------------------------------------------------

	// Hide main and all articles by default.
	main.style.display = 'none';
	articles.forEach(function(a) { a.style.display = 'none'; });

	// Show article from URL hash on initial load.
	if (location.hash !== '' && location.hash !== '#') {
		window.addEventListener('load', function() {
			showArticle(location.hash.slice(1), true);
		});
	}

})();
