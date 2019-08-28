let dataJson = [];
let dataset;
let req = new XMLHttpRequest();
req.open("GET", 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json', false);
req.onreadystatechange = () => {
    if (req.readyState == 4 && req.status == 200)
        dataset = JSON.parse(req.responseText);
}
req.send();

let montVariance = Object.values(dataset.monthlyVariance);
let years = [];
let months = [];

//console.log(montVariance) //{year: 1753, month: 1, variance: -1.366} //length: 3153

for (var q in montVariance) {

    years.push(montVariance[q]['year']);
    months.push(montVariance[q]['month']);
}

let montVarianceLength = montVariance.length;
let w = 1200;
let h = 500; //era 500
let padding = 80; //era 50 
let timeFormat = d3.timeFormat("%Y");

const svg = d3.select('body')
    .append('svg')
    .attr('width', w)
    .attr('height', h + 200) // + 200 p ver se consigo encaixar a legenda por baixo das barras...
    .style("margin-left", "250")
    .style("background-color", "white");//lightgreen


const xScale = d3.scaleTime()
    .domain([d3.min(montVariance, (d) => new Date(d.year, 0, 0, 0, 0, 0, 0)), d3.max(montVariance, (d) => new Date(d.year, 0, 0, 0, 0, 0, 0))])
    .range([padding, w - padding]);

const yScale = d3.scaleLinear()
    .domain([d3.max(dataset.monthlyVariance, (d) => d.month - 1), d3.min(dataset.monthlyVariance, (d) => d.month - 1)]) //n fazer - 1 para nao ficar diferente dos valores q estao no dataset (de 1 a 12)
    .range([h - padding - 55, padding]); //era - 60

let baseTemp = 8.66;
let barWidth = (w * padding) / montVarianceLength
d3.select("svg").selectAll("rect")
    .data(dataset.monthlyVariance)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-month", (d) => d.month - 1)
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => d.variance)
    // .attr("stroke", "black", "stroke-width", "0.1", "fill", "none")
    .attr("width", barWidth / 10) // divide por 5 para a ultima barra nao ficar gorda 
    .attr('height', 30)
    .attr('x', (d, i) => xScale(Date.parse(d['year'])))
    .attr('y', (d, i) => yScale(d['month']))
    .attr("fill", function (d, i) {
        
       /* if (d.variance > -6 && d.variance <= -5) {
            return "#e6ffe6";
        }
        if (d.variance > -5 && d.variance <= -4) {
            return "#66ff33";
        }
        if (d.variance > -4 && d.variance <= -3) {
            return "#85e0e0";
        }

        if (d.variance > -3 && d.variance <= -2) {
            return "#ffffb3";
        }
        if (d.variance > -2 && d.variance <= -1) {
            return "#ffff00";
        }
        if (d.variance > -1 && d.variance <= 0) {
            return "#ff751a";
        }
        if (d.variance > 0 && d.variance <= 1) {
            return "#e65c00";
        }

        if (d.variance > 1 && d.variance <= 2) {
            return "#ff4d4d";
        }
        if (d.variance > 2 && d.variance <= 3) {
            return "#ff0000";
        }
        if (d.variance > 3 && d.variance <= 4) {
            return "#b30000";
        }
        if (d.variance > 4 && d.variance <= 5) {
            return "#cc6600";
        }

        if (d.variance > 5 && d.variance <= 6) {
            return "#c4ff4d";
        }

*/

if(d.variance <-6){
    return "#e0ebeb";
}

if (d.variance > -6 && d.variance <= -5) {
    return "#ffffb3";
}
if (d.variance > -5 && d.variance <= -4) {
    return "#e6ffe6";
}
if (d.variance > -4 && d.variance <= -3) {
    return "#85e0e0";
}

if (d.variance > -3 && d.variance <= -2) {
    return "#ffffe6";
}
if (d.variance > -2 && d.variance <= -1) {
    return "#ffff00";
    
}
if (d.variance > -1 && d.variance <= 0) {
    return "#ffb380";
}
if (d.variance > 0 && d.variance <= 1) {
    return "#ff751a";
}

if (d.variance > 1 && d.variance <= 2) {
    return "#e65c00";
}
if (d.variance > 2 && d.variance <= 3) {
    return "#cc6600";
}
if (d.variance > 3 && d.variance <= 4) {
    return "#ff4d4d";
}
if (d.variance > 4 && d.variance <= 5) {
    return "#ff0000";
}

if (d.variance > 5 && d.variance <= 6) {
    return "#b30000";
}

if(d.variance > 6){

    return "#b32400";
}
     

    })
    .on("mouseout", function (d) {
        div.attr('class', 'invisible')
            .attr('data-year', d.year);

    })
    .on("mouseover", function (d) {
        var formMonth = d3.timeFormat("%B");
        var formatName = function (month) {
            return formMonth(new Date(1970, month));
        };
        
        div.attr('class', 'visible')
            .attr('data-year', d.year)
          //  .html("Month: " + (formatName(d.month -1 )) + ", " + "Year: " + d.year + ", " + "Variance: " + d.variance) //(d.variance + baseTemp).toFixed(2)
           
          .html("Month: " + (formatName(d.month -1 )) + ", " + 
          "Year: " + d.year + ", " + 
          "Variance: " + d.variance   +   ", "  +  "Temperature: " + (Math.round((baseTemp +  d.variance) * 10) / 10) ) 
                   
          .style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY + 5) + "px");
    });


const div = d3.select("body").append("div")
    .attr('class', 'invisible')
    .attr("id", "tooltip");


var formatTime = d3.timeFormat("%B");
var formatMonth = function (month) {
    return formatTime(new Date(1970, month));
};

const xAxis = d3.axisBottom(xScale).tickFormat(timeFormat).ticks(26);
const yAxis = d3.axisLeft(yScale).tickFormat(formatMonth);



/////experiencias de eixos


svg.append("g")
    .attr("transform", "translate(0, " + (h - padding) + ")")
    .call(xAxis)
    .attr('id', 'x-axis').attr("color", "black")
    .style("font-size", "14")
// .call(g => g.select(".domain").remove());//p esconder a linha do eixo x

svg.append('g')
    //.attr("transform", "translate(" + padding + ", 45)") //45 para a linha ficar a meio da barra do mes
    .attr("transform", "translate(" + padding + ", 40)") //45 para a linha ficar a meio da barra do mes
    .call(yAxis)
    .attr('id', 'y-axis').attr("color", "black")
    .style("font-size", "14")
    .call(g => g.select(".domain").remove());//p esconder a linha do eixo y



/////experiencias de eixos


//var colorsArray = ["#e6ffe6", "#66ff33", "#85e0e0", "#ffffb3", "#ffff00", "#ff751a", "#e65c00", "#ff4d4d", "#ff0000", "#b30000", "#cc6600", "#c4ff4d"];
 var colorsArray = ["#e0ebeb", "#ffffb3", "#e6ffe6", "#85e0e0", "#ffffe6", "#ffff00", "#ffb380", "#ff751a",  "#e65c00", "#cc6600", "#ff4d4d",  "#ff0000", "#b30000", "#b32400"]

var variations = ['<-6', '>-6 / <=-5', '>-5 / <=-4', '>-4 / <=-3', '>-3 / <=-2 ', '>-2 / <=-1', '>-1 / <=0', '>0 / <=1', '>1 / <=2', '>2 / <=3', '>3 / <=4', '>4 / <=5', '>5 / <=6', ">6"];
var legend = d3.select("svg").append("g")
    .attr("id", "legend")
  //  .attr("transform", "translate(" + (w - 50 * colorsArray.length) + "," + 0 + ")");
  .attr("transform", "translate(" + (w - 85 * colorsArray.length) + "," + 0 + ")");

/*legend.selectAll('rect')
    .data(colorsArray)
    .enter()
    .append("rect")
   //.attr("y", 500)
   .attr("y", function(d, i) {return 500 + i* 25} )
    //.attr("x", function (d, i) { return i * 80; }) //era 30, mas alarguei p tentar escrever la dentro
    .attr("x", 80)
    
    .attr("width", 80)  //era 30, mas alarguei p tentar escrever la dentro
    .attr("height", 20)
    .style("fill", function (d) {
        return d;
    });*/

/*
//legenda horizontaL

legend.selectAll('rect')
    .data(colorsArray)
    .enter()
    .append("rect")
   attr("y", 500)
  .attr("x", function (d, i) { return i * 80; }) //era 30, mas alarguei p tentar escrever la dentro
       .attr("width", 80)  //era 30, mas alarguei p tentar escrever la dentro
    .attr("height", 20)
    .style("fill", function (d) {
        return d;
    });
*/
//legenda vertical

legend.selectAll('rect')
    .data(colorsArray)
    .enter()
    .append("rect")
      .attr("y", function(d, i) {return 490 + i* 15} )
        .attr("x", 80)
        .attr("width", 80)  //era 30, mas alarguei p tentar escrever la dentro
    .attr("height", 20)
    .style("fill", function (d) {
        return d;
    });


/*
//legenda horizontal

legend.selectAll("text")
    .data(variations)
    .enter()
    .append("text")
    .attr("x", (d, i) => i * 80)
    .attr("y", 525)
    .text((d) => d).attr("alignment-baseline", "middle").style("font-family", "Verdana").style("font-size", "10");
*/

//legenda vertical
legend.selectAll("text")
    .data(variations)
    .enter()
    .append("text")
    .attr("x", 80)
    .attr("y", function(d, i) {return 500 + i* 15} )
    .text((d) => d).attr("alignment-baseline", "middle").style("font-family", "Calibri").style("font-size", "10");




svg.append("text")
    .attr("x", '200')
    .attr("y", '555')
    .text("Legend: Variance of temperatures between 1753 and 2015. Base temperature is 8.66℃").style("font-family", "Calibri").style("font-size", "12");


//////////////////////////////

