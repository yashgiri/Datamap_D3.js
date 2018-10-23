//var country_schoolmap;
var ranking;
var expenditure;
var myMap = new Map();

/*d3.csv("./data/snc.csv", function(data){
	country_schoolmap = data;
});*/
d3.csv("./data/timesData.csv", function(data){
	ranking = data;
	var rank = 1;
	for(row in ranking)
	{
		if(ranking[row].year==2016 && !myMap.has(ranking[row].country))
		{
			myMap.set(ranking[row].country, rank);
			rank = rank + 1;
		}
	}
});

var map = new Datamap({
	element: document.getElementById('map'),
	scope: 'world',
	projection: 'mercator',
	height: 550,
	width: 970,
	fills:
		{
			defaultFill: "black"
		}
});

d3.csv("./data/expenditure.csv", function(data){
	expenditure = data;
	load();
});

function load()
{
	map.svg.selectAll('.datamaps-subunit').style('fill', function(geo)
	{
		for(var row in expenditure)
		{
			if(expenditure[row].country == geo.properties.name && country_rank(geo.properties.name) != undefined)
			{
				return country_color(geo.properties.name);
			}
		}
			
	});
}
function country_rank(name) //max 73 country ranks
{
	return myMap.get(name);
}

function country_color(name)
{
	if(country_rank(name) == undefined)
	{
		return "black";
	}
	var temp = country_rank(name);
	color = d3.scale.linear().domain([1,5])
      .interpolate(d3.interpolateRgb)
      .range([d3.rgb("#2a9606"), d3.rgb("#d0e7c6")]); 

	for(var row in expenditure)
	{
		if(expenditure[row].country == name)
		{
			//return color(temp);
			/*if(temp>=70)
			{
				return color(8);
			}
			if(temp>=60)
			{
				return color(7);
			}*/
			if(temp>=75)
			{
				return color(6);
			}
			if(temp>=60)
			{
				return color(5);
			}
			if(temp>=45)
			{
				return color(4);
			}
			if(temp>=30)
			{
				return color(3);
			}
			if(temp>=15)
			{
				return color(2);
			}
			if(temp>=0)
			{
				return color(1);
			}
		}
	}
	return "black";
}


map.svg.selectAll('.datamaps-subunit')
	.on('mouseover', function(geo)
    	{
    		load();
    		if(country_color(geo.properties.name)=="black")
    		{
    		}
    		else
    		{
    			this.style.fill = "blue";
    		}	
    	})
    .on('mouseout', function()
    	{
    		load();
    		//this.style.fill = country_color(geo.properties.name);
    	})
    .on('click', function(geo)
    	{
    		if(country_color(geo.properties.name)=="black")
    		{

    		}
    		else
    		{
    			this.style.fill = "red";
    		}
    		display_barchart(geo.properties.name);
    	});

//Bar-chart

function display_barchart(name)
{
	document.getElementById('country').innerHTML = "Expenditure on education as % of total GDP by " + name;
	var svg = d3.select("#bar-chart");
	svg.selectAll("*").remove();
	var dataset=[0,0,0,0,0,0];
	for(var row in expenditure)
	{

		if(expenditure[row].country == name)
		{
			dataset[0] = expenditure[row].year_one;
			dataset[1] = expenditure[row].year_two;
			dataset[2] = expenditure[row].year_three;
			dataset[3] = expenditure[row].year_four;
			dataset[4] = expenditure[row].year_five;
			dataset[5] = expenditure[row].year_six;
			break;
		}
	}
	var svgWidth = 465;
	var svgHeight = 400;
	
	var scaley = svgHeight / 10;

	svg.attr("width", svgWidth)
	    .attr("height", svgHeight)
	    .attr("class", "bar-chart");

	var barPadding = 5;
	var barWidth = (svgWidth / dataset.length);
	var barChart = svg.selectAll("rect")
	    .data(dataset)
	    .enter()
	    .append("rect")
	    .attr("y", function(d) {
	        return svgHeight - scaley*(d);
	    })
	    .attr("height", function(d) {
	        return scaley*(d);
	    })
	    .attr("width", barWidth - barPadding)
	    .attr("transform", function (d, i) {
	         var translate = [barWidth * i + 2, 0];
	         return "translate("+ translate +")";
	    });
	var text = svg.selectAll("text")
	    .data(dataset)
	    .enter()
	    .append("text")
	    .text(function(d) {
	    	if(d==0)
	    	{
	    		return "NA";
	    	}
	        return (d)+"%";
	    })
	    .attr("y", function(d, i) {
	        return svgHeight - scaley*(d) - 2;
	    })
	    .attr("x", function(d, i) {
	        return barWidth * i + 2;
	    })
	    .attr("fill", "#A64C38");
	
}

