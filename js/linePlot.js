/** Class representing the distribution line plot. */
class LinePlot {

    /**
     * Creates a new LinePlot object
     */
    constructor() {

        // controls height of svg and resulting line plot
        this.h = 350;
        this.w = 630;

        // create SVG element
        let svg = d3.select("#area_chart").append("svg")
            .attr("id", "area_svg")
            .attr("width", this.w)
            .attr("height", this.h);

        this.updatePlot(alpha, beta);
    }

    /**
     * Updates the parameters and redraws the plot
     */
    updatePlot(alpha, beta) {

        this.mean = jStat.beta.mean(alpha, beta);
        this.variance = jStat.beta.variance(alpha, beta)
        this.x_mode = jStat.normal.mode(this.mean, Math.sqrt(this.variance));
        let that = this;
        let datum = d3.range(0, 1.01, .01).map(function(x) {
            return [x, jStat.normal.pdf(x, that.mean, Math.pow(that.variance, 0.5))];
        });

        this.drawPlot(datum)
    }

    /**
     * Draws the line plot
     */
    drawPlot(data) {

        var that = this;

        // define domain and range for x-axis values
        let xMin = d3.min(data, function(d) { return d[0]});
        let xMax = d3.max(data, function(d) { return d[0]});
        let xScale = d3.scaleLinear()
            .domain([xMin, xMax])
            .range([0, this.w]);

        // define domain and range for y-axis values
        let yMin = 0
        let yMax = jStat.normal.pdf(this.x_mode, this.mean, Math.pow(this.variance, 0.5));
        let yScale = d3.scaleLinear()
            .domain([yMin, yMax])
            .range([this.h, 0]);

        // make the line generator function
        var line = d3.line()
            .x(function(d) {
                return .5 * xScale(d[0]);
            })
            .y(function(d) {
                return yScale(d[1]);
            })

        // clear previous path
        d3.select("#path_line").remove();

        // create line
        d3.select("#area_svg").append("path")
            .attr("id", "path_line")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);
        
    }
}