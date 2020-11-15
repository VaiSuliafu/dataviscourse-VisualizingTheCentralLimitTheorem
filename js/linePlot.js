/** Class representing the distribution line plot. */
class LinePlot {

    /**
     * Creates a new LinePlot object
     */
    constructor(alpha, beta) {

        // controls height of svg and resulting line plot
        this.h = 350;
        this.w = 630;
        let topPadding = 20;
        var y1 = this.h 
        var y2 = this.h

        // create SVG element
        let svg = d3.select("#area_chart")
            .classed("area_chart", true)
            .append("svg")
            .attr("id", "area_svg")
            .attr("width", this.w)
            .attr("height", this.h);

        // scales
        var xScale = d3.scaleLinear().domain([0,1]).range([0, this.w]);
        var yScale = d3.scaleLinear().domain([0,3]).range([y2, topPadding])

        console.log('ok')

        // clip path
        var clip = svg.append("clipPath")
            .attr("id", "view_clt")
            .append("rect")
            .attr("x", 0)
            .attr("y")

        // draws axis
        function drawBar(selection, dy, label) {
            var axis = selection.append("g").attr("class", "axis");
            axis.append("line")
                .attr("x1", xScale(0))
                .attr("x2", xScale(1))
                .attr("y1", dy)
                .attr("y2", dy);
            axis.append("text")
                .attr("x", xScale(0))
                .attr("y", dy)
                .attr("dy", "1em")
                .text(label)
        };

        // axis bar
        svg.call(drawBar, y1, "Theoretical")

        // path and area elements
        var samplingPath = svg.append("path").attr("id", "pdf");
        var samplingArea = svg.append("path").attr("id", "pdfArea")

        // line generator function
        this.line = d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return xScale(d[0])})
            .y(function(d) { return yScale(d[1])})

        // area generator  function
        this.area = d3.area()
            .curve(d3.curveBasis)
            .x(function(d) { return xScale(d[0])})
            .y0(y1)
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
        var datum = d3.range(0, 1.05, 0.05).map(function(x) {
            return [x, Math.min(jStat.beta.pdf(x, alpha, beta), 10)];
        })
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