var utc = new Date().getTime() / 1000;

function cur_utc() {
    return new Date().getTime() / 1000;
}

var month_mapper = {0:'Jan', 1:'Feb', 2:'Mar', 3:'Apr', 4:'May', 5:'Jun', 6:'Jul',
    7:'Aug', 8:'Sep', 9:'Oct', 10:'Nov', 11:'Dec'};


function time_engineer() {
    utc = cur_utc();
    $('[data-timestamp]').each(function () {
        //console.log('one more');
        var cur_timestamp = parseInt(this.getAttribute('data-timestamp'));

        if (this.getAttribute('data-time-diff') === '1') {
            this.innerHTML = time_diff(cur_timestamp);
        } else {
            this.innerHTML = est_date(cur_timestamp);
        }

    });

}


time_engineer();


function est_date(t) {
    var date = new Date(t * 1000 + 60000);
    return  date.getDate() + ' ' + month_mapper[date.getMonth()] + ' ' + date.getFullYear();
}

function time_diff(t) {
    t = parseInt(t);
    var minutes_diff = Math.floor((utc - t) / (60));

    if (minutes_diff < 1) {
        return ('Few Seconds Ago');
    }
    else if (minutes_diff < 2) {
        return ('One minute ago');

    } else if (minutes_diff <= 60) {
        return(minutes_diff + ' minutes ago');

    } else if (minutes_diff <= 60 * 2) {
        return('One hour ago');
    } else if (minutes_diff < 60 * 24) {
        return( Math.floor(minutes_diff / 60) + ' hours ago');
    }
    else if (minutes_diff < 60 * 24 * 2) {
        return('Yesterday');
    }
    else if (minutes_diff < 60 * 24 * 7) {

        return(Math.floor(minutes_diff / (60 * 24)) + ' days ago' );
    }
    else if (minutes_diff < 60 * 24 * 7 * 2) {
        return('One week ago');
    }

    else if (minutes_diff < 60 * 24 * 7 * 5) {
        return(Math.floor(minutes_diff / (60 * 24 * 7)) + ' weeks ago');
    }
    else if (minutes_diff < 60 * 24 * 31 * 3) {
        return ('A month ago');
    } else if (minutes_diff < 60 * 24 * 31 * 12) {
        return(Math.floor(minutes_diff / (60 * 24 * 7 * 30)) + ' months ago');
    } else {
        return ('More than a Year ago');
    }

}
