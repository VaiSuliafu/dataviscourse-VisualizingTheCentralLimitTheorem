/**
 * Class representing Empirical Cumulative Distribution Function
 */
class EcdfChart {
    /**
     * Creates a new ECDF Function
     */
     constructor() {
       // controls height of svg and resulting line plot
       var margin = {top:20, right: 30, bottom:20, left:30};
       let width = 700 - margin.left - margin.right;
       let height = 350
       this.height = height;
       var that = this;
  
       // create SVG element
       let svg = d3.select("#ecdf_plot")
           .classed("ecdf_plot", true)
           .append("svg")
           .attr("id", "ecdf_svg")
           .attr("width", width)
           .attr("height", height);
  
       // X scales
       var xScale = d3.scaleLinear()
           .domain([0,1])
           .range([margin.left, width-margin.right]);
       svg.append("g")
           .attr("transform", "translate(0," + String(height-18) + ")")
           .call(d3.axisBottom(xScale));
  
       // Y scale
       var yScale = d3.scaleLinear()
           .domain([0,1])
           .range([height-margin.bottom, margin.top]);
       svg.append("g")
          .attr("transform", "translate(0," + String(width) + ")")
          .call(d3.axisLeft(yScale));

        // line paths
        var samplePath = svg.append("path")
            .attr("class", "sample_path")
            .attr("transform", "translate(0, -20)");

        var theoPath = svg.append("path")
            .attr("class", "theo_path")
            .attr("transform", "translate(0, -20)");

        // line generating functions
        this.sample_line = d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return xScale(d[0])})
            .y(function(d) { return yScale(d[1])})

        this.theo_line = d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return xScale(d[0])})
            .y(function(d) { return yScale(d[1])})

        // legend text
    svg.append("text")
        .classed("draw_label", true)
        .attr("x", 0)
        .attr("y", 30)
        .style("font-size", 40)
        .style("fill", "light-gray")
        .text("N = " + 0)

        svg.append("text")
            .attr("x", width - 100)
            .attr("y", height - 60)
            .style("fill", "Black")
            .text("Theoretical")
            .style("font-size", "20")
            .style("font-weight", "bold")

        svg.append("text")
            .attr("x", width - 100)
            .attr("y", height - 40)
            .style("fill", "Firebrick")
            .text("Observed")
            .style("font-size", 20)
            .style("font-weight", "bold")

  
     }
  
     updatePlot(observed, expectations) {

       let svg = d3.select("#ecdf_svg");

       svg.select(".draw_label").remove();

       svg.append("text")
          .classed("draw_label", true)
          .attr("x", 0)
          .attr("y", 30)
          .style("font-size", 40)
          .style("fill", "light-gray")
          .text("N = " + observed.length)


       let that = this;

       // format the data
       let data = this.updateData(observed, expectations);

       // select the path elements
       var samplePath = d3.select(".sample_path")
       var theoPath = d3.select(".theo_path")

       // update the datum objects for each path
       samplePath.datum(data[0]).attr("d", that.sample_line)
       theoPath.datum(data[1]).attr("d", that.theo_line);
  
     }

     /**
      * Formats the data for the ECDF plot
      */
     updateData(observed, expectations) {
         
        // observed x values
        let x_observed = observed.sort();
 
        // normalized y values
        let sample = d3.range(1, x_observed.length+1, 1).map(function(i) {
            return [x_observed[i-1], i / x_observed.length];
        });
 
        // theoretical x values
        let x_theo = expectations.sort();
 
        // normalized theoretical y values
        let theo = d3.range(1, x_theo.length+1, 1).map(function(i) {
            return [x_theo[i-1], i / x_theo.length];
        });
 
        // return results
        return [sample, theo];
      }
  
  }