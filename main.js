// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 175};

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 575;

// Your boss wants to know the top 10 video games of all time or top 10 for a specific year 

//GRAPH 1

let svg = d3.select("#graph1")
    .append("svg")
    .attr("height", MAX_HEIGHT)     // HINT: width
    .attr("width", MAX_WIDTH - 400)     // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);    // HINT: transform

    
d3.csv("./data/video_games.csv").then(function(data) {
    //clean data?
    data = return_top(data)

    //x-axis linear scale 
    let x = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return parseInt(d.Global_Sales); })])
    .range([0, MAX_WIDTH - margin.left - margin.right]);
/*
    HINT: The domain and range for the linear scale map the data points
    to appropriate screen space.

    The domain is the interval of the smallest to largest data point
    along the desired dimension. You can use the d3.max(data, function(d) {...})
    function to get the max value in the dataset, where d refers to a single data
    point. You can access the fields in the data point through d.count or,
    equivalently, d["count"].

    The range is the amount of space on the screen where the given element
    should lie. We want the x-axis to appear from the left edge of the svg object
    (location 0) to the right edge (width - margin.left - margin.right).
 */

    //y-axis linear scale
    let y = d3.scaleBand()
        .domain(data.map(function(d) { return d.Name; }))
        .range([0, MAX_HEIGHT - margin.top - margin.bottom])
        .padding(0.1);  // Improves readability

    svg.append("g").call(d3.axisLeft(y).tickSize(0).tickPadding(10));

    let bars = svg.selectAll("rect").data(data);

    var tooltip = d3.select("body")
	.append("div")
	.style("position", "absolute")
	.style("visibility", "hidden")
	.text("test");

    bars.enter()
    .append("rect")
    .merge(bars)
    .attr("x", x(0))
    .attr("y", function(d) { return y(d['Name']) } ) // HINT: Use function(d) { return ...; } to apply styles based on the data point (d)
    .attr("width", function(d) { return x(parseInt(d['Global_Sales']))})
    .attr("height",  y.bandwidth())        // HINT: y.bandwidth() makes a reasonable display height
	.on("mouseover", function(){return tooltip.style("visibility", "visible");})
	.on("mousemove", function(d){return tooltip.style("top", (event.pageY-10)+"px").style("right", 20 +"px").html("<br>Total Global Sales: " + d.Global_Sales 
    + "<br> NA Sales: " + d.NA_Sales + "<br>EU Sales: " + d.EU_Sales +  "<br>JP Sales: " + d.JP_Sales +  "<br>Other Sales: " + d.Other_Sales)})
	.on("mouseout", function(){return tooltip.style("visibility", "hidden");});
/*
    HINT: The x and y scale objects are also functions! Calling the scale as a function can be
    used to convert between one coordinate system to another.

    To get the y starting coordinates of a data point, use the y scale object, passing in a desired
    artist name to get its corresponding coordinate on the y-axis.

    To get the bar width, use the x scale object, passing in a desired artist count to get its corresponding
    coordinate on the x-axis.
 */

    let counts = svg.append("g").selectAll("text").data(data);

    // TODO: Render the text elements on the DOM
    counts.enter()
        .append("text")
        .merge(counts)
        .attr("x", function(d) { return 20 + x(parseInt(d['Global_Sales']))})       // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
        .attr("y", function(d) { return 30 + y(d['Name'])})       // HINT: Add a small offset to the top edge of the bar, found by y(d.artist)
        .style("text-anchor", "start")
        .text(function(d) { return d.Global_Sales});           // HINT: Get the count of the artist


    // TODO: Add x-axis label
    svg.append("text")
        .attr("transform", `translate(${margin.left - 150}, ${margin.top - 45})`)       // HINT: Place this at the bottom middle edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "right")
        .text("Units sold (Millions)");

    // TODO: Add y-axis label
    svg.append("text")
        .attr("transform", `translate(${margin.left - 300}, ${margin.top + 300})`)       // HINT: Place this at the center left edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "right")
        .text("Video Game");

    // TODO: Add chart title
    svg.append("text")
        .attr("transform", `translate(${margin.left + 200}, ${margin.top - 50})`)       // HINT: Place this at the top middle edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .style("font-size", 20)
        .text("Top 10 Most Sold Video Games (All-time)");

});

//GRAPH 2

let svg2 = d3.select("#graph2")
.append("svg")
.attr("height", MAX_HEIGHT)     // HINT: width
.attr("width", MAX_WIDTH - 400)     // HINT: height
.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);    // HINT: transform

// TODO: Add x-axis label
svg2.append("text")
    .attr("transform", `translate(${margin.left - 150}, ${margin.top - 45})`)       // HINT: Place this at the bottom middle edge of the graph - use translate(x, y) that we discussed earlier
    .style("text-anchor", "right")
    .text("Number of video games");

// TODO: Add y-axis label
svg2.append("text")
    .attr("transform", `translate(${margin.left - 300}, ${margin.top + 300})`)       // HINT: Place this at the center left edge of the graph - use translate(x, y) that we discussed earlier
    .style("text-anchor", "right")
    .text("Company");

// TODO: Add chart title
svg2.append("text")
    .attr("transform", `translate(${margin.left + 200}, ${margin.top - 60})`)       // HINT: Place this at the top middle edge of the graph - use translate(x, y) that we discussed earlier
    .style("text-anchor", "middle")
    .style("font-size", 20)
    .text("Top 10 companies with most video game titles for a given genre (^^^click on buttons above to change genre)");

let y_axis_label = svg2.append("g");

function setData(genre) {

    d3.csv("./data/video_games.csv").then(function(data) {
        
        //clean data?
        full_data = top_publisher(data)
        data = full_data.get(genre)

        //x-axis linear scale 
        let x = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return parseInt(d.num_titles); })])
        .range([0, MAX_WIDTH - margin.left - margin.right]);
    /*
        HINT: The domain and range for the linear scale map the data points
        to appropriate screen space.

        The domain is the interval of the smallest to largest data point
        along the desired dimension. You can use the d3.max(data, function(d) {...})
        function to get the max value in the dataset, where d refers to a single data
        point. You can access the fields in the data point through d.count or,
        equivalently, d["count"].

        The range is the amount of space on the screen where the given element
        should lie. We want the x-axis to appear from the left edge of the svg object
        (location 0) to the right edge (width - margin.left - margin.right).
    */

        //y-axis linear scale
        let y = d3.scaleBand()
            .domain(data.map(function(d) { return d.publisher_name; }))
            .range([0, MAX_HEIGHT - margin.top - margin.bottom])
            .padding(0.1);  // Improves readability

        y_axis_label.call(d3.axisLeft(y).tickSize(0).tickPadding(10));


        let bars = svg2.selectAll("rect").data(data);

        var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .text("test");

        bars.enter()
        .append("rect")
        .merge(bars)
        .attr("x", x(0))
        .attr("y", function(d) { return y(d['publisher_name']) } ) // HINT: Use function(d) { return ...; } to apply styles based on the data point (d)
        .attr("width", function(d) { return x(parseInt(d['num_titles']))})
        .attr("height",  y.bandwidth());       // HINT: y.bandwidth() makes a reasonable display height
    /*
        HINT: The x and y scale objects are also functions! Calling the scale as a function can be
        used to convert between one coordinate system to another.

        To get the y starting coordinates of a data point, use the y scale object, passing in a desired
        artist name to get its corresponding coordinate on the y-axis.

        To get the bar width, use the x scale object, passing in a desired artist count to get its corresponding
        coordinate on the x-axis.
    */

        let counts = svg2.append("g").selectAll("text").data(data);

        // TODO: Render the text elements on the DOM
        counts.enter()
            .append("text")
            .merge(counts)
            .attr("x", function(d) { return  x(parseInt(d['num_titles']))})       // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
            .attr("y", function(d) { return  y(d['publisher_name'])})       // HINT: Add a small offset to the top edge of the bar, found by y(d.artist)
            .style("text-anchor", "start")
            .text(function(d) { return d.Global_Sales});           // HINT: Get the count of the artist

    });
}

//Graph 3  Genre sales per region
//reference: https://www.tutorialsteacher.com/d3js/create-pie-chart-using-d3js


width = MAX_WIDTH 
height = MAX_HEIGHT - 200
radius = Math.min(width, height) / 2

let svg3 = d3.select("#graph3")
.append("svg")
.attr("height", MAX_HEIGHT)     // HINT: width
.attr("width", MAX_WIDTH)     // HINT: height
.append("g")
.attr("transform", `translate(${margin.left - 100}, ${margin.top + 50})`);    // HINT: transform


var title = svg3.append("text")
.attr("transform", `translate(${margin.left + 300}, ${margin.top - 100})`)       // HINT: Place this at the top middle edge of the graph - use translate(x, y) that we discussed earlier
.style("text-anchor", "middle")
.style("font-size", 25)

var genre3 = svg3.append("text")
.attr("transform", `translate(${margin.left - 100}, ${margin.top - 40})`)       // HINT: Place this at the top middle edge of the graph - use translate(x, y) that we discussed earlier
.style("text-anchor", "middle")
.style("font-size", 15)
.text("1. Sports")
var genre1 = svg3.append("text")
.attr("transform", `translate(${margin.left - 100}, ${margin.top - 100})`)       // HINT: Place this at the top middle edge of the graph - use translate(x, y) that we discussed earlier
.style("text-anchor", "middle")
.style("font-size", 15)
.text("1. Sports")

var genre2 = svg3.append("text")
.attr("transform", `translate(${margin.left - 100}, ${margin.top - 70})`)       // HINT: Place this at the top middle edge of the graph - use translate(x, y) that we discussed earlier
.style("text-anchor", "middle")
.style("font-size", 15)
.text("1. Sports")

g = svg3.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var color = d3.scaleOrdinal(['#084c61','#db504a','#e3b505','#4f6d7a','#56a3a6']).domain(["Sports", "Platform", "Racing",
"Role-Playing", "Puzzle", "Misc", "Shooter", "Simulation", "Action",
"Fighting", "Adventure", "Strategy"])

var label = d3.arc()
.outerRadius(radius + 20)
.innerRadius(radius - 150);

// Generate the pie
var pie = d3.pie();

// Generate the arcs
var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

// A function that create / update the plot for a given variable:
function change_region(region) {
    d3.csv("./data/video_games.csv").then(function(data) {
        full_data = top_genres(data)
        data = full_data.get(region)
        console.log(data)

        sales_arr = new Array ()
        genres_arr = new Array ()

        for (var i = 0; i < 10; i++) {
            sales_arr.push(data[i].total_sales)
            genres_arr.push(data[i].genre_name)
        }

        //Generate groups
            var arcs = g.selectAll("arc")
            .data(pie(sales_arr))
            .enter()
            .append("g")
            .attr("class", "arc")

        //Draw arc paths
        arcs.append("path")
        .attr("fill", function(d, i) {
        return color(i);
        })
        .attr("d", arc);

        arcs.append("text")
        .attr("transform", function(d) { 
                 return "translate(" + label.centroid(d) + ")"; 
         })
        .text(function(d) {return genres_arr[d.index]; });


        let region_dict = new Map();

        region_dict.set("NA", "North America")
        region_dict.set("EU", "Europe")
        region_dict.set("JP", "Japan")
        region_dict.set("Other", "Other")
         
        title.text("Top genres for: " + region_dict.get(region))

        genre1.text("1. " + genres_arr[0] + " - " + parseInt(sales_arr[0]) + " million sales (all time)")
        genre2.text("2. " + genres_arr[1] + " - " + parseInt(sales_arr[1]) + " million sales (all time)")
        genre3.text("3. " + genres_arr[2] + " - " + parseInt(sales_arr[2]) + " million sales (all time)")

    //   remove the group that is not present anymore
      arcs
        .exit()
        .remove()
    
    })
}

// Your boss wants to understand which genre is most popular. We'd like to see genre sales broken out per region. 
//(This question can be answered by showing the top genre in each region if you want to implement a map, 
// otherwise you should show genre sales broken down by region in bar/scatter/line/pie etc.)

// Lastly, your boss wants to know which publisher to pick based on which genre a game is. 
// Your chart should provide a clear top publisher for each genre (could be interactive or statically show).

function return_top(data) {

    data.sort((item1, item2) => (parseInt(item1.Global_Sales) < parseInt(item2.Global_Sales)) ? 1 : -1)
    data.sort((item1, item2) => (parseInt(item1.Rank) > parseInt(item2.Rank)) ? 1 : -1)
    return data.slice(0, 10)
}

function top_genres(data) {

    let region_dict = new Map();

    var dict1 = new Map()
    var dict2 = new Map()
    var dict3 = new Map()
    var dict4 = new Map()

    region_dict.set("NA", dict1)
    region_dict.set("EU", dict2)
    region_dict.set("JP", dict3)
    region_dict.set("Other", dict4)

    n = data.length
    for (i = 0; i < n; i++) {
        cur_data = data[i]
        cur_genre = cur_data["Genre"]
        na_sales = parseFloat(cur_data["NA_Sales"])
        eu_sales = parseFloat(cur_data["EU_Sales"])
        jp_sales = parseFloat(cur_data["JP_Sales"])
        other_sales = parseFloat(cur_data["Other_Sales"])

        na_dict = region_dict.get("NA")
        if (na_dict.has(cur_genre)) {
            new_count = na_dict.get(cur_genre) + na_sales
            na_dict.set(cur_genre, new_count)
        } else {
            na_dict.set(cur_genre, na_sales)
        }

        eu_dict = region_dict.get("EU")
        if (eu_dict.has(cur_genre)) {
            new_count = eu_dict.get(cur_genre) + eu_sales
            eu_dict.set(cur_genre, new_count)
        } else {
            eu_dict.set(cur_genre, eu_sales)
        }

        jp_dict = region_dict.get("JP")
        if (jp_dict.has(cur_genre)) {
            new_count = jp_dict.get(cur_genre) + jp_sales
            jp_dict.set(cur_genre, new_count)
        } else {
            jp_dict.set(cur_genre, jp_sales)
        }

        other_dict = region_dict.get("Other")
        if (other_dict.has(cur_genre)) {
            new_count = other_dict.get(cur_genre) + other_sales
            other_dict.set(cur_genre, new_count)
        } else {
            other_dict.set(cur_genre, other_sales)
        }

        region_dict.set("NA", na_dict)
        region_dict.set("EU", eu_dict)
        region_dict.set("JP", jp_dict)
        region_dict.set("Other", other_dict)

    }

    let output_dict = new Map()
    
    for (let [region, value] of region_dict) {
        var sales_arr = new Array()
        for (let [genre, total_sales] of value) {
            var dict = {
                "genre_name": genre,
                "total_sales": parseFloat(total_sales)};
            
                sales_arr.push(dict)
        }

        sales_arr.sort((item1, item2) => (parseInt(item1.total_sales) < parseInt(item2.total_sales)) ? 1 : -1)
        sliced_arr = sales_arr.slice(0, 10)
        
        output_dict.set(region, sliced_arr)
    }

    return output_dict
}

function top_publisher(data) {
    //iterate through data 
    top_genres(data)
    let genre_dict = new Map();

    n = data.length
    for (i = 0; i < n; i++) {
        cur_data = data[i]
        genre = cur_data["Genre"]
        publisher = cur_data["Publisher"]

        if (!genre_dict.has(genre)) {
            let cur_genre_dict = new Map();
            genre_dict.set(genre, cur_genre_dict)
        }

        current_dict = genre_dict.get(genre)

        if (current_dict.has(publisher)) {
            publisher_count = current_dict.get(publisher) + 1
            current_dict.set(publisher, publisher_count)
        } else {
            current_dict.set(publisher, 1)
        }

        genre_dict.set(genre, current_dict)

    }
    let output_dict = new Map()
    //dict of all genres where val = {publisher, titles_count}
    // console.log(genre_dict)
    
    for (let [genre, value] of genre_dict) {
        var genre_arr = new Array()
        for (let [publisher, count] of value) {
            publisher_val = publisher
            var dict = {
                "publisher_name": publisher_val,
                "num_titles": count};
            
            genre_arr.push(dict)
        }
        genre_arr.sort((item1, item2) => (parseInt(item1.num_titles) < parseInt(item2.num_titles)) ? 1 : -1)
        sliced_arr = genre_arr.slice(0, 10)
        
        output_dict.set(genre, sliced_arr)
    }

    return output_dict
}

change_region("NA")
setData("Platform")