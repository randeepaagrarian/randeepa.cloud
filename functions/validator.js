const Validator = module.exports = {}
const path = require('path')

Validator.validImage = function(filename) {
    const validExtensions = ['.jpeg', '.jpg', '.png']

    if(validExtensions.indexOf(path.extname(filename)) != -1) {
        return true
    } else {
        return false
    }
}

Validator.validEmail = function(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email)
}
