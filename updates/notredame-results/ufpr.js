import * as d3 from "https://cdn.skypack.dev/d3@7"
import "https://cdn.plot.ly/plotly-2.5.0.min.js"
import "/tablefilter/tablefilter.js"


var networks = ["DenseNet121", "EfficientNetB0", "EfficientNetB4", "InceptionResNetV2", "InceptionV3", "MobileNetV2", "ResNet50", "Xception"]

// Set confusion matrix

d3.select('#cm_title').html('Confusion Matrix : DenseNet121')

function cmBtnClicked() {
    var bal = $("#cm_btns_tm .active")[0].value
    d3.json("assets/" + this.value + "_Notredame_band_aug_gender_finetuned_" + bal + "_0_cm.json").then(function (data) {
        Plotly.newPlot("cm", data)
    });
    d3.select('#cm_title').html('Confusion Matrix : ' + this.value)
    $(this).addClass("active").siblings().removeClass("active");
}

function cmBtnBalanceClicked(bal, elem) {
    var model = $("#cm_btns_model .active")[0].textContent
    d3.json("assets/" + model + "_Notredame_band_aug_gender_finetuned_" + bal + "_0_cm.json").then(function (data) {
        Plotly.newPlot("cm", data)
    });
    $(elem).addClass("active").siblings().removeClass("active");
}

$("#cm_btns_tm_5050").on("click", function(){
    cmBtnBalanceClicked("F50M50", this)
})
$("#cm_btns_tm_2575").on("click", function(){
    cmBtnBalanceClicked("F25M75", this)
})
$("#cm_btns_tm_7525").on("click", function(){
    cmBtnBalanceClicked("F75M25", this)
})

for (var i = 0; i < networks.length; ++i) {
    var cls = "btn btn-light"
    if (i == 0) {
        cls += " active"
    }
    var network = networks[i]
    var btn = d3.select('#cm_btns_model')
        .append('input')
    btn.attr("value", network)
        .html(network)
        .attr("class", cls)
        .attr("type", "button")
    btn.on("click", cmBtnClicked)
}


d3.json("assets/DenseNet121_Notredame_band_aug_gender_finetuned_F50M50_0_cm.json").then(function (data) {
    Plotly.newPlot("cm", data)
});


function updateGcChart(tb) {
    d3.csv("assets/Notredame_gender.csv").then(function (data) {
        console.log(data)
        var data1 = data.filter(function (d) {
            return d["Train Balance"] == tb
        })


        console.log(data1)
        var x = data1.map(function (d) {
            return d["Model"]
        })

        var y1 = data1.map(function (d) {
            return d["F50M50"]
        })

        var y2 = data1.map(function (d) {
            return d["F100"]
        })

        var y3 = data1.map(function (d) {
            return d["M100"]
        })

        console.log(x)

        var trace1 = {
            x: x,
            y: y1,
            type: 'bar',
            name: 'F50M50'
        }


        var trace2 =
        {
            x: x,
            y: y2,
            type: 'bar',
            name: 'F100'
        }


        var trace3 =
        {
            x: x,
            y: y3,
            type: 'bar',
            name: 'M100'
        }

        var layout = {
            barmode: 'group',
            title: 'Gender Classification (Train Balance: ' + tb + ')',
            xaxis: {
                title: 'Models',
            },
            yaxis: {
                title: "Accuracy",
                type: 'log',
            }
        };
        Plotly.newPlot("gc_acc", [trace1, trace2, trace3], layout)
    });
}


function gcBtnClicked() {
    updateGcChart(this.textContent)
    $(this).addClass("active").siblings().removeClass("active");
}
var train_balance = ["F50M50", "F25M75", "F75M25"]

for (var i = 0; i < train_balance.length; ++i) {
    var cls = "btn btn-light"
    if (i == 0) {
        cls += " active"
    }
    var tb = train_balance[i]
    var btn = d3.select('#gc_btns_model')
        .append('input')
    btn.attr("value", tb)
        .html(tb)
        .attr("class", cls)
        .attr("type", "button")
    btn.on("click", gcBtnClicked)
}

updateGcChart("F50M50");

// Subject verification
train_balance = ["F50M50", "F100", "M100"]

function tbBtnClicked() {
    var type = $("#tb_btns_tm .active")[0].value
    updateTbChart(this.textContent, type)
    $(this).addClass("active").siblings().removeClass("active");
}

for (var i = 0; i < train_balance.length; ++i) {
    var cls = "btn btn-light"
    if (i == 0) {
        cls += " active"
    }
    var tb = train_balance[i]
    var btn = d3.select('#tb_btns_model')
        .append('input')
    btn.attr("value", tb)
        .html(tb)
        .attr("class", cls)
        .attr("type", "button")
    btn.on("click", tbBtnClicked)
}


d3.select('#tb_btns_eer').on("click", function () {
    var tb = $("#tb_btns_model .active")[0].textContent
    updateTbChart(tb, "EER")
    $(this).addClass("active").siblings().removeClass("active");

})

d3.select('#tb_btns_auc').on("click", function () {
    var tb = $("#tb_btns_model .active")[0].textContent
    updateTbChart(tb, "AUC")
    $(this).addClass("active").siblings().removeClass("active");
})


function updateTbChart(tb, col) {
    d3.csv("assets/Notredame_verification.csv").then(function (data) {
        var data1 = data.filter(function (d) {
            return d["Train Balance"] == tb && d["Test Balance"] == "F50M50"
        })

        var data2 = data.filter(function (d) {
            return d["Train Balance"] == tb && d["Test Balance"] == "F100"
        })

        var data3 = data.filter(function (d) {
            return d["Train Balance"] == tb && d["Test Balance"] == "M100"
        })

        var x = data1.map(function (d) {
            return d["Experiment ID"]
        })

        var y1 = data1.map(function (d) {
            return d[col]
        })

        var y2 = data2.map(function (d) {
            return d[col]
        })

        var y3 = data3.map(function (d) {
            return d[col]
        })

        var trace1 = {
            x: x,
            y: y1,
            type: 'bar',
            name: 'F50M50'
        }


        var trace2 =
        {
            x: x,
            y: y2,
            type: 'bar',
            name: 'F100'
        }


        var trace3 =
        {
            x: x,
            y: y3,
            type: 'bar',
            name: 'M100'
        }

        var layout = {
            barmode: 'group',
            title: 'Verification ' + col + ' (Train Balance: ' + tb + ')',
            xaxis: {
                title: 'Models',
            },
            yaxis: {
                title: col,
                type: 'log',
            }
        };
        Plotly.newPlot("sv_eer", [trace1, trace2, trace3], layout)
    });
}

updateTbChart("F50M50", "EER");

// Add Full results table
var tabulate = function (data, columns) {
    var table = d3.select('#sv_table').append('table')
    table.attr("id", "sv_table_tb")
    var thead = table.append('thead')
    var tbody = table.append('tbody')

    thead.append('tr')
        .selectAll('th')
        .data(columns)
        .enter()
        .append('th')
        .text(function (d) { return d })

    var rows = tbody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr')

    var cells = rows.selectAll('td')
        .data(function (row) {
            return columns.map(function (column) {
                return { column: column, value: row[column] }
            })
        })
        .enter()
        .append('td')
        .text(function (d) { 
            if(!isNaN(parseFloat(d.value))) 
                return parseFloat(d.value).toFixed(4) 
            else 
                return d.value
        })
    return table;
}

d3.csv('assets/Notredame_verification.csv').then(function (data) {
    var columns = ['Experiment ID', 'AUC', 'EER', 'ZeroFMR', 'FMR10', 'FMR20', 'FMR100', 'FMR1000', 'Train Balance', 'Test Balance']
    tabulate(data, columns)
})

$(window).on("load", function () {
    var tf = new TableFilter('sv_table_tb', {
        base_path: '/tablefilter/',
        alternate_rows: true,
        btn_reset: true,
        rows_counter: true,
        status_bar: true,
        mark_active_columns: {
            highlight_column: true
        },
        highlight_keywords: true,
        no_results_message: true,
        col_0: 'select',
        col_1: 'none',
        col_2: 'none',
        col_3: 'none',
        col_4: 'none',
        col_5: 'none',
        col_6: 'none',
        col_7: 'none',
        col_8: 'select',
        col_9: 'select',
        paging: {
            results_per_page: ['Records: ', [10, 25, 50, 100]]
        },
        extensions: [{ name: 'sort' },],
        // responsive: true,
        filters_cell_tag: 'th',

        themes: [{
            name: 'transparent'
        }]
    })
    tf.init()
    tf.setFilterValue(8, "F50M50");
    tf.setFilterValue(9, "F50M50");
    tf.filter();
    
});


// Visualizations
var train_balance = "F50M50"

function plotViz(id, method, tpfn, addBtn = true, model = "EfficientNetB4", cls_="pos") {
    var tpfn_dict = {
        "tp": "True Positives",
        "fn": "False Negatives",
        "fp": "False Positives",
        "tn": "True Negatives"
    }
    var tpfns = ["tp", "fn", "fp", "tn"]
    var classes = ["pos", "neg"]
    var class_names = ["Male", "Female"]
    if (addBtn) {
        for (var i = 0; i < networks.length; ++i) {
            var cls = "btn btn-light"
            if (i == 2) {
                cls += " active"
            }
            var btn = d3.select(id + '_models')
                .append('input')
            btn.attr("value", networks[i])
                .html(networks[i])
                .attr("class", cls)
                .attr("type", "button")
            btn.on("click", function () {
                var activeTpfn = $(id + '_opts .active')[0]
                var activeClass = $(id + '_class .active')[0]
                plotViz(id, method, activeTpfn.textContent, false, this.textContent, activeClass.textContent)
                $(this).addClass("active").siblings().removeClass("active");
            })
        }

        for (var i = 0; i < tpfns.length; ++i) {
            var cls = "btn btn-light"
            if (i == 0) {
                cls += " active"
            }
            var tb = tpfns[i]
            var btn = d3.select(id + '_opts')
                .append('input')
            btn.attr("value", tpfn_dict[tb])
                .html(tb)
                .attr("class", cls)
                .attr("type", "button")
            btn.on("click", function () {
                var activeModel = $(id + '_models .active')[0]
                var activeClass = $(id + '_class .active')[0]
                plotViz(id, method, this.textContent, false, activeModel.textContent, activeClass.textContent)
                $(this).addClass("active").siblings().removeClass("active");
            })
        }

        for (var i = 0; i < classes.length; ++i) {
            var cls = "btn btn-light"
            if (i == 0) {
                cls += " active"
            }
            var btn = d3.select(id + '_class')
                .append('input')
            btn.attr("value", class_names[i])
                .html(classes[i])
                .attr("class", cls)
                .attr("type", "button")
            btn.on("click", function () {
                var activeTpfn = $(id + '_opts .active')[0]
                var activeModel = $(id + '_models .active')[0]
                plotViz(id, method, activeTpfn.textContent, false, activeModel.textContent, this.textContent)
                $(this).addClass("active").siblings().removeClass("active");
            })
        }
    }
    d3.select(id).html("")
    // TODO: Changet to update instead of recreating everytime
    for (var i = 0; i < 10; ++i) {
        var src = "assets/imgs/" + model + "_Notredame_band_aug_gender_finetuned_" + train_balance + "_" + method + "_" + cls_ + "_" + tpfn + "_" + i + ".png"
        var btn = d3.select(id)
            .append('img')
            .attr("src", src)
    }
}

plotViz('#viz_gradcam', 'grad_cam', "tp")
plotViz('#viz_guided_gradcam', 'guided_gradcam', "tp")
plotViz('#viz_occlusion_sensitivity', 'occlusion_sensitivity', "tp")
// plotViz('#viz_smoothgrad', 'smoothgrad', "tp")
plotViz('#viz_vanilla_gradients', 'vanilla_gradients', "tp")
plotViz('#viz_integrated_gradients', 'integrated_gradients', "tp")
plotViz('#viz_gradients_input', 'gradients_inputs', "tp")


// Show averaged image on modal
function showAvgModal(id, method) {
    var activeTpfn = $(id + '_opts .active')[0]
    var activeClass = $(id + '_class .active')[0]
    var activeModel = $(id + '_models .active')[0]
    var src = "assets/imgs/" + activeModel.textContent + "_Notredame_band_aug_gender_finetuned_" + train_balance + "_" + method + "_" + activeClass.textContent + "_" + activeTpfn.textContent + "_avg.png"
    $("#viz_avg_modal").attr("src", src)
    // $('#myModal').modal()
}

$("#viz_gradcam_avgbtn").on("click", function() {
    showAvgModal("#viz_gradcam", "grad_cam")
})

$("#viz_guided_gradcam_avgbtn").on("click", function() {
    showAvgModal("#viz_guided_gradcam", "guided_gradcam")
})

$("#viz_occlusion_sensitivity_avgbtn").on("click", function() {
    showAvgModal("#viz_occlusion_sensitivity", "occlusion_sensitivity")
})

$("#viz_vanilla_gradients_avgbtn").on("click", function() {
    showAvgModal("#viz_occlusion_sensitivity", "vanilla_gradients")
})

$("#viz_integrated_gradients_avgbtn").on("click", function() {
    showAvgModal("#viz_integrated_gradients", "integrated_gradients")
})

// $("#viz_smoothgrad_avgbtn").on("click", function() {
//     showAvgModal("#viz_smoothgrad", "smooth_grad")
// })

$("#viz_gradients_input_avgbtn").on("click", function() {
    showAvgModal("#viz_gradients_input", "gradients_inputs")
})