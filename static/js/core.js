var university_conversion = {
    'stg':'University of Toronto (St.George)',
    'msg':'University of Toronto (Mississauga)',
    'scr':'University of Toronto (Scarborough)',
    'rye':'Ryerson University',
    'yrk':'York University',
    'ocd':'OCAD University',
    'oit':'University of Ontario Institute of Technology',
    'cen':'Centennial College',
    'gbr':'George Brown College',
    'snc':'Seneca College',
    'hmb':'Humber College',
    'shr':'Sheridan College',
    'nom':'< Not Mentioned >'
};

var inverted_university_conversion = {'George Brown College':'gbr', 'Humber College':'hmb', 'University of Toronto (Scarborough)':'scr', 'York University':'yrk', 'University of Toronto (Mississauga)':'msg', 'Centennial College':'cen', 'Ryerson University':'rye', 'OCAD University':'ocd', '< Not Mentioned >':'nom', 'University of Ontario Institute of Technology':'oit', 'Seneca College':'snc', 'University of Toronto (St.George)':'stg', 'Sheridan College':'shr'};

var line_break = power('br');

setInterval(time_engineer, 2000);


function validEmail(email) {
    var reg_email = /[A-Za-z0-9\._%\+\-]+@[A-Za-z0-9\._%\+\-]+\.[A-Za-z]{2,4}/;
    return email.match(reg_email);
}
function jamExists(jam) {
    return jam.length > 0;
}
function existsPlaceholder() {
    return ("placeholder" in document.createElement("input"));
}
function loggedIn() {
    return ($('#logged-in').length > 0);
}
function getHTML(node) {
    return power('div', {'child':node}).innerHTML;
}

function getBookDetails(book_id) {
    // Book Name
    // Authors
    // Course Code
    // Book Status (1 for available, 0 for taken)
    // Description
    // Timestamp of posted
    // Number of replies
    // Price
    // Price Attitude (1 for negotiable, 0 for fixed)
    // College (3 letter code)

    var dict = {};
    var book_row = $('tr[data-book-id="' + book_id + '"]');
    var book_details_row = $('tr[data-details-book-id="' + book_id + '"]');

    dict['book_name'] = book_details_row.find('.book-name').text();
    dict['authors'] = book_details_row.find('.authors').text();
    dict['university'] = inverted_university_conversion[book_details_row.find('.university').text()];
    dict['description'] = book_details_row.find('.description').text();
    dict['edition'] = book_details_row.find('.edition').text();

    dict['course_code'] = book_row.find('td:nth-child(2)').text();

    dict['price'] = getData('data-price', book_row);
    dict['price_attitude'] = parseInt(getData('data-price-attitude', book_row));
    dict['timestamp'] = parseInt(getData('data-timestamp', book_row));
    dict['book_status'] = parseInt(getData('data-book-status', book_row));
    dict['num_replies'] = parseInt(getData('data-num-replies', book_row));


    return dict;


}

function getData(data_attr, within) {
    if (within) {
        return $(within).find('[' + data_attr + ']').attr(data_attr);
    } else {
        return $('[' + data_attr + ']').attr(data_attr);
    }
}

function setData(data_attr, new_val, within) {
    if (within) {
        $(within).find('[' + data_attr + ']').attr(data_attr,new_val);
    } else {
        $('[' + data_attr + ']').attr(data_attr,new_val);
    }
}

function td(node) {
    return power('td', {'Child':node});
}

function td2p(pholdername, node) {
    if (existsPlaceholder()) {
        node.setAttribute(('placeholder'), pholdername);
    }
    var created_cell = power('td', {'Child':node, 'colspan':'2'});
    if (!existsPlaceholder()) {
        $(created_cell).prepend(pholdername);
    }
    return created_cell;
}

function td2(node) {
    return power('td', {'Child':node, 'colspan':'2'});
}
function tr(node) {
    return power('tr', {'Child':node});
}

function only_numbers(e) {
    var typed_code = (window.event ? event.keyCode : e.which);
    // 0-9 (48-57) backspace (8) tab (0 for FF 9 for others)
    return ((typed_code >= 48 && typed_code <= 57) || (typed_code === 8) || (typed_code === 0) || (typed_code === 9));
}

function course_code_uppered() {
    setTimeout(function () {
        var post_course_code = $('#p-course-code');
        var edit_course_code = $('#ed-course-code');
        post_course_code.length > 0 && post_course_code.val(post_course_code.val().toUpperCase());
        edit_course_code.length > 0 && edit_course_code.val(edit_course_code.val().toUpperCase());
    }, 1);
}


$('#bu-form-post-book').click(function () {
    var div_pop = power('div', {'ID':'popup-book-form'});
    //var frm = power('form', {'Class':'cf'});
    var frm_table = power('table');
    var frm_tbody = power('tbody');

    var header = power('h3', '~ Post your Book ~');
    var book_name = tr(td2p('Book Name', power('input', {'type':'text', 'ID':'p-book-name', 'autocomplete':'off', 'maxlength':'170'})));
    var authors = tr(td2p('Authors\' Name(s)', power('input', {'type':'text', 'ID':'p-authors', 'maxlength':'120'})));


    var edition = tr(td2p('Edition of Book (Optional)', power('input', {'type':'text', 'ID':'p-edition', 'maxlength':'10'})));
    var course_code = tr(td2p('Course Code', power('input', {'type':'text', 'ID':'p-course-code', 'maxlength':'9',
        'keypress':course_code_uppered, 'paste':function(){return false;}})));

    var university = power('select', { 'ID':'p-university'});


    university.appendChild(power('option', {'Text':'The University at which the book was used', 'value':'none', 'ID':'campus-placeholder'}));

    for (var key in university_conversion) {
        if (university_conversion.hasOwnProperty(key))
            university.appendChild(power('option', {'Text':university_conversion[key], 'value':key}));
    }
    university = tr(td2(university));

    var email = tr(td2p('Email Address (Offers made will be Emailed)', power('input', {'type':'email', 'ID':'p-email', 'maxlength':'255'})));
    var desc = tr(td2p('Description (Condition of the Book and other Selling Information)', power('textarea', { 'rows':'3', 'ID':'p-description', 'maxlength':'1000'})));

    var price_row = power('tr', {'ID':'price-row'});

    var price = power('td', {'ID':'price-cell', 'Child':(power('input', {'type':'text', 'placeholder':'Price', 'ID':'p-price', 'maxlength':'4', 'keypress':only_numbers, 'paste':function(){return false;}}))});
    if (!existsPlaceholder()) {
        $(price).prepend('Price');
    }


    var attitude_box = power('td');
    attitude_box.appendChild(power('span', '\u00a0$'));
    attitude_box.appendChild(power('input', {'type':'radio', 'name':'p-price-attitude', 'ID':'p-fixed'}));
    attitude_box.appendChild(power('label', {'Text':'Fixed', 'for':'p-fixed'}));
    attitude_box.appendChild(power('input', {'type':'radio', 'name':'p-price-attitude', 'ID':'p-negotiable', 'checked':'checked'}));
    attitude_box.appendChild(power('label', {'Text':'Negotiable', 'for':'p-negotiable'}));

    price_row.appendChild(price);
    price_row.appendChild(attitude_box);

    //var div_buttons = power('div', {'Class':'cf', 'style':'clear:both'});

    var submit_post_offering = power('button', {'Class':'nice-button', 'Text':'Post Offering', 'ID':'bu-post-book',
        'click':bu_post_book});


    div_pop.appendChild(header);
    frm_tbody.appendChild(book_name);
    frm_tbody.appendChild(authors);
    frm_tbody.appendChild(edition);
    frm_tbody.appendChild(course_code);

    frm_tbody.appendChild(price_row);

    frm_tbody.appendChild(desc);
    frm_tbody.appendChild(university);

    frm_tbody.appendChild(email);
    if (loggedIn()) {
        $(email).val($('#cur-user-email').text()).hide();
    }
    //frm.appendChild(frm_table);

    frm_table.appendChild(frm_tbody);
    div_pop.appendChild(frm_table);
    div_pop.appendChild(submit_post_offering);
    //div_pop.appendChild(frm);

    pop_up(div_pop);
    $('#p-book-name').focus();

});

function bu_post_book() {
    var data = {
        'book_name':$('#p-book-name').val(),
        'authors':$('#p-authors').val(),
        'edition':$('#p-edition').val(),
        'course_code':$('#p-course-code').val(),
        'price':parseInt($('#p-price').val()),
        'price_attitude':($('#p-fixed:checked').length <= 0 ? 1 : 0),
        'description':$('#p-description').val(),
        'university':$('#p-university').val(),
        'email':$('#p-email').val()
    };
    if (data['book_name'].length < 1) {
        pop_up('Book Name not filled out.');
        return false;
    }
    else if (data['authors'].length < 1) {
        pop_up('Authors\' Names(s) not filled out.');
        return false;
    } else if (data['course_code'].length < 1) {
        pop_up('Course Code not filled out.');
        return false;

    } else if (data['price'].length < 1) {
        pop_up('Price not filled out.');
        return false;
    }
    else if (data['description'].length < 1) {
        pop_up('Description not filled out.');
        return false;
    }
    else if (data['university'] === 'none') {
        pop_up('University not filled out.');
        return false;
    } else if (!loggedIn()) {
        if (data['email'].length < 1) {
            pop_up('Email not filled out.');
            return false;
        }
        if (!validEmail(data['email'])) {
            pop_up('Invalid Email Address.');
            return false;
        }
    }
    if (true) {
        data['book_id'] = '200';
        data['account_status'] = 1;
        perf_post_book(data);
    } else {
        go_ajax('/_book', 'POST', data, perf_post_book);
    }


}


function make_book_row(dict) {
    var new_row = power('tr', {'data-book-id':dict['book_id']});
    new_row.appendChild(power('td', dict['book_name']));
    new_row.appendChild(power('td', dict['course_code']));
    //var price_string = dict['price'].toString() + '$ (' +
    //    ((dict['price-attitude'] === 1) ? 'negotiable' : 'fixed')
    //    + ')';
    new_row.appendChild(power('td', {'data-price-attitude':dict['price_attitude'],
        'data-price':dict['price']}));

    new_row.appendChild(power('td', {'Text':time_diff(dict['timestamp']),
        'data-timestamp':dict['timestamp'], 'data-time-diff':'1'}));

    var status_cell = power('td');
    status_cell.appendChild(dict['availability'] === 1 ?
        power('span', {'data-book-status':'1', 'class':'green'}) :
        power('span', {'data-book-status':'0', 'class':'red'}));

    status_cell.appendChild(document.createTextNode(' '));
    status_cell.appendChild(power('span',
        {'data-num-replies':dict['num_replies'].toString()}
    ));

    new_row.appendChild(status_cell);
    new_row.onclick = bu_book_details;
    return new_row;
}


//noinspection FunctionWithInconsistentReturnsJS
function perf_post_book(dict) {

    if (dict['error'] !== undefined) {
        pop_up(dict['error']);
        return false;
    }

    pop_out();
    if (loggedIn()) {
        var path = window.location.pathname;
        if (path === '/' || path === '/Users/raj/earth/torbok/torbokskin/templates/home.html' ||
            (path.indexOf('mybooks') !== -1)) {

            dict['availability'] = 1;
            dict['num_replies'] = 0;
            dict['timestamp'] = cur_utc();
            var new_row = make_book_row(dict);
            add_animation(new_row, 'in-pop', 400);
            var jam_first_row = $('#all-books').find('th').last().parent();

            $("html, body").animate({ scrollTop:0 }, "100");
            jam_first_row.after(new_row);
        }

        pop_up(power('div', {'Text':'Book Posting Successful!', 'class':'green'}));
        setTimeout(pop_out, 1500);
    } else {
        var please_verify = power('p');
        please_verify.appendChild(power('span', {'html':"<span class='green'>A book verification email has been sent to the email address you mentioned: <b>" + dict['email'] + "</b></span>"}));
        please_verify.appendChild(power('br'));
        please_verify.appendChild(power('span', "On clicking the verification link in the email sent, your book will be successfully posted."));
        please_verify.appendChild(power('br'));
        please_verify.appendChild(power('span', {'html':"Take note that this link only lasts for <b>2 hours</b>."}));
        please_verify.appendChild(power('br'));
        if (dict['account_status'] === -1) {
            please_verify.appendChild(power('div', {
                'html':"<b>Read:</b> A password has been generated for you, this is included in the email sent to you. To reply to offers made to your book or to edit details entered, you will need to authenticate yourself with your email address alongwith the sent password."
            }));
        } else if (dict['account_status'] === 0) {
            please_verify.appendChild(power('div', {
                'html':"<b>Read:</b> You have created an account with that email, however you have not verified it. If you have posted a book/books with this email you can verify it by verifying the book you posted (through clicking the book verification link emailed to you). However if you created an account using the register page (<a href='torbok.com/register' class='normal-link'>torbok.com/register</a>) you will instead directly verify your account with an account verification email sent to you. "
            }));
        } else {
            please_verify.appendChild(power('div', {
                'html':"<b>Read:</b> You already have an account on Torbok. You can confirm your posted book by" +
                    " clicking the book verification link which was just emailed to you. However to skip this tedious step next time, you first login to the website and then post the book."
            }));

        }
        pop_up(please_verify);
    }

}


$('#all-books').find('tr[data-book-id]').click(bu_book_details);


function bu_book_details() {
    var book_id = $(this).attr('data-book-id');

    if ($(this).hasClass('details-exposed')) {
        $('[data-details-book-id="' + book_id + '"]').hide();
        $(this).removeClass('details-exposed');
        $(this).addClass('details-hidden');
    } else if ($(this).hasClass('details-hidden')) {
        $('[data-details-book-id="' + book_id + '"]').show();
        $(this).removeClass('details-hidden');
        $(this).addClass('details-exposed');
    } else {

        //history.pushState({}, "", "/book/" + book_id);
        ///window.history.pushState(null,null,'/book');

        if (true) {
            perf_book_details({'book_id':book_id, 'book_name':$(this).find('td:first-child').html(), 'authors':'James Calprit', //'edition':'fourth',
                'course_code':'PSY247H1', 'price':200, 'description':'The book is in relatively' +
                    ' good condition, I will also include test papers with it.', 'university':'stg',
                'replies':[
                    ['Are you willing to sell only the first book? I can pay 45$ for it. Contact me at 416-775-9530.', 'jesse.winop@mail.utoronto.ca', 1367352069, 100],
                    ['Nah Im not willing to do that. sorry!', '', 1367353069, 200],
                    ['Hey can I get the whole thing for 200$ instead?', 'cheng.wen@mail.utoronto.ca', 1367354069, 300],
                    ['I\'ll pay 210$ for it! :) my number is 647-282-8563', 'email', 1367354069, 400]
                ]
            });
        } else {
            bring_json('/_book/' + book_id, {}, perf_book_details);
        }

    }
    // add loading


}


function perf_book_details(dict) {
    // remove loading
    if (dict['error'] !== undefined) {
        pop_up(dict['error']);
    }
    var extra_details_row = power('tr', {'data-details-book-id':dict['book_id'], 'class':'details-row'});

    var extra_details_cell = power('td', {'colspan':'5'});

    extra_details_cell.appendChild(power('div', {'html':'<b>Book Name:</b> ' +
        getHTML(power('span', {'text':dict['book_name'], 'class':'book-name'})),
        'style':'white-space:normal:'}));
    extra_details_cell.appendChild(power('div', {'html':'<b>Authors:</b> ' +
        getHTML(power('span', {'text':dict['authors'], 'class':'authors'}))
    }));
    if ('edition' in dict) {
        extra_details_cell.appendChild(power('div', {'html':'<b>Edition:</b> ' +
            getHTML(power('span', {'text':dict['edition'], 'class':'edition'}))
        }));
    } else {
        // Just so that retrieving the edition when finding book details won't ever result in not found.
        extra_details_cell.appendChild(power('div', {'html':getHTML(power('span', {'text':'', 'class':'edition', 'style':'display:hidden'}))
        }));
    }
    //extra_details_cell.appendChild(power('div', dict['price']));
    extra_details_cell.appendChild(power('div', {'html':'<b>University:</b> ' +
        getHTML(power('span', {'text':university_conversion[dict['university']], 'class':'university'}))}));
    extra_details_cell.appendChild(power('div', {'html':'<b>Description:</b> ' +
        getHTML(power('span', {'text':dict['description'], 'class':'description'})),
        'style':'white-space:normal;'}));

    var book_link = 'torbok.com/book/' + dict['book_id'];
    extra_details_cell.appendChild(power('div', {'html':'<b>Link to Book:</b> ' +
        getHTML(power('a', {'href':'http://' + book_link, 'text':book_link, 'class':'normal-link'}))
    }));

    if (dict['is_owner']) {
        extra_details_cell.appendChild(power('button', {'class':'normal-link',
            'text':'[ edit book details ]', 'id':'bu-form-edit-book',
            'data-form-edit-book-id':dict['book_id'],
            'click':buFormEditBook,
            'data-book-owner':'1'
        }));
        extra_details_cell.appendChild(line_break);
    }
    extra_details_row.appendChild(extra_details_cell);


    //var comments_row = power('tr', {'data-details-book-id':dict['book-id'], 'class':'details-row'});
    //var comments_cell = power('td', {'colspan':'5'});
    extra_details_cell.appendChild(power('p', {'style':'margin-top:10px', 'Text':'Replies to the Book Posting'}));
    var all_replies = dict['replies'];
    var replies_list = power('ul', {'data-replies-book-id':dict['book_id']});
    for (var i = 0; i < all_replies.length; i++) {
        bookReplyAppend(replies_list, all_replies[i]);
    }

    extra_details_cell.appendChild(replies_list);

    var please_reply = power('div', {'class':'green', 'Text':'Messages left below are instantly emailed to the owner of the book.'});
    extra_details_cell.appendChild(please_reply);
    var reply_box = power('textarea', {'placeholder':'Message Content', 'rows':'1',
        'data-reply-box-book-id':dict['book_id'], 'maxlength':'1000',
        'keypress':replyCheck});
    $.getScript("/static/js/jquery.autosize-min.js", function () {
        $(reply_box).autosize();
    });
    extra_details_cell.appendChild(reply_box);

    var submit_reply = power('button', {class:'nice-button', 'Text':'submit',
        'data-submit-reply-book-id':dict['book_id'],
        'click':buReplyToOffer});
    extra_details_cell.appendChild(submit_reply);

    extra_details_row.appendChild(extra_details_cell);

    var book_row = $('tr[data-book-id="' + dict['book_id'] + '"]');
    //add_animation(extra_details_cell,'in-pop', 500);
    //add_animation(comments_cell,'in-pop', 500);

    book_row.after(extra_details_row);
    //pop_up(div_pop, function () {
    //    window.history.go(-1);
    //});
    book_row.addClass('details-exposed');

}


function buFormEditBook() {
    if ((!loggedIn()) || ($(this).attr('data-book-owner') !== '1')) {
        pop_up('You need to be logged in as the owner of the book in order to edit it.');
        return false;
    }
    var book_id = $(this).attr('data-form-edit-book-id');

    var book_details = getBookDetails(book_id);


    var div_pop = power('div', {'ID':'popup-book-form'});
    //var frm = power('form', {'Class':'cf'});
    var frm_table = power('table');
    var frm_tbody = power('tbody');

    var header = power('h3', '~ Edit Book Details ~');
    var book_name = tr(td2p('Book Name', power('input', {'type':'text', 'ID':'ed-book-name', 'autocomplete':'off', 'maxlength':'170',
            'value':book_details['book_name']}
    )));
    var authors = tr(td2p('Authors\' Name(s)', power('input', {'type':'text', 'ID':'ed-authors', 'maxlength':'120',
        'value':book_details['authors']})));

    var edition = tr(td2p('Edition of Book (Optional)', power('input', {'type':'text', 'ID':'ed-edition', 'maxlength':'10',
        'value':book_details['edition']})));
    var course_code = tr(td2p('Course Code', power('input', {'type':'text', 'ID':'ed-course-code', 'maxlength':'9', 'keypress':course_code_uppered,
        'value':book_details['course_code'], 'paste':function(){return false;}})));

    var university = power('select', { 'ID':'ed-university'});
    university.appendChild(power('option', {'Text':'The University at which the book was used', 'value':'none', 'ID':'campus-placeholder'}));

    var selected_university = book_details['university'];
    for (var key in university_conversion) {
        if (university_conversion.hasOwnProperty(key)) {
            var opt = (power('option', {'Text':university_conversion[key], 'value':key}));
            if (key === selected_university) {
                opt.setAttribute('selected', 'selected');
            }
            university.appendChild(opt);
        }
    }
    university = tr(td2(university));


    var desc = tr(td2p('Description (Condition of the Book and other Selling Information)', power('textarea', { 'rows':'3', 'ID':'ed-description', 'maxlength':'1000', 'value':book_details['description']})));

    var price_row = power('tr', {'ID':'price-row'});

    var price = power('td', {'ID':'price-cell', 'Child':(power('input', {'type':'text', 'placeholder':'Price', 'ID':'ed-price', 'maxlength':'4',
        'value':book_details['price'],
        'keypress':only_numbers,
        'paste':function(){return false;}}))});
    if (!existsPlaceholder()) {
        $(price).prepend('Price');
    }


    var attitude_box = power('td');
    attitude_box.appendChild(power('span', '\u00a0$'));

    var ed_fixed_radio = (power('input', {'type':'radio', 'name':'ed-price-attitude', 'ID':'ed-fixed'}));
    var ed_negotiable_radio = (power('input', {'type':'radio', 'name':'ed-price-attitude', 'ID':'ed-negotiable'}));
    if (book_details['price_attitude'] === 0) {
        ed_fixed_radio.checked = 'checked';
    } else {
        ed_negotiable_radio.checked = 'checked';
    }


    attitude_box.appendChild(ed_fixed_radio);
    attitude_box.appendChild(power('label', {'Text':'Fixed', 'for':'ed-fixed'}));
    attitude_box.appendChild(ed_negotiable_radio);
    attitude_box.appendChild(power('label', {'Text':'Negotiable', 'for':'ed-negotiable'}));


    price_row.appendChild(price);
    price_row.appendChild(attitude_box);

    //var div_buttons = power('div', {'Class':'cf', 'style':'clear:both'});

    var book_status = power('tr');
    var book_status_cell = power('td', {'colspan':'2', 'style':'padding:6px 0 7px 0'});

    book_status_cell.appendChild(power('span', 'Book Status\u00a0'));
    var ed_taken = (power('input', {'type':'radio', 'name':'ed-book-status', 'ID':'ed-taken'}));
    var ed_available = (power('input', {'type':'radio', 'name':'ed-book-status', 'ID':'ed-available'}));
    if (book_details['book_status'] === 0) {
        ed_taken.checked = 'checked';
    } else {
        ed_available.checked = 'checked';
    }


    book_status_cell.appendChild(ed_taken);
    book_status_cell.appendChild(power('label', {'Text':'Taken', 'class':'red', 'for':'ed-taken'}));
    book_status_cell.appendChild(ed_available);
    book_status_cell.appendChild(power('label', {'Text':'Available', class:'green', 'for':'ed-available'}));

    book_status.appendChild(book_status_cell);

    var submit_edit = power('button', {'Class':'nice-button', 'Text':'Edit Book Details', 'id':'bu-edit-book',
        'click':buEditBook, 'data-edit-book-id':book_id});


    div_pop.appendChild(header);
    frm_tbody.appendChild(book_name);
    frm_tbody.appendChild(authors);
    frm_tbody.appendChild(edition);
    frm_tbody.appendChild(course_code);

    frm_tbody.appendChild(price_row);

    frm_tbody.appendChild(desc);
    frm_tbody.appendChild(university);
    frm_tbody.appendChild(book_status);

    //frm.appendChild(frm_table);

    frm_table.appendChild(frm_tbody);
    div_pop.appendChild(frm_table);
    div_pop.appendChild(submit_edit);
    //div_pop.appendChild(frm);

    pop_up(div_pop);
    $('#ed-book-name').focus();
}

function buEditBook() {

    var book_id = $(this).attr('data-edit-book-id');


    var data = {
        'book_name':$('#ed-book-name').val(),
        'authors':$('#ed-authors').val(),
        'edition':$('#ed-edition').val(),
        'course_code':$('#ed-course-code').val(),
        'price':parseInt($('#ed-price').val()),
        'price_attitude':($('#ed-fixed:checked').length <= 0 ? 1 : 0),
        'description':$('#ed-description').val(),
        'university':$('#ed-university').val(),
        'book_status':($('#ed-taken:checked').length <= 0 ? 1 : 0)
    };
    if (data['book_name'].length < 1) {
        pop_up('Book Name not filled out.');
        return false;
    }
    else if (data['authors'].length < 1) {
        pop_up('Authors\' Names(s) not filled out.');
        return false;
    } else if (data['course_code'].length < 1) {
        pop_up('Course Code not filled out.');
        return false;

    } else if (isNaN(data['price']) || data['price'].length < 1) {
        pop_up('Price not filled out.');
        return false;
    }
    else if (data['description'].length < 1) {
        pop_up('Description not filled out.');
        return false;
    }

    else if (data['university'] === 'none') {
        pop_up('University not filled out.');
        return false;
    }
    if (true) {
        performEditBook({'error':'Sorry. Something went wrong while updating the details of the book.'});
    } else {
        go_ajax('/_book/' + book_id, 'PATCH', data, performEditBook);
    }
}

function performEditBook(dict) {
    if (dict['error'] !== undefined) {
        pop_up(dict['error']);
        return false;
    }
    window.location.reload();
}
function bookReplyAppend(list, reply_details) {

    var content = reply_details[0];
    var email = reply_details[1];
    var timestamp = reply_details[2];
    var reply_id = reply_details[3];

    var li = power('li', {'data-reply-id':reply_id});
    li.appendChild(power('p', content));

    var meta = power('div', {'class':'meta'});
    if (email !== '') {
        meta.appendChild(power('span', email));
    } else {
        meta.appendChild(power('span', {'style':'text-decoration:underline', 'text':'book owner'}));
    }
    meta.appendChild(power('span', ' '));
    meta.appendChild(power('span',
        { 'html':'(' + getHTML(power('span',
            {'data-timestamp':timestamp, 'data-time-diff':'1', 'text':time_diff(timestamp)}))
            + ')'}));

    li.appendChild(meta);
    $(list).append(li);

}


function buReplyToOffer() {
    var book_id = $(this).attr('data-submit-reply-book-id');
    var typed_value = this.previousSibling.value;
    if (!loggedIn()) {
        if (true) {
            var login_link = 'login.html';
        } else {
            var login_link = '/login';
        }
        pop_up(power('div', {'html':
            getHTML(power('a',{class:'normal-link', text:'login', href:login_link})) +
                ' is required<br>' +
        'account registrations done ' + getHTML(power('a',{class:'normal-link', text:'here', href:'/register'}))}));
        return false;
    }
    var email = $('#cur-user-email').html();
    if (typed_value === '') {
        pop_up('Reply Message hasn\'t been filled out.');
        return false;
    }
    this.previousSibling.value = '';
    if (true) {
        performReplyBook({'reply_details':[typed_value, email, cur_utc(), 800], 'book_id':book_id})
    } else {
        go_ajax('/_book/' + book_id + '/replies', 'POST', {'reply_content':typed_value}, performReplyBook);
    }
}

function performReplyBook(dict) {
    if (dict['error'] !== undefined) {
        pop_up(dict['error']);
        return false;
    }
    var book_row = $('[data-book-id="' + dict['book_id']+'"]');
    var num_replies = getData('data-num-replies', book_row);
    setData('data-num-replies', parseInt(num_replies) +1,book_row);
    bookReplyAppend($('[data-replies-book-id="' + dict['book_id'] + '"]'),
        dict['reply_details']);
}


function replyCheck(e) {
    var typed_code = (window.event ? event.keyCode : e.which);
    if (typed_code === 13) {
        $('[data-submit-reply-book-id="' + $(this).attr('data-reply-box-book-id') + '"]').click();
        return false;
    }
    return true;
    //var num_line_breaks = (this.value).match(/\n/);
}


////////////////////////////////////////LOGIN//////////////////////////////////////

$('#login').submit(function () {
    var email = this['email'].value;
    var password = this['password'].value;

    var form_problems = $('#form-problems').empty();
    if (email.length < 1) {
        form_problems.append(power('li', 'email not filled out'));
        return false;
    } else if (password.length < 1) {
        form_problems.append(power('li', 'password not filled out'));
        return false;
    }

    $(this).find('input[type="submit"]').prop('disabled', true);

});


$('#register').submit(function () {
    var email = this['email'].value;
    var password = this['password'].value;

    var form_problems = $('#form-problems').empty();
    if (email.length < 1) {
        form_problems.append(power('li', 'Email not filled out'));
        return false;
    } else if (password.length < 1) {
        form_problems.append(power('li', 'Password not filled out'));
        return false;
    } else if (password.length < 7) {
        form_problems.append(power('li', 'Password must be at least 7 characters long'));
        return false;
    } else if (!validEmail(email)) {
        form_problems.append(power('li', 'Invalid email address'));
        return false;

    }

    $(this).find('input[type="submit"]').prop('disabled', true);

});

$('#reset-password').submit(function () {
    var new_password = this['new-password'].value;
    var confirm_new_password = this['confirm-new-password'].value;
    var form_problems = $('#form-problems').empty();

    if ((new_password === '') || (confirm_new_password === '')) {
        form_problems.append(power('li', 'Both fields have to be filled out'));
        return false;
    } else if (new_password.length < 7) {
        form_problems.append(power('li', 'Password must be at least 7 characters long'));
        return false;
    } else if (new_password !== confirm_new_password) {
        form_problems.append(power('li', 'Passwords do not match'));
        return false;
    }

    $(this).find('input[type="submit"]').prop('disabled', true);

});


$('#bu-form-change-password').click(function () {
    var div_pop = power('div');
    //var msg = power('p', 'Enter your password for confirmation:');
    var cur_password = power('input', {'type':'password', 'ID':'cur-password',
        'placeholder':'Current Password', 'style':'margin:5px auto;width:200px', 'maxlength':'100'});
    var new_password = power('input', {'type':'password', 'ID':'new-password',
        'placeholder':'New Password', 'style':'margin:5px auto;width:200px', 'maxlength':'100'});
    var confirm_new_password = power('input', {'type':'password', 'ID':'confirm-new-password',
        'placeholder':'Confirm New Password', 'style':'margin:5px auto;width:200px', 'maxlength':'100'});

    var submit = power('button', {'class':'nice-button', 'Text':'Change Password',
        'style':'margin:auto;width:200px',
        'click':bu_change_password});

    //div_pop.appendChild(msg);
    div_pop.appendChild(cur_password);
    div_pop.appendChild(new_password);
    div_pop.appendChild(confirm_new_password);

    div_pop.appendChild(submit);
    pop_up(div_pop);
    cur_password.focus();
});

function bu_change_password() {
    var cur_password = $('#cur-password').val();
    var new_password = $('#new-password').val();
    var confirm_new_password = $('#confirm-new-password').val();
    if ((cur_password.length < 1) || (new_password.length < 1) || (confirm_new_password.length < 1)) {
        pop_up('All Fields to be filled out.');
        return false;
    }
    if (confirm_new_password !== new_password) {
        pop_up('New Password doesn\'t match with Confirmed Password.');
        return false;
    }
    if (confirm_new_password.length < 7) {
        pop_up('The new password must contain at least 7 characters.');
        return false;
    }
    if (true) {
        perf_change_password({});
    } else {
        go_ajax('/account/password', 'PATCH', {'cur_password':cur_password,
                'new_password':new_password, 'confirm_new_password':confirm_new_password},
            perf_change_password);
    }
}

function perf_change_password(dict) {
    if (dict['error'] !== undefined) {
        pop_up(dict['error']);
        return false;
    }
    pop_out();

    pop_up(power('p', {'Text':'Password Change Successful', 'class':'green'}));
    setTimeout(pop_out, 1300);
}


$('#bu-delete-account').click(function () {

    var div_pop = power('div');
    var msg = power('p', 'Enter your password for confirmation:');
    var password = power('input', {'type':'password', 'ID':'delete-account-password',
        'placeholder':'Password', 'style':'margin:5px auto;width:200px', 'maxlength':'100'});
    var submit = power('button', {'class':'nice-button', 'Text':'Terminate Account',
        'style':'margin:auto;width:200px',
        'click':bu_delete_account});

    div_pop.appendChild(msg);
    div_pop.appendChild(password);
    div_pop.appendChild(submit);
    pop_up(div_pop);

});

function bu_delete_account() {
    var password = $('#delete-account-password').val();
    if (password.length < 1) {
        pop_up('Password not filled out.');
        return false;
    }
    if (true) {
        perf_delete_account({'error':'Incorrect Password'});
    } else {
        go_ajax('/account', 'DELETE', {'password':password}, perf_delete_account)
    }
}

function perf_delete_account(dict) {
    if (dict['error'] !== undefined) {
        pop_up(dict['error']);
        return false;
    }
    window.location.href = '/';
}


$('#bu-email-password-reset').click(function () {
    var email = $('[name="email"]').val();
    if (email === '') {
        pop_up('Email hasn\'t been filled out');
        return false;
    } if (!validEmail(email)){
        pop_up('Invalid Email Address');
        return false;
    }
    if (true) {
        performPasswordReset({});
    } else {
        go_ajax('/email-password-reset', 'POST', {'email':email}, performPasswordReset);
    }

});

function performPasswordReset(dict) {
    if (dict['error'] !== undefined) {
        pop_up(dict['error']);
        return false;
    }
    pop_up(power('div', {'class':'green', 'text':'An Email has been sent with a password reset link which lasts for exactly 2 hours. Use the link to reset the password to your account.'}),
        function () {
            window.location.href = '/'
        });

}