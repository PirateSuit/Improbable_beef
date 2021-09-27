function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {

    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sampleID) {
    console.log(`buildCharts is called with sample ID: ${sampleID}`);
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then( function (data) {
    console.log(data);

    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter (sample => sample.id == sampleID);
    
    console.log(resultArray);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];

    console.log(result);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_value = result.sample_values;
    

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [
      {
          y: yticks,
          x: sample_value.slice(0,10).reverse(),
          text: otu_labels.slice(0,10).reverse(),
          type: "bar",
          orientation: "h"
      }
      
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {title: "Top 10 Bacterial Isolates Found"};

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // DELIVERABLE 2. Creating Bubble Chart.

    // 1. Create the trace for the bubble chart.
    var bubbleData = [
      {
          x: otu_ids,
          y: sample_value,
          text: otu_labels,
          mode: 'markers',
          marker: {
            color: otu_ids,
            size: sample_value,
            colorscale: "Earth",
            type: "heatmap" 
          }
      }
   
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
        title: "Bacterial Isolates Per Sample"
       
    
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
  
  
// DELIVERABLE 3. Creating the Gauge Chart.

    // 3. Create a variable that holds the samples array. 
    var metadata = data.metadata;
    
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var metaResultArray = metadata.filter (metadata => metadata.id == sampleID);
    
    console.log(metaResultArray);
    //  5. Create a variable that holds the first sample in the array.
    var metaResult = metaResultArray[0];

    console.log(metaResult);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var wash_freq = metaResult.wfreq;



    var gaugeData = [

  {
		    domain: { row: 0, column: 0 },
		    value: wash_freq,
		    title: { text: "Belly Button Washing Frequency <br> Scrubs per Week"},
		    type: "indicator",
		    mode: "gauge+number",
        gauge: {
          axis: {range: [0,10], tickwidth: 1},
          bar: {color: "black"},
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange"},
            { range: [4, 6], color: "yellow"},
            { range: [6, 8], color: "yellowgreen"},
            { range: [8, 10], color: "green"}
          ],
        }

	}

];

    var gaugeLayout = { width: 600,
      height: 500,
      margin: { t: 0, b: 0 },
      font: { color: "black"}
    };
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);

  });


}
