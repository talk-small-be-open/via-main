// TBD Rewrite it, this is soooooo ugly


var alertcontainer;
var popupdiv;
var popupcontent;
var pop_heading;
var type_field;
var matches = document.getElementsByClassName('alertcontainer');

function rmx() {
  document.body.removeChild(matches.item(0));
}

function close_qual() {
  setTimeout(function() {
    while (matches.length > 0) {
      rmx();
    }
  }, 250);
}

function structure() {

	if (alertcontainer) {
    if (matches.length > 0) {
      rmx();
    }
  }
	
  alertcontainer = document.createElement('div');
  alertcontainer.className = 'alertcontainer';
  document.body.appendChild(alertcontainer);
  popupdiv = document.createElement('div');
  popupdiv.id = 'popupdiv';
  popupdiv.innerHTML = '<span id="closepopup" onclick="close_qual();" ><svg viewbox="0 0 40 40"  id="close-x" fill="#000"><path d="M 10,10 L 30,30 M 30,10 L 10,30" /></svg></span>';
  alertcontainer.appendChild(popupdiv);
}

function pop_simple_content(pop_simple) {
  pop_simple_structure = document.createElement('p');
  pop_simple_structure.id = 'pop_simple_structure';
  pop_simple_structure.textContent = pop_simple;
  popupdiv.appendChild(pop_simple_structure);
}



function heading(pop_heading_value) {
  pop_heading = document.createElement('p');
  pop_heading.id = 'pop_heading';
  pop_heading.textContent = pop_heading_value;
  popupdiv.appendChild(pop_heading);
}

function pop_content_head(pop_heading_content) {
  pop_head_content = document.createElement('p');
  pop_head_content.id = 'pop_head_content';
  pop_head_content.textContent = pop_heading_content;
  popupdiv.appendChild(pop_head_content);
}

function whitelayout() {
  pop_heading.style.color = "#000";
  pop_head_content.style.color = "#000";
}

function alertWithIcons(pop_heading_value, pop_heading_content) {
  structure();
  heading(pop_heading_value);
  pop_content_head(pop_heading_content);
}

class AlertClass {
  // For the simple popup alert
  sw(pop_simple) {
    structure();
    pop_simple_content(pop_simple);
    popupdiv.style.paddingBottom = "0px";
		pop_simple_structure.style.color = "#000";
  }

  // For simple  white with heading
  swh(pop_heading_value, pop_heading_content) {
		structure();
		heading(pop_heading_value);
		pop_heading.style.marginTop = "50px";
		pop_heading.style.fontSize = "1.8rem";
		pop_content_head(pop_heading_content);
		whitelayout();
  }

  // For error message
  error(pop_heading_value, pop_heading_content) {
    alertWithIcons(pop_heading_value, pop_heading_content);
    whitelayout();
  }

  // For success message
  success(pop_heading_value, pop_heading_content) {
    alertWithIcons(pop_heading_value, pop_heading_content);
    whitelayout();

  }
  // For warning message
  warning(pop_heading_value, pop_heading_content) {
    alertWithIcons(pop_heading_value, pop_heading_content);
    whitelayout();

  }
  // For info message
  info(pop_heading_value, pop_heading_content) {
    alertWithIcons(pop_heading_value, pop_heading_content);
    whitelayout();

  }

}

var Alert = new AlertClass();
