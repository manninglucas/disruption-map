// Authors: Lucas Manning and Olivia Zhang
// Please use semi colons at the line ends

// Types =====================================================


var mapTypes =  {
  DISRUPTION : "Disruption",
  OPPORTUNITY : "Opportunity",
  COMBINED : "Combined"
};

var disruption = d3.map();
var opportunity = d3.map();
// Default Setting 
//var curmap = disruption;
var curmap = opportunity;
var path = d3.geoPath();
var opp_toggle = true;


// globals==================================================

var path = d3.geoPath();
var disruption = d3.map();
var opportunity = d3.map();
var combined = d3.map();
var currentMap = mapTypes.DISRUPTION;

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Map Components ========================================================

var div = d3.select("body").append("div")   
    .attr("class", "tip")               
    .style("visibility", "hidden");

// Helpers======================================================

function toggleMap() {
  var label = d3.select("h1");
  var buttonlabel = d3.select("#toggle");
  if (currentMap == mapTypes.OPPORTUNITY) {
    label.text("Disruption");
    buttonlabel.text("Show Combined Map");
    currentMap = mapTypes.DISRUPTION;
  } 
  else if (currentMap == mapTypes.DISRUPTION) {
    label.text("Combined");
    buttonlabel.text("Show Opportunity Map");
    currentMap = mapTypes.COMBINED;
  } 
  else if (currentMap == mapTypes.COMBINED) {
    label.text("Opportunity");
    buttonlabel.text("Show Disruption Map");
    currentMap = mapTypes.OPPORTUNITY;
  }
  changeMap(currentMap);
}

function getValueAtMSA(msaCode) {
  switch (currentMap) {
    case mapTypes.OPPORTUNITY:
      return opportunity.get(parseInt(msaCode));
      break;
    case mapTypes.DISRUPTION:
      return disruption.get(parseInt(msaCode));
      break;
    case mapTypes.COMBINED:
      return combined.get(parseInt(msaCode));
      break;
    default:
      break;
  }
}


// Fills the msa with msaCode with a color based on the map
function fillColor(msaCode, map) {
  if (opportunity.get(parseInt(msaCode)) == undefined)
     return d3.color("#aaaaaa");

  if (map == mapTypes.OPPORTUNITY) {
    var x = d3.scaleLinear().domain([8.5, 17.5]).range([0, 1])
    var color = d3.scaleSequential(d3.interpolatePiYG);
    return d3.interpolateYlGn(((x(opportunity.get(parseInt(msaCode)))))); 
  } 
  else if (map == mapTypes.DISRUPTION) {
    var x = d3.scaleLinear().domain([0, 3.5]).range([0, 1])
    var color = d3.scaleSequential(d3.interpolatePiYG);
    return d3.interpolateOrRd((x(disruption.get(parseInt(msaCode))))); 
  } 
  else if (map == mapTypes.COMBINED) {
    var x = d3.scaleLinear().domain([5.5, 17]).range([0, 1])
    var color = d3.scaleSequential(d3.interpolatePiYG);
    return d3.interpolateBlues((x(combined.get(parseInt(msaCode))))); 
  }

// ! Note: filepath changed because of how github packaged repo
// have an extra /disruption-map/ . . . in there
// .defer(d3.json, "../data/us_msa.json")
d3.queue()
    .defer(d3.json, "https://d3js.org/us-10m.v1.json")
    .defer(d3.json, "data/us_msa.json")
  
    .defer(d3.csv, "data/opportunity.csv", 
        function (d) { opportunity.set(d.area, d.opportunity);})
    .defer(d3.csv, "data/disruption.csv", 
        function (d) { disruption.set(d.area, d.disruption);})
    .await(ready);






}

// switches the current map displayed to the one provided
function changeMap (map) {
  var g = svg.select(".msa");
  g.selectAll("path").attr("fill",
    function() {
      return fillColor(this.id, map)
    }
  )
}

// creates a map of MSA shapes in the US
function createBoundaries(us, msa) {

function fillColor(msaCode, msamap, scale) {
  if (msamap.get(parseInt(msaCode)) == undefined)
     return d3.color("gray");
  if (curmap == opportunity)
     return d3.interpolateYlGn(((msamap.get(parseInt(msaCode))-8) / scale)); 
  else 
     return d3.interpolateOrRd(((msamap.get(parseInt(msaCode))/2))); 
}
// ------------------------------------------------------------------
// Change filepaths so they're all relative 
// 

//  - Add more columns to the data file so that you can view more relevant data 
//  - Finish toggle function, so that given the map name it loads the data 
//  - Want to change the actual data bound not only the fillcolor function
//  - Find pretty pop up toggle thingies 
// ------------------------------------------------------------------
// @todo make tsv with each county and disruption index
// # Q: Where does it pass the args us, msa to ready? 
function ready(error, us, msa) {

  if (error) throw error;

  msaMap = d3.map(msa);
  var g = svg.append("g").attr("class", "msa")
  
  msaMap.each(function(countyIds, msaCode, map) {
   // console.log(msaCode)
    var selected = d3.set(countyIds);

    g.append("path")
      .datum(topojson.merge(
        us, us.objects.counties.geometries.filter(
          function(d) { return selected.has(d.id); })))
      .attr("id", msaCode)
      .attr("class", "msa-boundary")
      .attr("d", path)
      .on("mouseover", function(d) {
        div.html("<strong>"+currentMap+"</strong>"+"<br/>"+getValueAtMSA(msaCode))
           .style("left", (d3.event.pageX+20) + "px")     
           .style("top", (d3.event.pageY - 28) + "px")
           .style("visibility", "visible");
      })
      .on("mouseout", function(d) {
        div.style("visibility", "hidden")
      })
  });
}

// Main =================================================================

    if (curmap.get(parseInt(msaCode)) == undefined)
      console.log("no data");

    g.append("path")
        .datum(topojson.merge(
          us, us.objects.counties.geometries.filter(
              function(d) { return selected.has(d.id); })))
        .attr("id", msaCode)
        .attr("class", "msa-boundary")
        .attr("fill", fillColor(msaCode, curmap, 7))
        .attr("d", path)
        .on("click", function(d) {
            d3.select("#info").text(curmap.get(parseInt(msaCode)));
        });

  colorpaths = d3.selectAll("path")
}

  function changeView () {
    //console.log(colorpaths)
      curmap = disruption;
      // colorpaths.each(function(countyIds, msaCode, map){
      //       console.log(countyIds)
      //       region = d3.select(this).append("path").attr("fill", "rbg (10, 119, 62")
      //     // console.log("Hello + " + fillColor(this.id, curmap, 7))
       
            
      //       //this.setAttribute("fill","rbg (10, 119, 62)" )
      //       //console.log("done")

      // });
    //   msaMap.each(function(countyIds, msaCode, map) {
 
    //     var selected = d3.set(countyIds);
    //     if (curmap.get(parseInt(msaCode)) == undefined)
    //     console.log("no data");
    //      colorpaths.exit();
    //     // colorpaths = g.append("path")
    //     colorpaths.append("path")
    //      .on("click", function(d) {
    //         // d3.select("#info").text(curmap.get(parseInt(msaCode)));
    //         alert("pece")
    //       })
    //      .datum(topojson.merge(
    //      us_copy, us_copy.objects.counties.geometries.filter(
    //            function(d) { return selected.has(d.id); })))
    //     .attr("id", msaCode)
    //     .attr("class", "msa-boundary")
    //     .attr("fill", fillColor(msaCode, curmap, 7))
    //     .attr("d", path)
       
    // });

      // colorpaths.append("path")
      // .datum(data)
      // .attr("d", line);
      // // path.exit().remove()

      // ready()
    

  }
// Group for the toggle button
var but_group = svg.append("g").attr("class", "toggle_button")
    .on('click', function() {
          opp_toggle = !opp_toggle
          if (curmap == opportunity) {
            alert('View Changed to Opportunity Map')
            curmap = opportunity
          }
          else {
            alert('View Changed to Disruption Map')
            curmap = disruption
          }
          //colorpaths.attr("fill", fillColor(msaCode, curmap, 7))
          changeView()
})
var button = but_group.append("rect")
    .attr("class", "button").attr("width", 120).attr("height", 30)
    .attr('x', 420) .attr('y', 10).attr("fill", '#87AFC7')
   
var label = but_group.append("text")
    .text("Toggle View").attr("width", 120).attr("height", 30)
    .attr('x', 440).attr('y', 30).style("fill", "#FFFFFF")
    


   //---------------------------
   // Append Groups for counties
   //---------------------------
   // svg.append("g")
   //    .attr("class", "states")
   //  .selectAll("path")
   //  .data(topojson.feature(us, us.objects.states).features)
   //  .enter().append("path")
   //   // .attr("fill", function(d) { return color(d.rate = unemployment.get(d.id)); })
   //    .attr("d", path)
   //---------------------------
   // Append Groups for counties
   //---------------------------
   // svg.append("g")
   //    .attr("class", "counties")
   //    .selectAll("path")
   //    .data(topojson.feature(us, us.objects.counties).features)
   //    .enter().append("path")
   //    .attr("d", path)
    
    

 



// loads data. Only do this once because it is slow.
d3.queue()
  .defer(d3.json, "https://d3js.org/us-10m.v1.json")
  .defer(d3.json, "../data/us_msa.json")
  .defer(d3.csv, "../data/opportunity.csv", 
      function (d) { opportunity.set(d.area, d.opportunity);})
  .defer(d3.csv, "../data/disruption.csv", 
      function (d) { disruption.set(d.area, d.disruption);})
  .defer(d3.csv, "../data/combined.csv",
      function (d) { combined.set(d.area, d.combined);})
  .await(function(error, us, msa) {
    if (error) throw error;
    createBoundaries(us, msa);
    changeMap(currentMap);
  });
