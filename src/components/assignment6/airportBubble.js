import React from "react";
import { groupByCity } from "./utils";
import { forceSimulation, forceX, forceY, forceCollide, scaleLinear, min, max } from "d3";


function AirportBubble(props){
    const {width, height, countries, routes, selectedAirline} = props;
    console.log(groupByCity(routes));
    if(selectedAirline){
        let selectedRoutes = routes.filter(a => a.AirlineID === selectedAirline);
        
     //TODO: when the selectedAirline is not null,
        //1.Obtain an array of cities from the selectedRoutes by groupByCity   
        let cities = groupByCity(selectedRoutes);

        // 2. Sort the cities ascendingly by d.Count
        //2.Sort the cities ascendingly by the d.Count (i.e., the number of routes from/to the city)
        // This avoids the text on the largest bubbles being covered by small bubbles.
        cities = cities.sort((a, b) => a.Count - b.Count);

        console.log("Cities for the selected airline:", cities); // Debugging log to verify cities

        //Placeholder for further information
        let radius;

        //3.Define a scale for the radius of bubbles. You should use scaleLinear; 
        //  the range is [2, width*0.15], and the domain is the minimum and maximum of the values of Count.  
        // 3. Define a scale for the radius of bubbles using scaleLinear
        const radiusScale = scaleLinear()
            .range([2, width * 0.15]) // Range of the bubble radius
            .domain([min(cities, (d) => d.Count), max(cities, (d) => d.Count)]); // Domain based on Count

        console.log("Radius scale for selected airline:", radiusScale.domain(), radiusScale.range()); // Debugging log
 
        //4.Run the force simulation: You should use the "forceSimulation" of d3 to obtain
        //  the x and y coordinates of the circles. The velocityDecay is set to 0.2; 
        //  you need to add `forceX` (with position `width/2`, and `strength(0.02)`) 
        //  and `forceY` (with position `height/2`, and `strength(0.02)`). 
        //  Also, you need to add `forceCollide` and specify the radius of each circle. 
        //  Please set `.tick(200)`. 

        // 4. Run the force simulation to calculate x and y positions
        const simulation = forceSimulation(cities)
            .velocityDecay(0.2) // Set velocityDecay
            .force("x", forceX(width / 2).strength(0.02)) // Horizontal centering
            .force("y", forceY(height / 2).strength(0.02)) // Vertical centering
            .force("collide", forceCollide((d) => radiusScale(d.Count))) // Collision radius based on Count
            .stop();

        // Run the simulation for 200 ticks to stabilize positions
        for (let i = 0; i < 200; i++) simulation.tick();

        console.log("Cities with positions:", cities); // Debugging log to verify x and y coordinates

        //5.Return the circles: All circles (except the top 5 hubs) 
        //  are filled by `#2a5599`; please set `stroke={"black"}` and `strokeWidth={"2"}`;        
        //6.Since we have sorted the array of cities, the last 5 cities are the top 5 hubs. 
        //  You need to highlight them by filling them with `#ADD8E6` and attach the names 
        //  of the cities to the bubbles. You can use `<text>` tag to add the names. 
        //  Hint: when using .map() the callback function can have two arguments: (d, idx) => {};
        //  the idx is the index of the object d. You can use it to 
        //  Please using the following style setting in the text:
        //  style={{textAnchor:"middle", stroke:"pink", strokeWidth:"0.5em", 
        //     fill:"#992a2a", fontSize:16, fontFamily:"cursive", 
        //     paintOrder:"stroke", strokeLinejoin:"round"}}
        //Note: for each <circle />, please set the key={idx} to avoid the warnings.

        return (
            <g>
                {/* Map through the cities and render circles */}
                {cities.map((d, idx) => {
                    // 6. Since we have sorted the array of cities, the last 5 cities are the top 5 hubs.
                    const isTop5 = idx >= cities.length - 5;

                    return (
                        <g key={idx} transform={`translate(${d.x}, ${d.y})`}>
                            {/* Circle for the city */}
                            <circle
                                r={radiusScale(d.Count)} // Radius based on Count
                                fill={isTop5 ? "#ADD8E6" : "#2a5599"} // Highlight top 5 hubs
                                stroke="black" // Border color
                                strokeWidth="2" // Border thickness
                            />
                            {/* Attach the names of the top 5 cities to the bubbles */}
                            {isTop5 && (
                                <text
                                    style={{
                                        textAnchor: "middle", // Center the text
                                        stroke: "pink", // Stroke color for the text
                                        strokeWidth: "0.5em", // Thickness of the stroke
                                        fill: "#992a2a", // Fill color for the text
                                        fontSize: 16, // Font size
                                        fontFamily: "cursive", // Font family
                                        paintOrder: "stroke", // Ensure stroke is rendered first
                                        strokeLinejoin: "round", // Round joins for stroke
                                    }}
                                >
                                    {d.City}
                                </text>
                            )}
                        </g>
                    );
                })}
            </g>
        );
        
    } else {
        //TODO: when the selectedAirline is null,
        //1.Obtain an array of cities from the routes by groupByCity;
        //2.Plot the bubble chart; highlight the top 5 hub cities worldwide,
        //  using the same settings as the case when the selectedAirline is not null;
        // TODO: when the selectedAirline is null,


        // 1. Obtain an array of cities from the routes by groupByCity;
        let cities = groupByCity(routes);

        // 2. Sort the cities ascendingly by d.Count and define radius
        cities = cities.sort((a, b) => a.Count - b.Count);

        const radiusScale = scaleLinear()
            .range([2, width * 0.15])
            .domain([min(cities, (d) => d.Count), max(cities, (d) => d.Count)]);

        // Run force simulation
        const simulation = forceSimulation(cities)
            .velocityDecay(0.2)
            .force("x", forceX(width / 2).strength(0.02))
            .force("y", forceY(height / 2).strength(0.02))
            .force("collide", forceCollide((d) => radiusScale(d.Count)))
            .stop();

        for (let i = 0; i < 200; i++) simulation.tick();


        return <g>
            {cities.map((d, idx) => {
                    const isTop5 = idx >= cities.length - 5; // Identify top 5 hubs
                    return (
                        <g key={idx} transform={`translate(${d.x}, ${d.y})`}>
                            {/* Circle for the city */}
                            <circle
                                r={radiusScale(d.Count)} // Radius based on Count
                                fill={isTop5 ? "#ADD8E6" : "#2a5599"} // Highlight top 5 hubs
                                stroke="black" // Border color
                                strokeWidth="2" // Border thickness
                            />
                            {/* Attach the names of the top 5 cities to the bubbles */}
                            {isTop5 && (
                                <text
                                    style={{
                                        textAnchor: "middle", // Center the text
                                        stroke: "pink", // Stroke color for the text
                                        strokeWidth: "0.5em", // Thickness of the stroke
                                        fill: "#992a2a", // Fill color for the text
                                        fontSize: 16, // Font size
                                        fontFamily: "cursive", // Font family
                                        paintOrder: "stroke", // Ensure stroke is rendered first
                                        strokeLinejoin: "round", // Round joins for stroke
                                    }}
                                >
                                    {d.City}
                                </text>
                            )}
                        </g>
                    );
                })}
        </g>
    }
}

export { AirportBubble }
