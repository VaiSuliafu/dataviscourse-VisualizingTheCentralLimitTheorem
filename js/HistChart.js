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
        let width = 700 - margin.left - margin.right;
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

        let yMax = d3.max(data.map(function(d) { return d.length;}));

        // Y axis: scale and draw
        let yScale = d3.scaleLinear()
            .domain([0, yMax])
            .range([that.height-that.margin.bottom, that.margin.top])
        d3.select("#histogram_svg")
            .append("g")
            .attr("transform", "translate(" + that.margin.left + ",0)")
            // .call(d3.axisLeft(yScale));

        // enter bars
        let barGroup = d3.select("#histogram_svg")
            .selectAll(".bar")
            .data([])
            .join()
            .data(data)
            .join("g")
            .classed("bar", true)
                .append("rect")
                .attr("x", 1)
                .attr("transform", function(d) {
                    return "translate(" + that.xScale(d.x0) + "," + yScale(d.length) + ")";
                })
                .attr("width", function(d) {
                    return that.xScale(d.x1) - that.xScale(d.x0);
                })
                .attr("height", function(d) {
                    return that.height - that.margin.bottom - yScale(d.length);
                })
                    .append("text")
                    .attr("y", function(d) {
                        return yScale(d.length);
                    })
                    .attr("text-anchor", "middle");
        
    }
}