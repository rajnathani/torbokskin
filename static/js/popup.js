"use strict"

//Config Variables

var popupClass = 'popup-popup';
var coverClass = 'popup-cover';
var closePopupClass = 'popup-close'

//Optional (for animations (on popup cancel)
var back_animation_out_keyframes_name = 'out-backy';
var popup_animation_out_keyframes_name = 'out-pop';
var animation_out_length = 410;


//Source: Mozilla Development Network
function animationPossible(){
    var animation = false;
    var animationstring = 'animation';
    var keyframeprefix = '';
    var domPrefixes = 'Webkit O MS MOZ'.split(' ');
    pfx  = '';

    if( elm.style.animationName ) { animation = true; }

    if( animation === false ) {
        for( var i = 0; i < domPrefixes.length; i++ ) {
            if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
                var pfx = domPrefixes[ i ];
                animationstring = pfx + 'Animation';
                keyframeprefix = '-' + pfx.toLowerCase() + '-';
                animation = true;
                break;
            }
        }
    }

    return animation;
}

function get_doc_height() {
    return Math.max(
        Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
        Math.max(document.body.offsetHeight, document.documentElement.offsetHeight),
        Math.max(document.body.clientHeight, document.documentElement.clientHeight)
    );
}


function get_inner_height(){
    return window.innerHeight;
}

function get_scrolled(){
    return Math.max(window.scrollY, document.body.scrollTop);
}

function cur_popup_layer(){
    return parseInt(document.getElementById('relfor-popup-number').value);
}

function increase_popup(){
    var current_number_holder = document.getElementById('relfor-popup-number');
    if (current_number_holder === null){
        current_number_holder = document.createElement('input');
        current_number_holder.id = 'relfor-popup-number';
        current_number_holder.type = 'hidden';
        current_number_holder.value = 0;
        document.body.appendChild(current_number_holder);
    } else{
        current_number_holder.value = parseInt(current_number_holder.value) +  1;
    }
}

function decrease_popup(){
    var current_number_holder = document.getElementById('relfor-popup-number');
    current_number_holder.value = parseInt(current_number_holder.value) -  1;
}

function pop_up(content, close_pop_func){
    increase_popup();
    var backy = document.createElement('div');
    backy.style.height = get_doc_height() + "px";
    backy.style.position = 'absolute';
    backy.style.width = '100%';
    backy.style.top = '0';
    backy.style.left = '0';
    backy.style.right = '0';
    backy.style.zIndex = '999999';
    backy.className = coverClass;
    backy.id = 'relfor-popup-cover-' + cur_popup_layer();
    backy.onclick = function(){pop_out()};


    var popy = document.createElement('div');
    popy.style.margin = 'auto';
    popy.style.position = 'relative';
    backy.style.zIndex = '1000000';
    popy.id = 'relfor-popup-' + cur_popup_layer();
    popy.className = popupClass;
    popy.style.marginTop = ((get_inner_height()/4.55 + get_scrolled()) + "px");
    popy.onclick = function(e){e.stopImmediatePropagation()};

    if (close_pop_func !== undefined){
        popy.onclosepopup = close_pop_func;
    }  else {
        popy.onclosepopup = function(){};
    }

    var close = document.createElement('span');
    close.style.cursor="pointer";
    close.style.position = 'absolute';
    close.style.top = '0';
    close.style.right = '0';
    close.className = closePopupClass;
    close.innerHTML = 'x';

    close.onclick = function(){
        pop_out();
    };

    var content_area;
    if ((content.substring) !== undefined){
        content_area = document.createElement('p');
        content_area.appendChild(document.createTextNode(content));
    }else{
        content_area = content;
    }

    popy.appendChild(close);
    popy.appendChild(content_area);

    backy.appendChild(popy);

    document.body.appendChild(backy);

    document.onkeydown = function(){
        if ((window.event).keyCode == 27){
            pop_out();
        }
    }



}

function pop_out(){

    if (cur_popup_layer() === 0){
        document.onkeydown = function(){};
    }
    document.getElementById('relfor-popup-' + cur_popup_layer()).onclosepopup();

    var animate_out_dict = {};
    animate_out_dict['relfor-popup-' + cur_popup_layer()] = popup_animation_out_keyframes_name;

    animate_out_dict['relfor-popup-cover-' + cur_popup_layer()] = back_animation_out_keyframes_name;

    p_animate_out(animation_out_length, document.getElementById('relfor-popup-cover-' + cur_popup_layer()),
        animate_out_dict);
    decrease_popup();


}


function p_animate_out(delay_length, main, todo){
    var delay = 0;
    if ((!animationPossible) || (delay_length !== 0)){
        delay = delay_length - 30;
        setTimeout(function(){main.parentNode.removeChild(main); }, delay);
        for (var key in todo){
            var value = todo[key];
            var key_node = document.getElementById(key);
            key_node.style.animation = (value + ' ' + animation_out_length + 'ms');
            key_node.style.webkitAnimation = (value + ' ' + animation_out_length + 'ms');
        }
    } else{
        main.parentNode.removeChild(main);
    }


}
