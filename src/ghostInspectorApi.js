import axios from 'axios';


// Function to get the list of test suites
export const getTestSuites = async (apiKey) => {
  try {
    console.log('apiKey : ', apiKey)
    const response = await axios.get(`/v1/suites/?apiKey=${apiKey}`, {
      headers: {
      }
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching test suites:", error);
    return [];
  }
};

// Function to execute a test suite
export const executeTestSuite = async (suiteId, apiKey) => {
  try {
    console.log('suiteId : ', suiteId)
    const response = await axios.post(`/v1/suites/${suiteId}/execute?apiKey=${apiKey}`, {
        headers: {
        }
    });

    console.log('response : ', response)
    return response.data;
  } catch (error) {
    console.error("Error executing test suite:", error);
    return null;
  }
};
