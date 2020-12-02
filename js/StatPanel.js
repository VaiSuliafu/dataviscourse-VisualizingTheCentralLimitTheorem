/**
 * Class representing the statistics panel
 */
class StatPanel {
    /**
     * Creates a new statistics panel
     */
    constructor(histogram) {

        // controls height of svg and resulting line plot
        var margin = {top:20, right: 30, bottom:20, left:30}
        let width = 700 - margin.left - margin.right;
        let height = 350
        this.height = height
        this.margin = margin;

        // link histogram
        this.histogram = histogram;

        // create SVG element
        let svg = d3.select("#panel")
            .classed("panel", true)
            .append("svg")
            .attr("id", "panel_svg")
            .attr("width", "100%")
            .attr("height", "100%");

        svg.append("text")
            .classed("panel_title", true)
            .attr("x", "0")
            .attr("y", "20")
            .text("# Draws:")

        svg.append("text")
            .classed("panel_title", true)
            .attr("x", "0")
            .attr("y", "80")
            .text("Chi-Squared Test Statistic:")

        svg.append("text")
            .classed("panel_title", true)
            .attr("x", "0")
            .attr("y", "140")
            .text("Degrees of Freedom:")
        

        svg.append("text")
            .classed("panel_title", true)
            .attr("x", "0")
            .attr("y", "200")
            .text("P - Value:")

        // dictionary to store results of Chi-squared test
        this.results = {
            testStat:0,
            terms:[]
        };
    }

    calcZScore(x, mu, sigma) {
        return (x - mu) / Math.max(sigma,0.000000001);
    }

    updateStats(N, mu, sigma) {

        let that = this;

        // cut off vlaues for binning
        let bins = d3.range(0, 1.05, 0.05);

        // empty array to store expected probabilities for each bin
        let e_arr = new Array(22).fill(0);

        // compute expected values
        let z_score = null;
        let z_score2 = null;

        for (let i = 0; i < e_arr.length; i++) {
            if (i == 0) {
                z_score = that.calcZScore(0.0, mu, sigma);
                e_arr[i] = N * jStat.normal.cdf(z_score, 0, 1);
            }
            else if (i == e_arr.length-1) {
                z_score = that.calcZScore(1.0, mu, sigma);
                e_arr[i] = N * (1 - jStat.normal.cdf(z_score, 0, 1));
            }
            else {
                z_score = that.calcZScore(bins[i], mu, sigma);
                z_score2 = that.calcZScore(bins[i-1], mu, sigma);
                e_arr[i] = N * (jStat.normal.cdf(z_score, 0, 1) - jStat.normal.cdf(z_score2, 0, 1));
            }
        }

        // return array of expected values
        return e_arr
    }

    /**
     * Updates the display panel with new sample data 
     */
    updatePanel(observations, mu, sigma) {

        // number of observations
        var N = observations.length;

        // get expected values
        let expectations = this.updateStats(N, mu, sigma);

        // bin the data
        let b_observations = this.histogram(observations)

        // calculate test statistic
        this.calcChiSquaredTestStat(b_observations, expectations);

        // degrees of freedom
        let dof = observations.length - 3;

        // p value
        let probability = 1 - jStat.chisquare.cdf(this.results.testStat, dof);

        // svg
        let panelSvg = d3.select("#panel_svg")
        
        // remove prior text
        panelSvg
            .selectAll(".panel_text_black")
            .remove();
        panelSvg
            .selectAll(".panel_text_red")
            .remove();

        // draws text
        panelSvg
            .append("text")
            .classed("panel_text_black", true)
            .attr("x", "90")
            .attr("y", "20")
            .text(N)

        panelSvg
            .append("text")
            .classed("panel_text_black", true)
            .attr("x", "260")
            .attr("y", "80")
            .text(this.results.testStat)

        panelSvg
            .append("text")
            .classed("panel_text_black", true)
            .attr("x", "205")
            .attr("y", "140")
            .text(dof)
        
        
        // p value text
        panelSvg
            .append("text")
            .attr("class", function() {
                if (probability < 0.05) {
                    return "panel_text_red";
                } else {
                    return "panel_text_black";
                }
            })
            .attr("x", "100")
            .attr("y", "200")
            .text(probability)
    }

    /**
     * Calculates the Chi-squared test statistic
     * @param {*} observations 
     * @param {*} expectations 
     */
    calcChiSquaredTestStat(observations, expectations) {

        let that = this;

        // Clear prior results
        this.clearResults();

        // Iterate the chi-squared procedure for each term
        for (let i = 0; i < observations.length; i++) {
            let thisTerm = this.calcSingleTerm(observations[i], expectations[i]);
            // that.results.terms.push(thisTerm);
            that.results.testStat += thisTerm;
        }

        return;
    }

    /**
     * Calculates one iteration of the Chi-squared test procedure
     */
    calcSingleTerm(observed, expected) {
        if (expected == 0) {
            return 0;
        }
        // console.log(observed)
        console.log("Difference: " + Math.abs(observed.length - expected))
        // console.log("Observed Count: " + observed.length)
        // console.log("Expected Count: " + expected)
        let x = Math.pow(observed.length - expected, 2) / expected;
        return x;
    }

    /**
     * Clears the results from previous iteration of test
     */
    clearResults() {
        this.results.testStat = 0;
        this.results.terms = [];
    }
}