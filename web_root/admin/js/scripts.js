//
// VIA Admin JavaScript
//

// In the backend cookies are always allowed
setCookiesAllowed();


// Video manipulation in the backend

Number.prototype.secondsToVideoTime = function (withMs = false) {
  var sec_num = this;

  var h = Math.floor(sec_num / 3600);
  var m = Math.floor(sec_num % 3600 / 60);
  var s = Math.floor(sec_num % 3600 % 60);
  var centoseconds = Math.floor((sec_num % 1) * 100);

	var string = ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);

	if (withMs) {
		string = string + "." + ('00' + centoseconds).slice(-2);
	}
	
  return string
}


function videoTakeTime(videoElementId, inputElementId, withMs = false) {
	var ct = document.getElementById(videoElementId).currentTime;

	if (!withMs) {
		ct = Math.floor(ct);
	}
	
	$("#"+inputElementId).val(ct.secondsToVideoTime(withMs)).data("sec", ct)
}

function videoGoto(videoElementId, inputElementId) {
	document.getElementById(videoElementId).currentTime = $("#"+inputElementId).data("sec");
}



//
// Image mousover zoom
//

$.fn.jqZoom = function(options){
  $(this).each(function(i, dom){
    var me = $(dom);

		zoomBoxInit(me, options.selectorWidth, options.selectorHeight, options.viewerWidth, options.viewerHeight);
  })
}

function zoomBoxInit(targetImg, sWidth, sHeight, vWidth, vHeight){
  var zoom = $("<div />").addClass("zoomSelector").width(sWidth).height(sHeight);
	var imgUrl = targetImg[0].currentSrc;
  targetImg.after(zoom);
  targetImg.closest(".zoomBox").on({
    mousemove: function(e){
      var mouseX = e.pageX - targetImg.offset().left;
      var mouseY = e.pageY - targetImg.offset().top;
      var halfSWidth = sWidth/2, halfSHeight = sHeight/2;
      var realX, realY;
			
      if(mouseX < halfSWidth){
        realX = 0;
      }else if(mouseX + halfSWidth > targetImg.width()){
        realX = targetImg.width() - sWidth;
      }else{
        realX = mouseX - halfSWidth;
      }

      if(mouseY < halfSHeight){
        realY = 0;
      }else if(mouseY + halfSHeight > targetImg.height()){
        realY = targetImg.height() - sHeight;
      }else{
        realY = mouseY - halfSHeight;
      }
			
      zoom.css({
        left: realX,
        top: realY
      })

			var viewerBox = targetImg.data('viewerBox');
			var viewerImg = viewerBox.find("img");
      var viewerX = realX * (viewerImg.width() - viewerBox.width())/(targetImg.width() - sWidth);
      var viewerY = realY * (viewerImg.height() - viewerBox.height())/(targetImg.height() - sHeight);

      viewerImg.css({
        left: -viewerX,
        top: -viewerY
      })
    },
    mouseenter: function(){
			zoomBoxInitViewer(targetImg, imgUrl, vWidth, vHeight);
      zoom.css("display", "block");
      targetImg.data('viewerBox').css("display", "block");
    },
    mouseleave: function(){
      zoom.css("display", "none");
      targetImg.data('viewerBox').css("display", "none");
    }
  })
}

function zoomBoxInitViewer(targetImg, imgUrl, vWidth, vHeight){

  if (targetImg.data('viewerBox')) { return }

  var viewer = $("<div />").addClass("viewerBox").width(vWidth).height(vHeight);
//  var zoomBox = targetImg.closest(".zoomBox");

	targetImg.data('viewerBox', viewer);

	viewer.css({
    left: targetImg.width() + 15,
    top: 0
  })

  var img = $("<img src='"+imgUrl+"' />");
  viewer.append(img);
  targetImg.after(viewer);

}


/* Haupt JS init */
$(document).ready(function(){

  $("textarea").autosize();

	// If website uses Mapael
	if ($.mapael) {
		$.mapael.prototype.defaultOptions = {
			map: {
				cssClass: "map",
				tooltip: {
					cssClass: "mapTooltip"
				},
				defaultArea: {
					attrs: {
						fill: "#343434",
						stroke: "#5d5d5d",
						"stroke-width": 1,
						"stroke-linejoin": "round"
					},
					attrsHover: {
						fill: "#777777",
						animDuration: 300
					},
					text: {
						position: "inner",
						margin: 10,
						attrs: {
							"font-size": 15,
							fill: "#c7c7c7"
						},
						attrsHover: {
							fill: "#eaeaea",
							"animDuration": 300
						}
					},
					target: "_self",
					cssClass: "area"
				},
				defaultPlot: {
					type: "circle",
					size: 15,
					attrs: {
						fill: "#0088db",
						stroke: "#eee",
						"stroke-width": 1,
						"stroke-linejoin": "round"
					},
					attrsHover: {
						"stroke-width": 2,
						animDuration: 300
					},
					// tooltip: {
					// 	overflow: {right: true, bottom: false},
					// 	offset: {left: 10, top: -75}
					// },
					text: {
						position: "right",
						margin: 10,
						attrs: {
							"font-size": 15,
							fill: "#c7c7c7"
						},
						attrsHover: {
							fill: "#eaeaea",
							animDuration: 300
						}
					},
					target: "_self",
					cssClass: "plot"
				},
				defaultLink: {
					factor: 0.5,
					attrs: {
						stroke: "#0088db",
						"stroke-width": 2
					},
					attrsHover: {
						animDuration: 300
					},
					text: {
						position: "inner",
						margin: 10,
						attrs: {
							"font-size": 15,
							fill: "#c7c7c7"
						},
						attrsHover: {
							fill: "#eaeaea",
							animDuration: 300
						}
					},
					target: "_self",
					cssClass: "link"
				},
				zoom: {
					enabled: false,
					minLevel: 0,
					maxLevel: 10,
					step: 0.25,
					mousewheel: false,
					touch: false,
					animDuration: 200,
					animEasing: "linear",
					buttons: {
						"reset": {
							cssClass: "zoomButton zoomReset",
							content: "&#8226;", // bullet sign
							title: "Reset zoom"
						},
						"in": {
							cssClass: "zoomButton zoomIn",
							content: "+",
							title: "Zoom in"
						},
						"out": {
							cssClass: "zoomButton zoomOut",
							content: "&#8722;", // minus sign
							title: "Zoom out"
						}
					}
				}
			},
			legend: {
				redrawOnResize: true,
				area: [],
				plot: []
			},
			areas: {},
			plots: {},
			links: {}
		}
	};

	$("div.zoomBox img.lazy").on('lazyLoaded', function() {
		$(this).jqZoom({
			selectorWidth: 30,
			selectorHeight: 30,
			viewerWidth: 400,
			viewerHeight: 300
		})
	})
	
	// Lazy load von Bildern installieren
	setLazy();
	lazyLoad();

	// Performance schonen beim Scrollen
//	$(window).on('scroll', debounce(lazyLoad, 20, false));
	$(window).on('scroll', lazyLoad);

	
});
