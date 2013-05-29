"use strict";

function power(tag, element_build_dict) {
    var created_node = document.createElement(tag);

    if (element_build_dict != undefined) {
        if (element_build_dict.substring !== undefined) {
            // element build dict is in this case simply text
            return add_text(created_node, element_build_dict);
        }
        var key, value;
        for (key in element_build_dict) {
            value = element_build_dict[key];

            switch (key.toLowerCase()) {
                case "child":
                    created_node.appendChild(value);
                    break;
                case "classes":
                    for (var i = 0; i < value.length; i++) {
                        created_node.className += value[i] + ' ';
                    }
                    break;
                case "text":
                    add_text(created_node, value);
                    break;
                case 'html':
                    created_node.innerHTML = value;
                    break;

                case 'value':
                    created_node.value = value;
                    break;
                case 'click':
                    created_node.onclick = value;
                    break;
                case 'keydown':
                    created_node.onkeydown = value;
                    break;
                case 'keyup':
                    created_node.onkeyup = value;
                    break;
                case 'keypress':
                    created_node.onkeypress = value;
                    break;
                case 'mouseover':
                    created_node.onmouseover = value;
                    break;
                case 'mouseout':
                    created_node.onmouseout = value;
                    break;
                case 'mousedown':
                    created_node.onmousedown = value;
                    break;
                case 'paste':
                    created_node.onpaste = value;
                    break;
                case 'submit':
                    created_node.onsubmit = value;
                    break;
                default :
                    (created_node).setAttribute(key, value);

            }
        }
    }
    return created_node;
}

function add_text(node, text) {
    node.appendChild(document.createTextNode(text));
    return node;
}

function add_animation(node, animation_name, duration){
    var animation_content =animation_name + ' ' + duration + 'ms';
    if (node.style !== undefined){
        node.style.animation = animation_content;
        node.style.webkitAnimation = animation_content;
    } else{
        node.css({'animation':animation_content, '-webkit-animation':animation_content});
    }
}

function remove_animation(node){
    node.style.animation = 'none';
    node.style.webkitAnimation = 'none';
    return node;
}


function is_there(node){
    return node !== undefined;
}
function go_ajax(url, method, data, success_func){
    if (!is_there(success_func)){
        success_func = function(){location.reload();}
    }

    $.ajax({
        url: url,
        type:method,
        data:  JSON.stringify(data),
        contentType:"application/json;charset=UTF-8",
        success: success_func,
        error: function(){alert('something went wrong');}
    });
}

function bring_json(url, data, func){
    $.getJSON( url, data, func);
}


