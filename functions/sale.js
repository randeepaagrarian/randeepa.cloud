const SalesFunctions = module.exports = {}

SalesFunctions.modelSummary = function(sales) {
    let summary = [{}]

    for(var i = 0; i < sales.length; i++) {

        let inSummary = false
        for(var x = 0; x < summary.length; x++) {
            if(summary[x].model == sales[i]['model_name']) {
                inSummary = true
                summary[x].sales = summary[x].sales + 1
                break
            }
        }

        if(!inSummary) {
            summary.push({"model": sales[i]['model_name'], "sales": 1})
        }

    }

    return summary
}


SalesFunctions.modelGroupSummary = function(sales) {
    let summary = [{}]

    for(var i = 0; i < sales.length; i++) {

        let inSummary = false
        for(var x = 0; x < summary.length; x++) {
            if(summary[x].model == sales[i]['model_group_name']) {
                inSummary = true
                summary[x].sales = summary[x].sales + 1
                break
            }
        }

        if(!inSummary) {
            summary.push({"model": sales[i]['model_group_name'], "sales": 1})
        }

    }

        summary.sort(function(a,b){
            return b.sales - a.sales    
        })

    return summary
}

SalesFunctions.dealerSalesSummary = function(sales) {
    
    let summary = [{}]
    

    for(var i = 0; i < sales.length; i++) {
        
        let inSummary = false
       
        for(var x = 0; x < summary.length; x++) {
            if(summary[x].model == sales[i]['sd_location']) {
                inSummary = true
                summary[x].sales = summary[x].sales + 1 

                   summary[x].price = parseFloat(sales[i]['sale_price']) + parseFloat(summary[x].price)

                break
            }
           
        }
       
        if(!inSummary) {
            summary.push({"model": sales[i]['sd_location'], "sales": 1, price: sales[i]['sale_price'], "region" : sales[i]['region_name'], "territory" : sales[i]['territory_name']})
           
        }
       
    }
    
        summary.sort(function (a, b) {
            return b.price - a.price ;
        });

    return summary
}    

SalesFunctions.regionSalesSummary = function(sales) {
    
    let summary = [{}]
    

    for(var i = 0; i < sales.length; i++) {
        
        let inSummary = false
       
        for(var x = 0; x < summary.length; x++) {
            if(summary[x].model == sales[i]['region_name']) {
                inSummary = true
               
                summary[x].sales = summary[x].sales + 1 
                summary[x].price = parseFloat(sales[i]['sale_price']) + parseFloat(summary[x].price)

                break
            }
           
        }
       
        if(!inSummary) {
            summary.push({"model": sales[i]['region_name'], "sales": 1, price: sales[i]['sale_price']})
           
        }
       
    }
    
        summary.sort(function (a, b) {
            return b.price - a.price ;
        });

    return summary
}

SalesFunctions.territorySalesSummary = function(sales) {
    
    let summary = [{}]
    

    for(var i = 0; i < sales.length; i++) {
        
        let inSummary = false
       
        for(var x = 0; x < summary.length; x++) {
            if(summary[x].model == sales[i]['territory_name'] && summary[x].mod == sales[i]['region_name']) {
                inSummary = true
               
                summary[x].sales = summary[x].sales + 1 
                summary[x].price = parseInt(sales[i]['sale_price']) + parseInt(summary[x].price)

                break
            }
           
        }
       
        if(!inSummary) {
            summary.push({"model": sales[i]['territory_name'], "sales": 1, "price": sales[i]['sale_price'], "mod": sales[i]['region_name']})
           
        }
       
    }
    
        summary.sort(function (a, b) {
            return b.price - a.price ;
        });
   
     return summary
}