import fetch from "node-fetch";
// Recommend using node-fetch for those familiar with JS fetch

const COLORS = "https://nt-cdn.s3.amazonaws.com/colors.json";

/**
 * @param name filter for color name
 * @param hex filter for color hex code
 * @param compName filter for complementary color name
 * @param compHex filter for complementary color hex code
 * @returns Promise
 */
const fetchColors = ({ name, hex, compName, compHex }) => {
  return fetch(COLORS) //use fetch to retrieve information from url
    .then((response) => {
      if (!response.ok) {
        throw new Error("Could not fetch data"); //make sure fetch executed with ok response
      }
      return response.json();
    })
    .then((data) => {
      return new Promise((resolve) => {
        //run through 4 difference situations depending on the argument to the function
        if (hex !== undefined) {
          const test = data.find((index) => index.hex === hex);
          resolve([{ name: test.name }]);
        } else if (name !== undefined) {
          name = name.toLowerCase();
          const test = data.find((index) => index.name.toLowerCase() === name);
          resolve([{ hex: test.hex }]);
        } else if (compName !== undefined) {
          //capitalize the first letter of every word to match the json object
          compName = compName.split(" ");
          for (let intI = 0; intI < compName.length; intI++) {
            compName[intI] =
              compName[intI][0].toUpperCase() + compName[intI].substr(1);
          }
          compName = compName.join(" ");
          const test = data.filter((index) => deepSearch(index, compName));
          let output = [];
          for (let intI = 0; intI < test.length; intI++) {
            output[intI] = { hex: test[intI].hex };
          }
          resolve(output);
        } else if (compHex !== undefined) {
          const test = data.filter((index) => deepSearch(index, compHex));
          let output = [];
          for (let intI = 0; intI < test.length; intI++) {
            output[intI] = { hex: test[intI].hex };
          }
          resolve(output);
        }
      });
    });

  throw Error("Not implemented");
};

// I got stuck trying to get chained filters to go into the sub-array of the object so used a
// recursive function to traverse for name or hex
function deepSearch(obj, word) {
  if (typeof obj === "string") {
    return obj.includes(word);
  }

  if (typeof obj === "object" && obj !== null) {
    return Object.values(obj).some((value) => deepSearch(value, word));
  }
}

// Leave this here
export default fetchColors;
