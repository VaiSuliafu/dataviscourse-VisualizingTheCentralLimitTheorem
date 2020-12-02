/** Class representing the distribution line plot. */
class LinePlot {

    /**
     * Creates a new LinePlot object
     */
    constructor(alpha, beta) {

        // controls height of svg and resulting line plot
        var margin = {top:20, right: 30, bottom:20, left:30};
        let width = 700 - margin.left - margin.right;
        let height = 350
        this.height = height;

        // create SVG element
        let svg = d3.select("#area_chart")
            .classed("area_chart", true)
            .append("svg")
            .attr("id", "area_svg")
            .attr("width", width)
            .attr("height", height);

        // X scales
        var xScale = d3.scaleLinear()
            .domain([0,1])
            .range([margin.left, width-margin.right]);
        svg.append("g")
            .attr("transform", "translate(0," + String(height-18) + ")")
            .call(d3.axisBottom(xScale))

        // Y scale
        var yScale = d3.scaleLinear()
            .domain([0,3])
            .range([height-margin.bottom, margin.top])

        // line path
        var samplingPath = svg.append("path")
            .attr("id", "pdf")
            .attr("transform", "translate(0, -20)");

        // area path
        var samplingArea = svg.append("path")
            .attr("id", "pdfArea")
            .attr("transform", "translate(0, -20)")

        // line generator function
        this.line = d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return xScale(d[0])})
            .y(function(d) { return yScale(d[1])})

        // area generator  function
        this.area = d3.area()
            .curve(d3.curveBasis)
            .x(function(d) { return xScale(d[0])})
            .y0(height)
            .y1(function(d) { return yScale(d[1])})

        // generate x,y data
        let datum = this.updateData(alpha, beta);

        // update 'd' attribute of path elements
        this.updatePlot(datum);

    }

    /**
     * Updates the data given new parameters for alpha and beta
     */
    updateData(alpha, beta) {

        // get the distribution 
        var datum = d3.range(0, 1.05, 0.05).map(function(x) {
            return [x, Math.min(jStat.beta.pdf(x, alpha, beta), 10)];
        });

        // makes the lines connect
        datum.unshift([0,0]);
        datum.push([1,0]);

        // return results
        return datum;
    }

    /**
     * Updates the sampling distribution
     */
    updatePlot(datum) {

        let that = this;

        // select the path elements
        var samplingPath = d3.select("#pdf")
        var samplingArea = d3.select("#pdfArea")
        
        // update sampling distribution
        samplingPath.datum(datum).attr("d", that.line);
        samplingArea.datum(datum).attr("d", that.area);
    }

    /**
     * Function for sliders to control updates
     */
    sliderUpdate(alpha, beta) {
        this.updatePlot(this.updateData(alpha,beta))
    }

}