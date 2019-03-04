const MySql = require('../comms/mySqlCon')
const MDate = require('../../functions/mdate')
const Task = module.exports = {}

Task.add = function(task, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('INSERT INTO task SET ?', task, function(err, result) {
            connection.release()
            if(err) {
                return callback(err, false)
            }
            callback(err, true)
        })
    })
}

Task.getTodayTasks = function(username, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT task.id, COUNT(TC.id) as task_comments, DATE_FORMAT(created, \'%Y-%m-%d %H:%I:%S\') as created, DATE_FORMAT(due, \'%Y-%m-%d\') as due, title, task.text FROM task LEFT JOIN task_comment TC ON task.id = TC.task_id WHERE DATE(due) = DATE(NOW()) AND complete = 0 AND username = ? GROUP BY task.id, created, due, complete, title, task.text;', username, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}



Task.getTodayTasksCount = function(username, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT COUNT(id) as count FROM task WHERE DATE(due) = DATE(NOW()) AND complete = 0 AND username = ?', username, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Task.getUpcomingTasks = function(username, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT task.id, COUNT(TC.id) as task_comments, DATE_FORMAT(created, \'%Y-%m-%d %H:%I:%S\') as created, DATE_FORMAT(due, \'%Y-%m-%d\') as due, title, task.text FROM task LEFT JOIN task_comment TC ON task.id = TC.task_id WHERE DATE(due) > DATE(NOW()) AND complete = 0 AND username = ? GROUP BY task.id, created, due, complete, title, task.text;', username, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Task.getUpcomingTasksCount = function(username, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT COUNT(id) as count FROM task WHERE DATE(due) > DATE(NOW()) AND complete = 0 AND username = ?', username, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Task.getOverdueTasks = function(username, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT task.id, COUNT(TC.id) as task_comments, DATE_FORMAT(created, \'%Y-%m-%d %H:%I:%S\') as created, DATE_FORMAT(due, \'%Y-%m-%d\') as due, title, task.text FROM task LEFT JOIN task_comment TC ON task.id = TC.task_id WHERE DATE(due) < DATE(NOW()) AND complete = 0 AND username = ? GROUP BY task.id, created, due, complete, title, task.text;', username, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Task.getOverdueTasksCount = function(username, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT COUNT(id) as count FROM task WHERE DATE(due) < DATE(NOW()) AND complete = 0 AND username = ?', username, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Task.getCompletedTasks = function(username, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT task.id, COUNT(TC.id) as task_comments, DATE_FORMAT(created, \'%Y-%m-%d %H:%I:%S\') as created, DATE_FORMAT(due, \'%Y-%m-%d\') as due, title, task.text FROM task LEFT JOIN task_comment TC ON task.id = TC.task_id WHERE complete = 1 AND username = ? GROUP BY task.id, created, due, complete, title, task.text;', username, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}


Task.getCompletedTasksCount = function(username, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT COUNT(id) as count FROM task WHERE complete = 1 AND username = ?', username, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Task.getDetails = function(taskId, username, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT task.id, DATE_FORMAT(created, \'%Y-%m-%d %H:%I:%S\') as created, DATE_FORMAT(due, \'%Y-%m-%d\') as due, title, task.text, complete FROM task WHERE task.id = ? AND task.username = ?', [taskId, username], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Task.getTaskComments = function(taskId, username, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT TC.id, DATE_FORMAT(TC.date, \'%Y-%m-%d  %H:%I:%S\') as date, TC.text FROM task_comment TC LEFT JOIN task T ON T.id = TC.task_id WHERE TC.task_id = ? AND T.username = ? ORDER BY date DESC', [taskId, username], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Task.addComment = function(taskComment, callback) {
  MySql.pool.getConnection(function(pool_err, connection) {
      if(pool_err) {
          return callback(pool_err, null)
      }
      connection.query('INSERT INTO task_comment SET ?', taskComment, function(err, result) {
          connection.release()
          if(err) {
              return callback(err, false)
          }
          callback(err, true)
      })
  })
}
