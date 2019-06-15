const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const flash = require('connect-flash')
const json2xls = require('json2xls')
const dateTime = require('node-datetime')
const favicon = require('serve-favicon')
const async = require('async')

const app = express()

const http = require('http').createServer(app)

const io = require('socket.io')(http)

let activeUsers = []

// Routes files
const index = require('./routes/index')

const routes = require('./routes/routes')

const banking = require('./routes/banking/banking')
const bankingMyProfile = require('./routes/banking/myprofile')
const bankingAreaProfile = require('./routes/banking/areaprofile')

const sale = require('./routes/sale/sale')
const saleMyProfile = require('./routes/sale/myprofile')

const visit = require('./routes/visit/visit')
const visitMyProfile = require('./routes/visit/myprofile')
const visitAreaProfile = require('./routes/visit/areaprofile')

const stock = require('./routes/stock/stock')

const expense = require('./routes/expense/expense')
const expenseMyProfile = require('./routes/expense/myprofile')

const admin = require('./routes/admin/admin')

const profile = require('./routes/profile/profile')
const profileAreaProfile = require('./routes/profile/areaprofile')

const dealerProfile = require('./routes/dealerProfile/dealerProfile')

const sale_SYSEDIT = require('./routes/sale_SYSEDIT')

const task = require('./routes/task')

const service = require('./routes/service/service')

// Model files
const Notification = require('./models/notification/notification')
const MDate = require('./functions/mdate')

app.use(favicon(__dirname + '/public/img/favicon.ico'))

app.disable('x-powered-by')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use(json2xls.middleware)

app.use(function(req, res, next){
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null)
    const dt = dateTime.create()
    const formatted = dt.format('Y-m-d H:M:S')
    if(req.user)
        console.log(ip + '    ' + formatted + '    ' + req.user.username + ' @ ' + req.url)
    else
        console.log(ip + '    ' + formatted + '    ' + req.url)

    res.locals.name = 'Randeepa Cloud'
    res.locals.error = req.flash('error')
    res.locals.success_msg = req.flash('success_msg')
    res.locals.warning_msg = req.flash('warning_msg')
    if(req.user != undefined) {
      async.series([
        function(callback) {
          Notification.getUserNotifications(req.user.username, callback)
        }, function(callback) {
          Notification.getUnreadUserNotifications(req.user.username, callback)
        }
      ], function(err, data) {
        res.locals.notifications = data[0]
        res.locals.notificationsCount = data[0].length
        res.locals.unreadNotificationsCount = data[1].length
        res.locals.pageURL = req.url
        next()
      })
    } else {
      next()
    }
})

// Configuring routes with files
app.use('/', index)

app.use('/routes', routes)

app.use('/banking', banking)
app.use('/banking-m/myprofile', bankingMyProfile)
app.use('/banking-a/areaprofile', bankingAreaProfile)

app.use('/sale', sale)
app.use('/sale-m/myprofile', saleMyProfile)

app.use('/visit/myprofile', visitMyProfile)
app.use('/visit/areaprofile', visitAreaProfile)
app.use('/visit', visit)

app.use('/expense/myprofile', expenseMyProfile)
app.use('/expense', expense)

app.use('/stock', stock)

app.use('/admin', admin)

app.use('/profile/areaprofile', profileAreaProfile)
app.use('/profile', profile)

app.use('/dealerProfile', dealerProfile)

app.use('/sale_SYSEDIT', sale_SYSEDIT)

app.use('/task', task)

app.use('/service', service)

app.get('*', function(req, res) {
    res.status(404).send('What???')
})

app.post('*', function(req, res) {
    res.status(404).send('What???')
})

io.on('connection', function(socket){

  let userName

  socket.on('user viewing', function(user){
    let inActiveUsers = false

    for(var x = 0; x < activeUsers.length; x++) {
        if(activeUsers[x].username == user) {
            inActiveUsers = true
            activeUsers[x].last_activity = MDate.getDateTime()
            break
        }
    }

    if(!inActiveUsers) {
        activeUsers.push({"username": user, "last_activity": MDate.getDateTime()})
    }

    userName = user

    io.emit('active users', activeUsers)

  })

  socket.on('disconnect', function(){

    let userIndex = -1

    for(var x = 0; x < activeUsers.length; x++) {
        if(activeUsers[x].username == userName) {
            userIndex = x
            break
        }
    }

    if(userIndex != -1) {
      activeUsers[x].last_activity = 'NULL'
    }

    io.emit('active users', activeUsers)
  })

  socket.on('message', function(msg) {
    io.emit('message', msg)
  })

})

app.set('port', (process.env.PORT || 3000))

http.listen(app.get('port'), function() {
    console.log('Server started on port ' + app.get('port'))
})
