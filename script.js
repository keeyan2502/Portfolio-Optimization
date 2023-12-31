function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}
function getdata(arr, sdate, ramp, vamp, samp, constraint) {
    console.log({'arr':arr, 'sdate': sdate, 'v-amp': vamp, 's-amp': samp, 'r-amp': ramp, 'constraint': constraint, 'getdata': 1});
    $.ajax({
        type:"GET",
        dataType: "json",
        data:{'arr':arr, 'sdate': sdate, 'v-amp': vamp, 's-amp': samp, 'r-amp': ramp, 'constraint': constraint, 'getdata': 1},
        url: "https://trezlorapi.azurewebsites.net/improved",
        success: function(data){
            document.querySelector('.inputfield').style.display = 'none';
            document.querySelector('#everything').style.opacity = '1'
            document.querySelector('.loader').style.display = 'none'
            document.querySelector('#result').style.display = 'block'
            console.log(data);
            var big = document.querySelector('#resulttable');
            big.innerHTML = '';
            var table = document.createElement('table')
            table.className = 'porttable'
            var firstrow = document.createElement('tr')
            firstrow.className = 'headerrow'
            for (i=0; i < data.length; i++) {
                var td = document.createElement('td')
                if (i==0) {
                    td.innerHTML = ''
                    td.className = 'empty'
                }
                else {
                    td.innerHTML = data[i]['name']
                }
                firstrow.append(td);
            }
            table.append(firstrow)
            var properties = ['return', 'sr', 'vol']
            for (i=0; i < properties.length; i++) {
                var nextrow = document.createElement('tr')
                nextrow.className = 'propertiesrow'
                for (j=0; j < data.length; j++) {
                    var td = document.createElement('td')
                    if (j==0) {
                        if (properties[i] == 'sr') {
                            td.innerHTML = 'sharpe ratio'
                        }
                        if (properties[i] == 'return') {
                            td.innerHTML = properties[i]
                        }                                
                        if (properties[i] == 'vol') {
                            td.innerHTML = 'volatility'
                        }
                    }
                    else {
                        if (properties[i] == 'sr') {
                            td.innerHTML = data[j][properties[i]].toFixed(2)
                        }
                        if (properties[i] == 'return') {
                            td.innerHTML = ((data[j][properties[i]] * 100).toFixed(2)).toString() + '%'
                        }                                
                        if (properties[i] == 'vol') {
                            td.innerHTML = ((data[j][properties[i]] * 100).toFixed(2)).toString() + '%'
                        }
                    }
                    nextrow.append(td);
                }
                table.append(nextrow)
            }
            var codes = []
            for (j=0; j < data[0]['portfolio'].length; j++) {
                codes.push(data[0]['portfolio'][j]['amfi'])
            }
            for (i=0; i < codes.length; i++) {
                var nextrow = document.createElement('tr')
                for (j=0; j < data.length; j++) {
                    var td = document.createElement('td')
                    if (j==0) {
                        td.innerHTML = codes[i]
                    }
                    else {
                        portfolio = data[j]['portfolio']
                        for (k=0; k < portfolio.length; k++) {
                            if (portfolio[k]['amfi'] == codes[i]) {
                                td.innerHTML = ((portfolio[k]['weight'] * 100).toFixed(2)).toString() + '%'
                            }
                        }
                    }
                    nextrow.append(td);
                }
                table.append(nextrow)
            }
            console.log(table)
            big.append(table)
            var button = document.createElement('div');
            button.innerHTML = `                <div class='opt btn btn-border-3 goback'>
                Go Back to Create Another Portfolio
            </div>`
            big.append(button);
            document.querySelector('.goback').onclick = function() {
                document.querySelector('.inputfield').style.display = 'block';
                document.querySelector('#result').style.display = 'none'
                document.querySelector('.theirportfolio').innerHTML = '';
            }
        },
        error: function(error) {
            return error;
        }
    })
}
function getdata2() {
    $.ajax({
        type:"GET",
        dataType: "json",
        url: "https://trezlorapi.azurewebsites.net/codescraper1",
        success: function(data){
            startpage();
            fillinautocomplete(data);
        },
        error: function(error) {
            return 0;
        }
    })
}

function fillinautocomplete(data) {
    console.log(data);
    var searchoptions = []
    for (i=0; i < data.length; i++) {
        searchoptions.push({
            "value": data[i]['amficode'],
            "label": data[i]['fund'],
            "type": 'Fund'
        })
    }
    $( "#asset" ).autocomplete({
        minLength:3,   
        delay:100,   
        source: function(request, response) {
            var results = $.ui.autocomplete.filter(searchoptions, request.term);
    
            response(results.slice(0, 10));
        },
        select: function (event, ui) {        
            var input = document.querySelector('#asset');
            input.value = ui.item.label
            input.dataset.code = ui.item.value
            input.dataset.type = ui.item.type
            return false;
        }
    });
}

function startpage() {
    document.querySelector('#everything').style.opacity = '1'
    document.querySelector('.loader').style.display = 'none'
}
document.addEventListener('DOMContentLoaded', function () {

    getdata2();


    document.querySelectorAll('.btn1').forEach((e) => e.addEventListener("click", function() {
        var isiton = e.dataset.on
        if (isiton == 'True') {
            e.style.backgroundColor = 'white'
            e.style.color = '#999'
            e.dataset.on = 'False'
        }
        else { //if we are turning it on
            var btns = document.querySelectorAll('.btn1')
            for (i=0; i < btns.length; i++) { //
                if (btns[i].dataset.on == 'True') {
                    btns[i].style.backgroundColor = 'white'
                    btns[i].style.color = '#999'
                    btns[i].dataset.on = 'False'
                }
            }
            e.style.backgroundColor = '#999'
            e.style.color = 'white'
            e.dataset.on = 'True'
        }
    }));

    var arr = []

    function addasset(code, type, name) {
        var div = document.createElement('div')
        div.innerHTML = `
            <div class='typecontainer ${type}'>${type}</div>
            <div class='namecontainer'>
                ${name}
            </div>
            <div class='codecontainer'>
                ${code}
            </div>
            <div class='remove remove${code}' data-code=${code}>               X</div>
        `
        div.className = 'assetrow'
        document.querySelector('.theirportfolio').append(div)
        if (type == 'Stock') {
            arr.push(['S', code, 0.1])
        }
        else {
            arr.push(['F', code, 0.1])
        }
        console.log(arr)
        document.querySelector('#asset').value = '';
        document.querySelector(`.remove${code}`).onclick = function() {
            var parent = document.querySelector(`.remove${code}`).parentElement
            parent.remove();
            for (i=0; i < arr.length; i++) {
                if (arr[i][1] == code) {
                    arr.splice(i,1)
                }
            }
        }
    }
    document.querySelector('.submit').addEventListener('click', function() {
        if (document.querySelector('#asset').value.trim() == '') {
            alert('Input Something')
        } 
        else {
            var input = document.querySelector('#asset')
            addasset(input.dataset.code, input.dataset.type, input.value)
        }
    })

    document.querySelector('.bigsubmit').onclick = function() {
        document.querySelector('#popupbox').style.display = 'block';
        document.querySelector('#everything').style.opacity = '0'
    }

    document.querySelector('.bigsubmitfinal').onclick = function() {

        var sdate = document.querySelector('#sdate').value;
        var ramp = document.querySelector('#ramp').value;
        var vamp = document.querySelector('#vamp').value;
        var samp = document.querySelector('#samp').value;
        var constraint = 2
        document.querySelector('#popupbox').style.display = 'none';
        document.querySelector('#everything').style.opacity = '0';
        document.querySelector('.loader').style.display = 'grid';

        getdata(JSON.stringify(arr), sdate, parseInt(ramp), parseInt(vamp), parseInt(samp), parseInt(constraint));

        return false;
    }    

    document.querySelector('.auto').onclick = function() {
        document.querySelector('#sdate').value = '31-Mar-2018';
        document.querySelector('#ramp').value = '1';
        document.querySelector('#vamp').value = '1';
        document.querySelector('#samp').value = '1';
    }


    document.querySelector('.randomise').onclick = function() {
        document.querySelector('.theirportfolio').innerHTML = `<div class="assetrow">
            <div class="typecontainer Fund">Fund</div>
            <div class="namecontainer">
                Mirae Asset Banking and PSU Debt Fund Direct IDCW
            </div>
            <div class="codecontainer">
            147748
            </div>
        </div><div class="assetrow">
            <div class="typecontainer Fund">Fund</div>
            <div class="namecontainer">
                Aditya Birla Sun Life Banking &amp; PSU Debt Fund  - DIRECT - MONTHLY IDCW
            </div>
            <div class="codecontainer">
            148504
            </div>
        </div><div class="assetrow">
            <div class="typecontainer Fund">Fund</div>
            <div class="namecontainer">
                ICICI Prudential Banking and PSU Debt Fund - Direct Plan -  Quarterly IDCW
            </div>
            <div class="codecontainer">
            150441
            </div>
        </div><div class="assetrow">
            <div class="typecontainer Fund">Fund</div>
            <div class="namecontainer">
                HDFC FMP 1861D March 2022-Sr.46 (G)
            </div>
            <div class="codecontainer">
            149922
            </div>
        </div><div class="assetrow">
            <div class="typecontainer Fund">Fund</div>
            <div class="namecontainer">
                ICICI Pru FMP - Sr.88-1226Days Plan F-Reg (IDCW-Q)
            </div>
            <div class="codecontainer">
            150951
            </div>
        </div>`
        arr = [["F","101635",0.2],["F","102000",0.2],["F","150441",0.2],["F","149922",0.2],["F","150951",0.2]];
    }
})