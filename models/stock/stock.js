const MySql = require('../comms/mySqlCon2')
const Stock = module.exports = {}

Stock.newPackingList = function(deliveryDocument, machines, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.beginTransaction(function(err) {
            if(err) {
                connection.release()
                return callback(err, null)
            }

            connection.query('INSERT INTO delivery_document SET ?', deliveryDocument, function(err, results, fields) {
                if(err) {
                    return connection.rollback(function() {
                        connection.release()
                        callback(err, null)
                    })
                }

                machines.forEach(function(machine) {
                    machine.unshift(results.insertId)
                })

                connection.query('INSERT INTO main_stock (delivery_document_id, model_id, primary_id, secondary_id, price) VALUES ?', [machines], function(err, results, fields) {
                    if(err) {
                        return connection.rollback(function() {
                            connection.release()
                            callback(err, null)
                        })
                    }

                    connection.commit(function(err) {
                        if(err) {
                            return connection.rollback(function() {
                                connection.release()
                                callback(err, null)
                            })
                        }
                        connection.release()
                        callback(err, true)
                    })
                })

            })

        })
    })
}

Stock.newDeliveryNote = function(deliveryDocument, machines, prices, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.beginTransaction(function(err) {
            if(err) {
                connection.release()
                return callback(err, null)
            }

            connection.query('SELECT main_stock.*, DATE_FORMAT(date, \'%Y-%m-%d %H:%i:%s\') AS date FROM main_stock LEFT JOIN delivery_document ON main_stock.delivery_document_id = delivery_document.id WHERE dealer_id = ? AND primary_id IN (?) AND sold = 0', [deliveryDocument.from_dealer_id, machines], function(err, rows, fields) {
                if(err) {
                    return connection.rollback(function() {
                        connection.release()
                        callback(err, null)
                    })
                }

                if(rows.length != machines.length) {
                    err = { code: 'ONE_OR_MORE_INVALID_TRANSFERS' }
                    return connection.rollback(function() {
                        connection.release()
                        callback(err, null)
                    })
                }

                let stockHistoryMachines = []
                let mainStockMachines = []

                for(let i = 0; i < rows.length; i++) {
                    stockHistoryMachines.push([rows[i]['delivery_document_id'], rows[i]['model_id'], rows[i]['primary_id'], rows[i]['secondary_id'], rows[i]['price'], rows[i]['date'] ])
                    mainStockMachines.push([rows[i]['model_id'], rows[i]['primary_id'], rows[i]['secondary_id'], prices[i]])
                }

                stockHistoryMachines.forEach(function(stockHistoryMachine) {
                    stockHistoryMachine.push(deliveryDocument.date)
                })

                connection.query('INSERT INTO stock_history VALUES ?', [stockHistoryMachines], function(err, results, rows) {
                    if(err) {
                        return connection.rollback(function() {
                            connection.release()
                            callback(err, null)
                        })
                    }

                    connection.query('INSERT INTO delivery_document SET ?', deliveryDocument, function(err, results, fields) {
                        if(err) {
                            return connection.rollback(function() {
                                connection.release()
                                callback(err, null)
                            })
                        }

                        mainStockMachines.forEach(function(mainStockMachine) {
                            mainStockMachine.unshift(results.insertId)
                        })

                        connection.query('DELETE FROM main_stock WHERE primary_id IN (?)', [machines], function(err, results, fields) {
                            if(err) {
                                return connection.rollback(function() {
                                    connection.release()
                                    callback(err, null)
                                })
                            }

                            connection.query('INSERT INTO main_stock (delivery_document_id, model_id, primary_id, secondary_id, price) VALUES ?', [mainStockMachines], function(err, results, fields) {
                                if(err) {
                                    return connection.rollback(function() {
                                        connection.release()
                                        callback(err, null)
                                    })
                                }

                                connection.commit(function(err) {
                                    if(err) {
                                        return connection.rollback(function() {
                                            connection.release()
                                            callback(err, null)
                                        })
                                    }
                                    connection.release()
                                    callback(err, true)
                                })
                            })
                        })

                    })
                })

            })
        })
    })
}

Stock.newTransferNote = function(deliveryDocument, machines, prices, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.beginTransaction(function(err) {
            if(err) {
                connection.release()
                return callback(err, null)
            }

            connection.query('SELECT main_stock.*, DATE_FORMAT(date, \'%Y-%m-%d %H:%i:%s\') AS date FROM main_stock LEFT JOIN delivery_document ON main_stock.delivery_document_id = delivery_document.id WHERE dealer_id = ? AND primary_id IN (?) AND sold = 0', [deliveryDocument.from_dealer_id, machines], function(err, rows, fields) {
                if(err) {
                    return connection.rollback(function() {
                        connection.release()
                        callback(err, null)
                    })
                }

                if(rows.length != machines.length) {
                    err = { code: 'ONE_OR_MORE_INVALID_TRANSFERS' }
                    return connection.rollback(function() {
                        connection.release()
                        callback(err, null)
                    })
                }

                let stockHistoryMachines = []
                let mainStockMachines = []

                for(let i = 0; i < rows.length; i++) {
                    stockHistoryMachines.push([rows[i]['delivery_document_id'], rows[i]['model_id'], rows[i]['primary_id'], rows[i]['secondary_id'], rows[i]['price'], rows[i]['date'] ])
                    mainStockMachines.push([rows[i]['model_id'], rows[i]['primary_id'], rows[i]['secondary_id'], prices[i]])
                }

                stockHistoryMachines.forEach(function(stockHistoryMachine) {
                    stockHistoryMachine.push(deliveryDocument.date)
                })

                connection.query('INSERT INTO stock_history VALUES ?', [stockHistoryMachines], function(err, results, rows) {
                    if(err) {
                        return connection.rollback(function() {
                            connection.release()
                            callback(err, null)
                        })
                    }

                    connection.query('INSERT INTO delivery_document SET ?', deliveryDocument, function(err, results, fields) {
                        if(err) {
                            return connection.rollback(function() {
                                connection.release()
                                callback(err, null)
                            })
                        }

                        mainStockMachines.forEach(function(mainStockMachine) {
                            mainStockMachine.unshift(results.insertId)
                        })

                        connection.query('DELETE FROM main_stock WHERE primary_id IN (?)', [machines], function(err, results, fields) {
                            if(err) {
                                return connection.rollback(function() {
                                    connection.release()
                                    callback(err, null)
                                })
                            }

                            connection.query('INSERT INTO main_stock (delivery_document_id, model_id, primary_id, secondary_id, price) VALUES ?', [mainStockMachines], function(err, results, fields) {
                                if(err) {
                                    return connection.rollback(function() {
                                        connection.release()
                                        callback(err, null)
                                    })
                                }

                                connection.commit(function(err) {
                                    if(err) {
                                        return connection.rollback(function() {
                                            connection.release()
                                            callback(err, null)
                                        })
                                    }
                                    connection.release()
                                    callback(err, true)
                                })
                            })
                        })
                    })
                })

            })
        })
    })
}

Stock.newReturnNote = function(deliveryDocument, machines, prices, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.beginTransaction(function(err) {
            if(err) {
                connection.release()
                return callback(err, null)
            }

            connection.query('SELECT main_stock.*, DATE_FORMAT(date, \'%Y-%m-%d %H:%i:%s\') AS date FROM main_stock LEFT JOIN delivery_document ON main_stock.delivery_document_id = delivery_document.id WHERE dealer_id = ? AND primary_id IN (?) AND sold = 0', [deliveryDocument.from_dealer_id, machines], function(err, rows, fields) {
                if(err) {
                    return connection.rollback(function() {
                        connection.release()
                        callback(err, null)
                    })
                }

                if(rows.length != machines.length) {
                    err = { code: 'ONE_OR_MORE_INVALID_TRANSFERS' }
                    return connection.rollback(function() {
                        connection.release()
                        callback(err, null)
                    })
                }

                let stockHistoryMachines = []
                let mainStockMachines = []

                for(let i = 0; i < rows.length; i++) {
                    stockHistoryMachines.push([rows[i]['delivery_document_id'], rows[i]['model_id'], rows[i]['primary_id'], rows[i]['secondary_id'], rows[i]['price'], rows[i]['date'] ])
                    mainStockMachines.push([rows[i]['model_id'], rows[i]['primary_id'], rows[i]['secondary_id'], prices[i]])
                }

                stockHistoryMachines.forEach(function(stockHistoryMachine) {
                    stockHistoryMachine.push(deliveryDocument.date)
                })

                connection.query('INSERT INTO stock_history VALUES ?', [stockHistoryMachines], function(err, results, rows) {
                    if(err) {
                        return connection.rollback(function() {
                            connection.release()
                            callback(err, null)
                        })
                    }

                    connection.query('INSERT INTO delivery_document SET ?', deliveryDocument, function(err, results, fields) {
                        if(err) {
                            return connection.rollback(function() {
                                connection.release()
                                callback(err, null)
                            })
                        }

                        mainStockMachines.forEach(function(mainStockMachine) {
                            mainStockMachine.unshift(results.insertId)
                        })

                        connection.query('DELETE FROM main_stock WHERE primary_id IN (?)', [machines], function(err, results, fields) {
                            if(err) {
                                return connection.rollback(function() {
                                    connection.release()
                                    callback(err, null)
                                })
                            }

                            connection.query('INSERT INTO main_stock (delivery_document_id, model_id, primary_id, secondary_id, price) VALUES ?', [mainStockMachines], function(err, results, fields) {
                                if(err) {
                                    return connection.rollback(function() {
                                        connection.release()
                                        callback(err, null)
                                    })
                                }

                                connection.commit(function(err) {
                                    if(err) {
                                        return connection.rollback(function() {
                                            connection.release()
                                            callback(err, null)
                                        })
                                    }
                                    connection.release()
                                    callback(err, true)
                                })
                            })
                        })

                    })

                })

            })
        })
    })
}

Stock.getMainStocks = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query('SELECT * FROM dealer WHERE dealer_type_id = 1 ORDER BY name ASC;', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Stock.getImporters = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query('SELECT * FROM dealer WHERE dealer_type_id = 4 ORDER BY name ASC;', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Stock.getDealersAndShowrooms = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query('SELECT * FROM dealer WHERE dealer_type_id IN (2, 3) ORDER BY name ASC;', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Stock.getSecondaryIdModelName = function(primaryId, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query('SELECT secondary_id, name FROM main_stock LEFT JOIN model ON main_stock.model_id = model.id WHERE primary_id = ? AND sold = 0;', primaryId, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Stock.validateMainStock = function(mainStockId, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query('SELECT * FROM dealer WHERE id = ? AND dealer_type_id = 1;', mainStockId, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            if(rows.length == 1) {
                callback(err, true)
            } else {
                callback(err, false)
            }
        })
    })
}

Stock.validateImporter = function(importerID, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query('SELECT * FROM dealer WHERE id = ? AND dealer_type_id = 4;', importerID, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            if(rows.length == 1) {
                callback(err, true)
            } else {
                callback(err, false)
            }
        })
    })
}

Stock.validateShowroomOrDealer = function(showroomDealerId, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query('SELECT * FROM dealer WHERE id = ? AND dealer_type_id IN (2,3);', showroomDealerId, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            if(rows.length == 1) {
                callback(err, true)
            } else {
                callback(err, false)
            }
        })
    })
}

Stock.getStock = function(locationId, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query('SELECT delivery_document_id, model_id, primary_id, secondary_id, price, model.name, dealer_id, DATE_FORMAT(date, \'%Y-%m-%d %H:%i:%S\') AS date, delivery_document_type_id, delivery_document_type.name AS delivery_document_type_name FROM main_stock LEFT JOIN model ON main_stock.model_id = model.id LEFT JOIN delivery_document ON main_stock.delivery_document_id = delivery_document.id LEFT JOIN delivery_document_type ON delivery_document_type_id = delivery_document_type.id WHERE dealer_id = ? AND sold = 0;', locationId, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Stock.getDealerOrShowroomDetails = function(showroomDealerId, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query('SELECT * FROM dealer WHERE id = ?;', showroomDealerId, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Stock.getStockHistory = function(primaryId, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query('SELECT delivery_document_id, model_id, primary_id, secondary_id, price, DATE_FORMAT(date_in, \'%Y-%m-%d %H:%i:%S\') AS date_in, DATE_FORMAT(date_out, \'%Y-%m-%d %H:%i:%S\') AS date_out, delivery_document_type_id, dealer_id, delivery_document_type.name AS delivery_document_type_name, dealer.name AS dealer_name, model.name AS model_name, notes FROM stock_history LEFT JOIN delivery_document ON delivery_document_id = delivery_document.id LEFT JOIN delivery_document_type ON delivery_document_type_id = delivery_document_type.id LEFT JOIN dealer ON dealer_id = dealer.id LEFT JOIN model ON model_id = model.id WHERE primary_id = ? ORDER BY date_in DESC', primaryId, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Stock.getCurrentLocation = function(primaryId, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query('SELECT delivery_document_id, model_id, primary_id, secondary_id, price, delivery_document_type_id, dealer_id, DATE_FORMAT(date, \'%Y-%m-%d %H:%i:%S\') AS date, dealer.name AS dealer_name, delivery_document_type.name AS delivery_document_type_name, model.name AS model_name, notes FROM main_stock LEFT JOIN delivery_document ON delivery_document_id = delivery_document.id LEFT JOIN dealer ON dealer_id = dealer.id LEFT JOIN delivery_document_type ON delivery_document_type_id = delivery_document_type.id LEFT JOIN model ON model_id = model.id WHERE primary_id = ? AND sold = 0', primaryId, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Stock.getModels = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query('SELECT * FROM model', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Stock.getDeliveryDocuments = function(pageNumber, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        const offset = (pageNumber - 1) * 10

        connection.query('SELECT delivery_document.id, delivery_document_type_id, dealer_id, DATE_FORMAT(date, \'%Y-%m-%d %H:%i:%S\') AS date, issuer, notes, delivery_document_type.name AS delivery_document_type_name, dealer.name AS dealer_name FROM delivery_document LEFT JOIN delivery_document_type ON delivery_document_type_id = delivery_document_type.id LEFT JOIN dealer ON dealer_id = dealer.id ORDER BY date DESC LIMIT 10 OFFSET ?', offset, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Stock.getRecentFivedeliveryDocuments = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query('SELECT delivery_document.id, delivery_document_type_id, dealer_id, DATE_FORMAT(date, \'%Y-%m-%d %H:%i:%S\') AS date, issuer, notes, delivery_document_type.name AS delivery_document_type_name, dealer.name AS dealer_name FROM delivery_document LEFT JOIN delivery_document_type ON delivery_document_type_id = delivery_document_type.id LEFT JOIN dealer ON dealer_id = dealer.id ORDER BY date DESC LIMIT 5 OFFSET 0', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Stock.getDeliveryDocumentContent = function(deliveryDocumentId, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query('(SELECT primary_id, secondary_id, model.name AS model_name, price FROM main_stock LEFT JOIN model ON model_id = model.id WHERE delivery_document_id = ?) UNION (SELECT primary_id, secondary_id, model.name AS model_name, price FROM stock_history LEFT JOIN model ON model_id = model.id WHERE delivery_document_id = ?)', [deliveryDocumentId, deliveryDocumentId], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Stock.getDeliveryDocumentDetails = function(deliveryDocumentId, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

            connection.query('SELECT d1.name AS dealer_name, d1.address AS dealer_address, d2.name AS from_dealer, DATE_FORMAT(date, \'%Y-%m-%d %H:%i:%S\') AS date, issuer, notes, officer_responsible, officer_telephone, vehicle_no, driver_name, driver_nic, driver_telephone, delivery_document_type.name AS delivery_document_type_name FROM delivery_document LEFT JOIN dealer AS d1 ON delivery_document.dealer_id = d1.id LEFT JOIN dealer AS d2 ON delivery_document.from_dealer_id = d2.id LEFT JOIN delivery_document_type ON delivery_document_type_id = delivery_document_type.id WHERE delivery_document.id = ?', deliveryDocumentId, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Stock.search = function(skw, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query('SELECT delivery_document_id, model.name AS model_name, dealer_id, dealer.name, primary_id, secondary_id, notes, sold FROM main_stock LEFT JOIN model ON model_id = model.id LEFT JOIN delivery_document ON delivery_document_id = delivery_document.id LEFT JOIN dealer ON dealer_id = dealer.id WHERE CONCAT(delivery_document_id, model.name, dealer.name, primary_id, secondary_id, notes) LIKE \'%' + skw + '%\'', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Stock.addDealer = function(dealer, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query('INSERT INTO dealer SET ?', dealer, function(err, result) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, true)
        })
    })
}

Stock.getAllDealers = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query('SELECT dealer.id, dealer.name, address, telephone, dealer_type.name AS dealer_type_name, territory.name as territory_name FROM dealer LEFT JOIN dealer_type ON dealer.dealer_type_id = dealer_type.id LEFT JOIN territory ON dealer.territory_id = territory.id ORDER BY name ASC', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Stock.getDealerDetails = function(dealerId, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query('SELECT dealer.name, address, telephone, territory_id, dealer_type.name AS dealer_type_name FROM dealer LEFT JOIN dealer_type ON dealer.dealer_type_id = dealer_type.id WHERE dealer.id = ?', dealerId, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Stock.updateDealerDetails = function(dealerId, dealerUpdate, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query('UPDATE dealer SET ? WHERE id = ?', [dealerUpdate, dealerId], function(err, result, fields) {
            if(err) {
                return callback(err, null)
            }
            callback(err, true)
        })
    })
}

Stock.totalStock = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query('SELECT model.name AS model_name, COUNT(*) AS stock FROM main_stock LEFT JOIN model ON model_id = model.id LEFT JOIN delivery_document ON delivery_document_id = delivery_document.id LEFT JOIN dealer ON dealer_id = dealer.id LEFT JOIN dealer_type ON dealer_type_id = dealer_type.id WHERE sold = 0 GROUP BY model_id ORDER BY COUNT(*) DESC', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Stock.totalYardStock = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query('SELECT model.name AS model_name, COUNT(*) AS stock FROM main_stock LEFT JOIN model ON model_id = model.id LEFT JOIN delivery_document ON delivery_document_id = delivery_document.id LEFT JOIN dealer ON dealer_id = dealer.id LEFT JOIN dealer_type ON dealer_type_id = dealer_type.id WHERE dealer_type.name = \'Main Stock\' AND sold = 0 GROUP BY model_id ORDER BY COUNT(*) DESC', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Stock.totalOutletStock = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query('SELECT model.name AS model_name, COUNT(*) AS stock FROM main_stock LEFT JOIN model ON model_id = model.id LEFT JOIN delivery_document ON delivery_document_id = delivery_document.id LEFT JOIN dealer ON dealer_id = dealer.id LEFT JOIN dealer_type ON dealer_type_id = dealer_type.id WHERE dealer_type.name = \'Dealer\' OR dealer_type.name = \'Showroom\' AND sold = 0 GROUP BY model_id ORDER BY COUNT(*) DESC', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Stock.totalDealerStock = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query('SELECT model.name AS model_name, COUNT(*) AS stock FROM main_stock LEFT JOIN model ON model_id = model.id LEFT JOIN delivery_document ON delivery_document_id = delivery_document.id LEFT JOIN dealer ON dealer_id = dealer.id LEFT JOIN dealer_type ON dealer_type_id = dealer_type.id WHERE dealer_type.name = \'Dealer\' AND sold = 0 GROUP BY model_id ORDER BY COUNT(*) DESC', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Stock.totalShowroomStock = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query('SELECT model.name AS model_name, COUNT(*) AS stock FROM main_stock LEFT JOIN model ON model_id = model.id LEFT JOIN delivery_document ON delivery_document_id = delivery_document.id LEFT JOIN dealer ON dealer_id = dealer.id LEFT JOIN dealer_type ON dealer_type_id = dealer_type.id WHERE dealer_type.name = \'Showroom\' AND sold = 0 GROUP BY model_id ORDER BY COUNT(*) DESC', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Stock.markSold = function(primaryId, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query('UPDATE main_stock SET sold = 1 WHERE primary_id = ?', primaryId, function(err, result, fields) {
            if(err) {
                return callback(err, null)
            }
            callback(err, true)
        })
    })
}
