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
