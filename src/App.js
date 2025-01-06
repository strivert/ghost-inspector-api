import React, { useEffect, useState } from "react";
import { getTestSuites, executeTestSuite } from "./ghostInspectorApi";

const App = () => {
  const [apiKey, setApiKey] = useState("");
  const [suites, setSuites] = useState([]);
  const [selectedSuites, setSelectedSuites] = useState([]);
  const [status, setStatus] = useState(null);
  const [executionMode, setExecutionMode] = useState("sequence");

  useEffect(() => {
    if (apiKey) {
      const fetchSuites = async () => {
        const data = await getTestSuites(apiKey);
        setSuites(data);
      };

      fetchSuites();
    }
  }, [apiKey]);

  const handleCheckboxChange = (suiteId) => {
    setSelectedSuites((prevSelectedSuites) => {
      if (prevSelectedSuites.includes(suiteId)) {
        return prevSelectedSuites.filter((id) => id !== suiteId);
      } else {
        return [...prevSelectedSuites, suiteId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedSuites.length === suites.length) {
      setSelectedSuites([]);
    } else {
      setSelectedSuites(suites.map((suite) => suite._id));
    }
  };

  const handleExecuteSelectedSuites = async () => {
    if (selectedSuites.length > 0) {
      let allExecutionsSuccessful = true;

      if (executionMode === "sequence") {
        // Execute in sequence
        for (const suiteId of selectedSuites) {
          const result = await executeTestSuite(suiteId, apiKey);

          console.log("Result:", result);
          if (!result) {
            allExecutionsSuccessful = false;
            console.error(`Failed to execute suite: ${suiteId}`);
          }
        }
      } else {
        // Execute in parallel
        const promises = selectedSuites.map((suiteId) =>
          executeTestSuite(suiteId, apiKey)
        );

        const results = await Promise.all(promises);

        results.forEach((result, index) => {
          if (!result) {
            allExecutionsSuccessful = false;
            console.error(`Failed to execute suite: ${selectedSuites[index]}`);
          }
        });
      }

      setStatus(
        allExecutionsSuccessful
          ? "Selected test suites executed successfully"
          : "Some selected test suites failed"
      );
    } else {
      setStatus("No test suites selected");
    }
  };

  return (
    <div>
      <h1>Ghost Inspector API Test</h1>

      <input
        type="text"
        placeholder="Enter your Ghost Inspector API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />

      <div>
        <h2>Test Suites</h2>
        {suites.length > 0 ? (
          <div>
            <button onClick={handleSelectAll}>
              {selectedSuites.length === suites.length
                ? "Deselect All"
                : "Select All"}
            </button>
            {suites.map((suite) => (
              <div key={suite._id}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedSuites.includes(suite._id)}
                    onChange={() => handleCheckboxChange(suite._id)}
                  />
                  {suite.name}
                </label>
              </div>
            ))}
          </div>
        ) : (
          <p>No test suites available. Please provide a valid API key.</p>
        )}
      </div>

      <div>
        <h3>Execution Mode</h3>
        <label>
          <input
            type="radio"
            name="executionMode"
            value="sequence"
            checked={executionMode === "sequence"}
            onChange={() => setExecutionMode("sequence")}
          />
          Execute in Sequence
        </label>
        <label>
          <input
            type="radio"
            name="executionMode"
            value="parallel"
            checked={executionMode === "parallel"}
            onChange={() => setExecutionMode("parallel")}
          />
          Execute in Parallel
        </label>
      </div>

      {suites.length > 0 && (
        <div>
          <h3>Execute Selected Test Suites</h3>
          <button onClick={handleExecuteSelectedSuites}>
            Execute Selected
          </button>
        </div>
      )}

      {status && <p>{status}</p>}
    </div>
  );
};

export default App;
