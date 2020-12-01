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
        let width = 630 - margin.left - margin.right;
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
            .attr("width", width)
            .attr("height", height);

        // dictionary to store results of Chi-squared test
        this.results = {
            testStat:0,
            terms:[]
        };
    }

    /**
     * Updates the display panel with new sample data 
     */
    updatePanel(observations) {
        // console.log(observations)

        // calculate new theoretical normal
        let expectations = this.calcTheoSample(observations);

        // bin the data
        let b_observations = this.histogram(observations)
        let b_expectations = this.histogram(expectations)

        // calculate test statistic
        this.calcChiSquaredTestStat(b_observations, b_expectations);

        // degrees of freedom
        let dof = Math.max(1, observations.length-2)

        // p value
        let probability = 1 - jStat.chisquare.cdf(this.results.testStat, dof)

        // print p value to console
        console.log(probability)

        // TODO 
        // visualize the results with text data

    }

    /**
     * Calculates a sample for the theoretical normal distribution
    */
    calcTheoSample(observations) {
        
        // estimate mean parameter from observations
        let mu = 0;
        for (let o of observations) {
            mu += o;
        }
        mu /= observations.length;

        // estimate the std from observations
        let v = 0;
        for (let o of observations) {
            v += (mu - o)**2;
        }

        // calculate a normal sample with estimated parameters
        var expectations = []
        for (let i = 0; i < observations.length; i++) {
            expectations.push(jStat.normal.sample(mu, v**0.5))
        }

        return expectations;
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
            that.results.terms.push(thisTerm);
            that.results.testStat += thisTerm;
        }

        return;
    }

    /**
     * Calculates one iteration of the Chi-squared test procedure
     */
    calcSingleTerm(observed, expected) {
        if (expected.length == 0) {
            return 0;
        }
        return Math.pow(observed.length - expected.length, 2) / expected.length;
    }

    /**
     * Clears the results from previous iteration of test
     */
    clearResults() {
        this.results.testStat = 0;
        this.results.terms = [];
    }
}