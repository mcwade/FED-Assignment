(function(){
	"use strict";

	var Carousel = (function() {
		var caroParent,
			navParent,
			caroItems,
			navItems,
			prevIndex = 1,
			windowWidth,
			_myHandler = {
				init: function() {
					var that = this
					caroParent = document.querySelector('.carousel section')
					navParent = document.querySelector('nav ul')

					this.loadData()
				},
				bindEvents: function () {
					var that = this
					caroItems = document.querySelectorAll('figure')
					navItems = document.querySelectorAll('nav li')

					for (var i = 0; i < navItems.length; i++) {
						var event = event // Fix for Firefox
						navItems[i].addEventListener("click", this.historyChange.bind(event,(i+1)))
					}

					// Detect Parameter
					var param = window.location.search.substr(1);
					if (param !== null && param != '') {
						param = param.split("=");
						if (parseInt(param[1]) > 0 && parseInt(param[1]) <= 10) {
							that.slideCaro(param[1] - 1)
						}
					} else {
						history.pushState({url: '/?id=1', page: 1}, 'New Page', '/?id=1');
					}

					// Detect Pop (browser buttons)
					window.addEventListener('popstate', function(e){
					    if (e.state !== null) { // console.log('pop',e.state.page)
					    	var p = e.state.page
					    	that.slideCaro(p - 1)
					    }
				  	})

				  	// Left & Right Arrow Control
				  	document.addEventListener("keydown", function(event) {
						switch (event.which) {
							case 37:
								if (prevIndex > 0) that.historyChange(prevIndex)
								event.preventDefault();
								break;
							case 39:
								if (prevIndex < 9) that.historyChange(prevIndex+2)
								event.preventDefault();
								break;
						}
					})
				},
				historyChange: function (index, item) {
					history.pushState({url: '/?id=' + (index), page: (index)}, 'New Page', '/?id=' + (index));
					Carousel.slideCaro((index - 1))
				},
				slideCaro: function (index) {
					var that = this
					for (var i = 0; i < caroItems.length; i++) {
						navItems[i].classList.remove('selected')
					}
					// Set Window Width & Duration
					windowWidth = window.innerWidth
					var duration = '.35'

					// Calc difference with prev & selected indexes
					var indexDif = Math.abs(prevIndex - index)
					windowWidth > 767 && indexDif < 4 ? duration = '.5' : duration = '.3'

					// Set left position of Carousel & Nav
					caroParent.style.left = - (index * 100) + 'vw';
					navItems[index].classList.add('selected')
					navParent.style.left = - (parseInt(index) * 122.4) + 'px';

					// Set Transition Speed
					caroParent.style.transitionDuration = (indexDif * duration) +'s';
					navParent.style.transitionDuration = (indexDif * duration) +'s';

					// Set prev index value
					prevIndex = index  // console.log('index', typeof index)
				},
				loadData: function () {
					var that = this
					function fetchJSONFile(path, callback) {
					    var httpRequest = new XMLHttpRequest();
					    httpRequest.onreadystatechange = function() {
					        if (httpRequest.readyState === 4) {
					            if (httpRequest.status === 200) {
					                var data = JSON.parse(httpRequest.responseText)
					                if (callback) callback(data);
					            }
					        }
					    }
					    httpRequest.open('GET', path);
					    httpRequest.send(); 
					}

					fetchJSONFile('../data/shows.json', function(data){
					    for (var i = 0; i < data.length; i++) {
					    	var img = data[i].product_image_url
					    	var title = data[i].title
					    	var episodes = data[i].episodes
					    	var selected = ''

					    	if (i == 0) selected = 'class="selected"'
					    	caroParent.innerHTML += '<figure data-index="' + i + '"><img src="..' + img + '" alt="' + title + '" /><figcaption><span>' + episodes + ' Episodes</span><h2>' + title + '</h2></figcaption></figure>'
					    	navParent.innerHTML += '<li ' + selected + ' data-index="' + (i+1) + '"><i></i></li>'
					    }

					    that.bindEvents()
					});
				}
			}
		return _myHandler;
	})();

	Carousel.init()
})();