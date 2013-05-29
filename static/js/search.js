

var jam_search_query = $("#search-box");
var jam_search_suggestions = $('#search-suggestions');
var jam_cur_spotlight;
var previous_search = "";
var search_cache = {};


function remove_px(s){
    var start_px = s.indexOf('px');
    if (start_px !== -1){
        return parseInt(s.substr(0, start_px));
    }
}
jam_search_suggestions.css('width',(jam_search_query.width() +
    remove_px(jam_search_query.css('paddingLeft')) + remove_px(jam_search_query.css('paddingRight'))) +
    remove_px(jam_search_query.css('borderLeftWidth')) +
    remove_px(jam_search_query.css('borderRightWidth'))
    + 'px');

$('#search-form').submit(function () {

    var spotlight_link = $('#spotlight').attr('data-link');
    if (this['query'].value !== '') {
        if (spotlight_link === undefined) {
            return true;
        } else {
            this['query'].value = spotlight_link;
            return true;
        }
    } return false;

});


jam_search_query.keyup(function (event) {
    if (arrowDown(event)) {
        suggestionsDownKey();
    } else if (arrowUp(event)) {
        suggestionsUpKey();
    }
    var search_query = jam_search_query.val();

    if (search_query !== previous_search) {
        search_cache[previous_search] = jam_search_suggestions.children();
        jam_search_suggestions.empty();
        if (search_cache[search_query] !== undefined) {
            jam_search_suggestions.append(search_cache[search_query]);
        }
        else {
            search_suggest(search_query)
        }
        previous_search = search_query;
    }
    if(jam_search_suggestions.children().length === 0){
        jam_search_suggestions.hide();
    } else{
        jam_search_suggestions.show();
    }
});


jam_search_query.focus(function () {
    var search_query = jam_search_query.val();

    if (search_query !== previous_search) {
        search_cache[previous_search] = jam_search_suggestions.children();
        jam_search_suggestions.empty();
        if (search_cache[search_query] !== undefined) {
            jam_search_suggestions.append(search_cache[search_query]);
        }
        else {
            search_suggest(search_query)
        }
        previous_search = search_query;
    }
});

jam_search_query.blur(function () {
    search_cache[jam_search_query.val()] = jam_search_suggestions.children();
    jam_search_suggestions.empty();
    jam_search_suggestions.hide();
});


function arrowDown(e) {
    return e.keyCode === 40;
}

function arrowUp(e) {
    return e.keyCode === 38;
}


function suggestionsUpKey() {
    if (document.getElementById('spotlight') === null) {
        jam_search_suggestions.children().last().attr('id', 'spotlight');
    } else {
        jam_cur_spotlight = $('#spotlight');
        jam_cur_spotlight.attr('id', '');
        if (jam_cur_spotlight.prev() !== undefined) {
            jam_cur_spotlight.prev().attr('id', 'spotlight');
        } else {
            jam_search_suggestions.children().last().attr('id', 'spotlight');
        }
    }
}

function suggestionsDownKey() {
    if (document.getElementById('spotlight') === null) {
        jam_search_suggestions.children().first().attr('id', 'spotlight');
    } else {
        jam_cur_spotlight = $('#spotlight');
        jam_cur_spotlight.attr('id', '');
        if (jam_cur_spotlight.next() !== undefined) {
            jam_cur_spotlight.next().attr('id', 'spotlight');
        } else {
            jam_search_suggestions.children().first().attr('id', 'spotlight');
        }
    }
}

function search_suggest(search_query) {
    search_query = search_query.toLowerCase();
    if (true){
        var made_keywords = make_keywords(search_query);
        perf_search_suggest({'suggestions':['How to Win']});
        perf_search_suggest({'suggestions':['Late Withdrawals']})
    } else{
        bring_json('/_search', make_keywords(search_query), perf_search_suggest)
    }
}

function make_keywords(query){
    //console.log('before: ' + query);
    query = query.replace(/[\W]/g, ' ');
    //console.log('middle: ' + query);
    query = query.replace(/\s+/g, ' ');
    //console.log('after: ' + query);
    var raw_keywords = query.split(' ');
    var refined_keywords = [];

    var exclude_last_word = 1;

    if (query[query.length-1] === " "){
        exclude_last_word = 0;
    }

    for (var i =0; i < raw_keywords.length -exclude_last_word; i++){
        if ((raw_keywords[i].length > 1 )
            && (refined_keywords.indexOf(raw_keywords[i]) === -1)) {
            refined_keywords.push(raw_keywords[i]);
        }
    }
    if (exclude_last_word === 1){
        return {'other-keywords': refined_keywords, 'last-keyword':raw_keywords.pop()};
    } else{
        return {'other-keywords': refined_keywords, 'last-keyword':''};
    }
}

function perf_search_suggest(results_dict){
    var suggestions = results_dict['suggestions'];
    if (suggestions.length != 0){
        display_search_suggestions();
        for (var i=0; i < suggestions.length; i++){
            add_suggestion(suggestions[i]);
        }
    }
}


function display_search_suggestions(){
    var creator_offset = jam_search_query.offset();
    //jam_search_suggestions.css('left', creator_offset.left + "px");
    jam_search_suggestions.css('top', (creator_offset.top - $(document).scrollTop() + 33) + "px");
    jam_search_suggestions.show();
}

function add_suggestion(link) {
    jam_search_suggestions.append(power('li', {'html': bolden_keywords(decodeURI(link)),
            'mouseover':spotlight_suggestion, 'mouseout':unspotlight_suggestion, 'data-link': link ,
            'mousedown':function () {
                window.location.href = $(this).attr('data-link')
            } }
    ));
}

function spotlight_suggestion() {
    $(this).attr('id', 'spotlight');
}

function unspotlight_suggestion() {
    $(this).attr('id', '');
}

function bolden_keywords(content) {
    var search_query = jam_search_query.val().toLowerCase();
    var split_content = content.split(' ');
    var boldened_content = "";
    for (var i = 0; i < split_content.length; i++) {
        if (search_query.indexOf(split_content[i].toLowerCase()) !== -1) {
            boldened_content += '<b>' + split_content[i] + '</b>';
        } else {
            boldened_content += split_content[i];
        }
        boldened_content += " ";
    }

    return boldened_content;
}