const MDate = module.exports = {}

MDate.formatDate = function(date) {
    if(isNaN(date) == true || date == '') {
        return false
    } else if(date < 10 && date > 0) {
        if(date.length == 1) {
            date = "0" + date
            return date
        } else {
            return date
        }
    } else {
        if(date > 31) {
            return false
        }
        return date
    }
}

MDate.getDate = function(splitter) {
    const currentTime = new Date()
    const date = ("0" + currentTime.getDate()).slice(-2)
    const month = ("0" + (currentTime.getMonth() + 1)).slice(-2)
    const year = currentTime.getFullYear()

    const now_date = year + splitter + month + splitter + date

    return now_date
}

MDate.getDateTime = function() {
    const currentTime = new Date()
    const date = ("0" + currentTime.getDate()).slice(-2)
    const month = ("0" + (currentTime.getMonth() + 1)).slice(-2)
    const year = currentTime.getFullYear()

    const hour = currentTime.getHours()
    const minutes = currentTime.getMinutes()
    const seconds = currentTime.getSeconds()

    const now_date = year + '-' + month + '-' + date + ' ' + hour + ':' + minutes + ':' + seconds

    return now_date
}

MDate.formatMonth = function(month) {
    if(isNaN(month) == true || month == '') {
        return false
    } else if(month < 10 && month > 0) {
        if(month.length == 1) {
            month = "0" + month
            return month
        } else {
            return month
        }
    } else {
        if(month > 12) {
            return false
        }
        return month
    }
}

MDate.formatYear = function(year) {
    const curYear = new Date().getFullYear()
    if(isNaN(year) == true || year == '') {
        return false
    } else if(year > curYear && year < 1900) {
        return false
    } else {
        return year
    }
}

MDate.getMonths = function() {
    return [
        {id: '01', name: 'January'},
        {id: '02', name: 'February'},
        {id: '03', name: 'March'},
        {id: '04', name: 'April'},
        {id: '05', name: 'May'},
        {id: '06', name: 'June'},
        {id: '07', name: 'July'},
        {id: '08', name: 'August'},
        {id: '09', name: 'September'},
        {id: '10', name: 'October'},
        {id: '11', name: 'November'},
        {id: '12', name: 'December'}
    ]
}

MDate.getDifferenceInDays = function(date1) {
    var date2 = MDate.getDate()

    date1 = date1.split('-')
    date2 = date2.split('-')

    date1 = new Date(date1[0], date1[1], date1[2])
    date2 = new Date(date2[0], date2[1], date2[2])

    date1_unixtime = parseInt(date1.getTime() / 1000)
    date2_unixtime = parseInt(date2.getTime() / 1000)

    const timeDifference = date2_unixtime - date1_unixtime
    const timeDifferenceInHours = timeDifference / 60 / 60

    const timeDifferenceInDays = timeDifferenceInHours  / 24

    return timeDifferenceInDays

}

MDate.getDaysInMonth = function(month, year) {
    return new Date(year, month, 0).getDate()
}
