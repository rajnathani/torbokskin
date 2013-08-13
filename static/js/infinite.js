_path_name = window.location.pathname.replace(/\/$/, "");
if (_path_name.match(/^\/?$/) || _path_name.match(/home\.html$/)) {

    evCheckHomeScroll = function () {
        if ($(document).height() - ($(this).scrollTop() + $(window).height()) < 200) {
            var $last_book = $('#all-books').find('tr[data-book-id]').last();
            // make this global
            last_book_id = parseInt($last_book.attr('data-book-id'));

            var last_ts = parseInt($last_book.find('[data-timestamp]').attr('data-timestamp'));

            $(window).unbind('scroll', evCheckHomeScroll);
            $('.loading.more-books').show();
            if (true) {
                setTimeout(function () {
                    $('.loading.more-books').hide();

                    $(window).bind('scroll', evCheckHomeScroll);

                    perfAppendMoreArticles({ more_books: [
                        {book_id: 1, book_name: 'bllll',
                            course_code: 'CSC100', price: 200, price_attitude: 0,
                            timestamp: 3000000, book_status: 1, num_replies: 0}
                    ]});
                }, 1000);
            } else {
                new_go_ajax('/_?timestamp=' + last_ts, 'GET', perfAppendMoreArticles,
                    {'complete': function (jqXHR, text_status) {
                        $('.loading.more-books').hide();
                        if (["notmodified", "error", "timeout", "abort", "parsererror"].indexOf(text_status) !== -1) {
                            $(window).bind('scroll', evCheckHomeScroll);
                        }
                    }});
            }


        }

    };

    $(window).bind('scroll', evCheckHomeScroll);


    perfAppendMoreArticles = function (dict) {

        if (!dict.error && dict.more_books) {
            if (dict.more_books.length === 0) {
                $('.loading.more-books').hide();
                // The return statement below is important. the function needs to terminate
                // here as later in the function we re-bind the scrolling event to the window,
                // which we obviously do not want any more.
                return false;
            }

            var $all_books = $('#all-books');
            var cur_result, tot_appended;

            for (var i = 0; i < dict.more_books.length; i++) {

                cur_result = dict.more_books[i];

                if (cur_result.book_id !== last_book_id) {
                    $all_books.append(make_book_row(cur_result));
                    // check how many have been appended
                    tot_appended++;
                }

            }
        }
        // only if a book has been appended we can say that there
        // could be more left, otherwise we let the scroll be
        // unbound.
        if (tot_appended) $(window).bind('scroll', evCheckHomeScroll);
    }
}
