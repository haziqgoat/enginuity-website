const testCostEstimator = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/cost-estimator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectGoal: "Home renovation",
        projectSize: "Medium (house / office floor)",
        materialsQuality: "Standard",
        estimatedDuration: "1–3 months",
        projectLocation: "Kuala Lumpur",
        additionalNotes: "Looking to renovate kitchen and bathroom"
      }),
    });

    const data = await response.json();
    console.log('Cost Estimator Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error testing cost estimator:', error);
  }
};

testCostEstimator();