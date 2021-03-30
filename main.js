// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 175};

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 575;

//GRAPH 1
let svg = d3.select("#graph1")
    .append("svg")
    .attr("height", MAX_HEIGHT)     
    .attr("width", MAX_WIDTH)     
    .append("g")
    .attr("transform", `translate(${margin.left + 150}, ${margin.top})`);    

d3.csv("./data/video_games.csv").then(function(data) {
    data = return_top(data)

    let x = d3.scaleLinear().range([0, MAX_WIDTH - 600]).domain([0, d3.max(data, function(d) { return d.Global_Sales; })])
    let y = d3.scaleBand().padding(0.3).range([0, MAX_HEIGHT - 100]).domain(data.map(function(d) { return d.Name; }))

    svg.append("g").call(d3.axisLeft(y).tickSize(10).tickPadding(5));

    let bars = svg.selectAll("rect").data(data);

    var popup_tooltip = d3.select("body")
	.append("div")
	.style("position", "absolute")

    let color = d3.scaleOrdinal(["#191945", "#26265e", "#34347d", "#4a4ab3", "#6262fc", "#9394f4", 
    "#a0a1d6", "#bcbccd", "#c9c9d4", "#e8e8ee"])

    bars.enter()
    .append("rect")
    .merge(bars)
    .attr("x", x(0))
    .attr("y", function(d) { return y(d['Name']) } ) 
    .attr("width", function(d) { return x(d['Global_Sales'])})
    .attr("fill", function(d) { return color(d['Name']) })
    .attr("height",  y.bandwidth())        
	.on("mouseover", function(){return popup_tooltip.style("visibility", "visible");})
    .on("mouseout", function(){return popup_tooltip.style("visibility", "hidden");})
    .on("mousemove", function(d){return popup_tooltip.style("left", 50 +  "px").style("top", 200 + "px").html("<br>Total Global Sales: " + d.Global_Sales 
    + "<br> NA Sales: " + d.NA_Sales + "<br>EU Sales: " + d.EU_Sales +  "<br>JP Sales: " + d.JP_Sales +  "<br>Other Sales: " + d.Other_Sales)})

    let counts = svg.append("g").selectAll("text").data(data);

    counts.enter()
        .append("text")
        .merge(counts)
        .attr("x", function(d) { return 20 + x(d['Global_Sales'])})      
        .attr("y", function(d) { return 30 + y(d['Name'])})       
        .style("text-anchor", "start")
        .text(function(d) { return d.Global_Sales});           

    svg.append("text").style("font-size", 15)
        .attr("transform", `translate(${margin.left - 150}, ${margin.top - 45})`)       
        .text("Units Sold (Millions)")

    svg.append("text").style("font-size", 15)
        .attr("transform", `translate(${margin.left - 450}, ${margin.top + 280})`)     
        .text("Video Game")
});

//GRAPH 2
let svg2 = d3.select("#graph2")
.append("svg")
.attr("height", MAX_HEIGHT)     
.attr("width", MAX_WIDTH)     
.append("g")
.attr("transform", `translate(${margin.left + 150}, ${margin.top})`);    

svg2.append("text")
    .attr("transform", `translate(${margin.left - 150}, ${margin.top - 45})`)       
    .text("Number of video games published")
    .style("font-size", 15);

svg2.append("text")
    .attr("transform", `translate(${margin.left - 450}, ${margin.top + 280})`)       
    .style("text-anchor", "right")
    .style("font-size", 15)
    .text("Publisher");

var graph2_title = svg2.append("text")
    .attr("transform", `translate(${margin.left + 250}, ${margin.top - 60})`)       
    .style("text-anchor", "middle")
    .style("font-size", 20)

let y_axis_label = svg2.append("g");


function setData(genre) {

    graph2_title.text("Showing top publishers for: " + genre)

    d3.csv("./data/video_games.csv").then(function(data) {
        
        full_data = top_publisher(data)
        data = full_data.get(genre)

        let x = d3.scaleLinear().range([0, MAX_WIDTH - 700]).domain([0, d3.max(data, function(d) { return d.num_titles; })])
        let y = d3.scaleBand().padding(0.3).domain(data.map(function(d) { return d.publisher_name; })).range([0, MAX_HEIGHT - 100])

        y_axis_label.call(d3.axisLeft(y).tickSize(10).tickPadding(10));

        let bars = svg2.selectAll("rect").data(data);

        let color = d3.scaleOrdinal(["#191945", "#26265e", "#34347d", "#4a4ab3", "#6262fc", "#9394f4", 
        "#a0a1d6", "#bcbccd", "#c9c9d4", "#e8e8ee"])
        bars.enter()
        .append("rect")
        .merge(bars)
        .attr("x", x(0))
        .attr("y", function(d) { return y(d['publisher_name']) } ) 
        .attr("fill", function(d) { return color(d['publisher_name']) })
        .attr("width", function(d) { return x(d['num_titles'])})
        .attr("height",  y.bandwidth());   
    });
}

//Graph 3
width = MAX_WIDTH 
height = MAX_HEIGHT - 200
min_val = Math.min(width, height)

let svg3 = d3.select("#graph3")
.append("svg")
.attr("height", MAX_HEIGHT)     
.attr("width", MAX_WIDTH)     
.append("g")
.attr("transform", `translate(${margin.left - 100}, ${margin.top + 50})`);    

var title = svg3.append("text")
.attr("transform", `translate(${margin.left + 460}, ${margin.top - 100})`)       
.style("font-size", 25)

var genre3 = svg3.append("text")
.attr("transform", `translate(${margin.left - 100}, ${margin.top - 40})`)       
.style("text-anchor", "middle")
.style("font-size", 15)

var genre1 = svg3.append("text")
.attr("transform", `translate(${margin.left - 100}, ${margin.top - 100})`)       
.style("text-anchor", "middle")
.style("font-size", 15)

var genre2 = svg3.append("text")
.attr("transform", `translate(${margin.left - 100}, ${margin.top - 70})`)       
.style("text-anchor", "middle")
.style("font-size", 15)

half_w = width / 2
half_h = height / 2
pie_translate = "translate(" + half_w + "," + half_h + ")"

g = svg3.append("g").attr("transform", pie_translate);

let color = d3.scaleOrdinal(["#1c1b2e", "#191945", "#26265e", "#34347d", "#4a4ab3", "#6262fc", "#9394f4", 
"#a0a1d6","#bcbccd", "#c9c9d4"])

var genre_text = d3.arc()
.outerRadius(min_val / 2 + 20)
.innerRadius(min_val / 2 - 150);

var pie = d3.pie();

function change_region(region) {
    d3.csv("./data/video_games.csv").then(function(data) {
        full_data = top_genres(data)
        data = full_data.get(region)

        sales_arr = new Array ()
        genres_arr = new Array ()

        for (var i = 0; i < 10; i++) {
            sales_arr.push(data[i].total_sales)
            genres_arr.push(data[i].genre_name)
        }

        var all_arc = g.selectAll("arc")
        .data(pie(sales_arr))
        .enter()
        .append("g")

        all_arc.append("path").attr("d", d3.arc().outerRadius(min_val / 2).innerRadius(130)).attr("fill", function(_, index_val) {return color(index_val)})

        all_arc.append("text")
        .attr("transform", function(d) { 
                 return "translate(" + genre_text.centroid(d) + ")"
         })
        .text(function(d) {return genres_arr[d.index]; })
        .style('fill', 'white')

        let region_dict = new Map();

        region_dict.set("NA", "North America")
        region_dict.set("EU", "Europe")
        region_dict.set("JP", "Japan")
        region_dict.set("Other", "Other")
         
        title.text("Top genres for: " + region_dict.get(region))

        genre1.text("1. " + genres_arr[0] + " - " + parseInt(sales_arr[0]) + " million sales (all time)")
        genre2.text("2. " + genres_arr[1] + " - " + parseInt(sales_arr[1]) + " million sales (all time)")
        genre3.text("3. " + genres_arr[2] + " - " + parseInt(sales_arr[2]) + " million sales (all time)")
    })
}

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
setData("Sports")