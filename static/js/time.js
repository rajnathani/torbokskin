var utc = new Date().getTime() / 1000;

function cur_utc() {
    return parseInt(new Date().getTime() / 1000);
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
   /*
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

 */
function time_diff(timestamp) {
    timestamp = parseInt(timestamp);


    var seconds_diff = (utc - timestamp);
    var future = seconds_diff < 0;
    seconds_diff = Math.abs(seconds_diff);
    var minutes_diff = Math.floor(seconds_diff / 60);
    var hours_diff = Math.floor(minutes_diff / 60);
    var days_diff = Math.floor(hours_diff / 24);
    var weeks_diff = Math.floor(days_diff/7);
    var months_diff = Math.floor(days_diff / 30);
    var year_diff = Math.floor(days_diff / 365);


    var base_string;
    var needs_suffix = true;

    if (seconds_diff < 25) {
        base_string =  seconds_diff + ' seconds';
    }
    else if (seconds_diff < 40) {
        base_string = 'about 30 seconds';
    } else if (seconds_diff < 60) {
        base_string = 'less than a minute';
    }
    else if (minutes_diff < 2) {
        base_string = 'one minute';

    } else if (minutes_diff <= 60) {
        base_string =  minutes_diff + ' minutes';

    } else if (hours_diff <= 2) {
        base_string =  'one hour';
    } else if (hours_diff < 24) {
        base_string =  hours_diff + ' hours';
    }
    else if (days_diff < 2) {
        needs_suffix = false;
        base_string = future ? 'tomorrow' : 'yesterday';
    }
    else if (weeks_diff < 1) {
        base_string = days_diff + ' days';
    }
    else if (weeks_diff < 2) {
        base_string = 'one week';
    }

    else if (months_diff < 1) {
        base_string = (Math.floor(days_diff / (7)) + ' weeks');
    }
    else if (months_diff < 2) {
        base_string =  'a month';
    } else if (year_diff < 1) {
        base_string =  months_diff + ' months';
    } else if (year_diff < 2) {
        base_string =  'one year';
    }
    else if (year_diff < 100){
        base_string =  year_diff + " years";
    }
    else if (year_diff === 1000) {
        base_string =  "a century"
    }
    else if (year_diff < 1000) {
        base_string =  Math.floor(year_diff/100) + " centuries";
    } else if (year_diff === 1000) {
        base_string =  "a millennium"
    } else {
        base_string =  Math.floor(year_diff/1000) + " millennia";
    }

    return needs_suffix ? (future ? base_string + " from now" : base_string + " ago") : base_string;
}
