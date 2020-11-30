/** Class representing the histogram. */
class HistChart {
    
    /**
     * Creates a new Histchart Object
     */
    constructor() {

        let data = [];
        let bins = 20;
        this.bins = bins;

        // controls height of svg and resulting line plot
        var margin = {top:20, right: 30, bottom:20, left:30}
        let width = 630 - margin.left - margin.right;
        let height = 350
        this.height = height
        this.margin = margin;

        // create SVG element
        let svg = d3.select("#histogram")
            .classed("histogram", true)
            .append("svg")
            .attr("id", "histogram_svg")
            .attr("width", width)
            .attr("height", height);
    
        // X axis: scale and draw
        let xScale = d3.scaleLinear()
            .domain([0,1])
            .range([margin.left, width-margin.right]);
        svg.append("g")
            .attr("transform", "translate(0"+ "," + String(height-margin.bottom) + ")")
            .call(d3.axisBottom(xScale))
        
        this.xScale = xScale

        this.yScale = d3.scaleLinear()
            .range([this.h, margin.top])

        // create histogram
        this.histogram = d3.histogram()
            .value(function(d) {
                return d;
            })
            .domain(xScale.domain())
            .thresholds(xScale.ticks(bins));

        // draw the chart
        this.updateChart([]);
    }

    /**
     * Updates the chart
     */
    updateChart(data) {

        let that = this;

        // Convert to histogram data
        data = this.histogram(data);

        let yMax = d3.max(data.map(function(d) { return d.x1;}));

        // Y axis: scale and draw
        let yScale = d3.scaleLinear()
            .domain([0, yMax])
            .range([that.height-that.margin.bottom, that.margin.top])
        d3.select("#histogram_svg")
            .append("g")
            .attr("transform", "translate(" + that.margin.left + ",0)")
            .call(d3.axisLeft(yScale));

        // enter bars
        let barGroup = d3.select("#histogram_svg")
            .selectAll(".bar")
            .data([])
            .join()
            .data(data)
            .join("g")
            .classed("bar", true);

        barGroup.append("rect");
        barGroup.append("text")
            // .attr("y", that.h - 15)
            .attr("text-anchor", "middle");


        // barGroup.select("rect")
        //     .attr("x", function(d) {
        //         return that.xScale(d.x0) + 1;
        //     })
        //     .attr("width", function(d) {
        //         return 25;
        //         // return that.xScale(d.x0);
        //     })
        //     .attr("y", function(d) {
        //         return that.yScale(d.x1*that.bins)
        //     })
        //     .attr("height", function(d) {
        //         return 330 - that.yScale(d.x1*that.bins);
        //     })
        //     .attr("fill", "black")
        
        // barGroup.select("text")
        //     .attr("x", function(d) {
        //         return that.xScale(d.x0 + 1/(2*that.bins));
        //     })
        //     .text(function(d) { 
        //         return d.x1 > 0 ? d3.format("%")(d.x1) : "";
        //     }); 
        
    }
}