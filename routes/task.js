const express = require('express')
const async = require('async')

const router = express.Router()

const Auth = require('../functions/auth')
const MDate = require('../functions/mdate')

const Task = require('../models/task/task')

router.use(Auth.signedIn, Auth.validTaskUser, function(req, res, next) {
    next()
})

router.get('/', function(req, res) {
    async.series([
        function(callback) {
            Task.getTodayTasks(req.user.username, callback)
        }, function(callback) {
            Task.getOverdueTasks(req.user.username, callback)
        }, function(callback) {
            Task.getUpcomingTasks(req.user.username, callback)
        }, function(callback) {
            Task.getCompletedTasks(req.user.username, callback)
        }, function(callback) {
            Task.getTodayTasksCount(req.user.username, callback)
        }, function(callback) {
            Task.getOverdueTasksCount(req.user.username, callback)
        }, function(callback) {
            Task.getUpcomingTasksCount(req.user.username, callback)
        }, function(callback) {
            Task.getCompletedTasksCount(req.user.username, callback)
        }
    ], function(err, data) {
        res.render('task', {
            navbar: 'Task',
            user: req.user,
            title: 'Task',
            today_tasks: data[0],
            overdue_tasks: data[1],
            upcoming_tasks: data[2],
            completed_tasks: data[3],
            today_tasks_count: data[4],
            overdue_tasks_count: data[5],
            upcoming_tasks_count: data[6],
            completed_tasks_count: data[7]
        })
    })
})

router.get('/add', function(req, res) {
    res.render('task/add', {
        navbar: 'Task',
        user: req.user,
        title: 'Add Task'
    })
})

router.post('/add', function(req, res) {
    if(req.body.task_title == '' || req.body.task_text == '' || req.body.task_due == '') {
        req.flash('warning_msg', 'Please make sure all details are provided')
        res.redirect('/task/add')
        return
    }

    let task = {
        created: MDate.getDateTime('-'),
        username: req.user.username,
        due: req.body.task_due,
        title: req.body.task_title,
        text: req.body.task_text
    }

    async.series([
        function(callback) {
            Task.add(task, callback)
        }
    ], function(err, data) {
        if(data[0] == true) {
            req.flash('warning_msg', 'Task successfully created')
            res.redirect('/task/add')
            return
        } else {
            req.flash('warning_msg', 'Something went wrong while adding the task')
            res.redirect('/task/add')
            return
        }
    })
})

router.get('/view', function(req, res) {
    async.series([
      function(callback) {
        Task.getDetails(req.query.id, req.user.username, callback)
      }, function(callback) {
        Task.getTaskComments(req.query.id, req.user.username, callback)
      }
    ], function(err, data) {
      res.render('task/view', {
        title: 'Task Details',
        navbar: 'Task',
        user: req.user,
        taskDetails: data[0],
        taskComments: data[1]
      })
    })
})

router.post('/addComment/:taskID', function(req, res) {
  let taskComment = {
    task_id: req.params.taskID,
    date: MDate.getDateTime('-'),
    text: req.body.comment
  }

  async.series([
    function(callback) {
      Task.addComment(taskComment, callback)
    }
  ], function(err, data) {
    if(data[0] == true) {
      res.redirect('/task/view?id=' + req.params.taskID)
    } else {
      res.send('Error')
    }
  })
})

router.get('/overdue', function(req, res) {
    res.send('/task/overdue')
})

router.get('/completed', function(req, res) {
    res.send('/task/completed')
})

router.get('/today', function(req, res) {
    res.send('/task/today')
})

module.exports = router
