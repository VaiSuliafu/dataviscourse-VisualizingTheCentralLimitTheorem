/** Class representing the histogram. */
class HistChart {
    
    /**
     * Creates a new Histchart Object
     */
    constructor() {

        this.data = [];
        this.bins = 20;

        // controls height of svg and resulting line plot
        this.h = 350;
        this.w = 630;
        let topPadding = 20;
    
        // scales
        this.xScale = d3.scaleLinear().domain([0,1]).range([0, this.w]);
        this.yScale = d3.scaleLinear().range([this.h, topPadding])

        // create histogram
        this.histogram = d3.histogram().thresholds(this.xScale.ticks(this.bins));

        // create SVG element
        let svg = d3.select("#histogram")
            .classed("histogram", true)
            .append("svg")
            .attr("id", "histogram_svg")
            .attr("width", this.w)
            .attr("height", this.h);


        // draw the chart
        this.updateChart(this.data);
    }

    /**
     * Updates the chart
     */
    updateChart(data) {
        // TODO
        // Dynamically draws histogram using provided data

        let that = this;

        // Convert to histogram data
        data = this.histogram(data);

        // update scale
        let ymax = d3.max(data.map(function(d) { return d.x1;}));
        that.yScale.domain([0, ymax*that.bins])

        // enter bars
        let bar = d3.select("#histogram_svg").selectAll("g").data(data);
        let barEnter = bar.enter().append("g").attr("class", "bar");

        barEnter.append("rect");
        barEnter.append("text")
            .attr("y", this.h - 15)
            .attr("text-anchor", "middle");

        bar.select("rect")
            .attr("x", function(d) {
                return that.xScale(d.x0) + 1;
            })
            .attr("width", function(d) {
                return that.xScale(d.x0);
            })
            .attr("y", function(d) {
                return that.yScale(d.x1*that.bins)
            })
            .attr("height", function(d) {
                return that.yScale(d.x1*that.bins);
            })
            .attr("fill", "black")
        
        bar.select("text")
            .attr("x", function(d) {
                return that.xScale(d.x0 + 1/(2*that.bins));
            })
            .text(function(d) { 
                return d.x1 > 0 ? d3.format("%")(d.x1) : "";
            }); 

        bar.exit().remove();
        
    }
}