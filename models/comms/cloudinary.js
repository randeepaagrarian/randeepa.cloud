const cloudinary = require('cloudinary')

cloudinary.config({
    cloud_name: 'randeepa-com',
    api_key: '289554828913344',
    api_secret: 'pzpbKrSCqrV03gLGfVmeu0OY7k8'
})

cloudinary.upload = function(path, callback) {
    cloudinary.uploader.upload(path, function(result) {
        err = null
        if(result === undefined) {
            err = "Something went wrong"
            callback(err, result)
        } else {
            callback(err, result)
        }
    })
}

module.exports = cloudinary
