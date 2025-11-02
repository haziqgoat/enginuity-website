// Test script for cost estimator API
async function testCostEstimator() {
  try {
    const response = await fetch('http://localhost:3000/api/cost-estimator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectType: 'Structural Design',
        projectScale: 'Medium',
        materialsNeeded: 'Concrete, Steel, Glass',
        projectDuration: '6 months',
        projectLocation: 'Kuala Lumpur',
        additionalNotes: 'High-rise building project'
      })
    });

    const data = await response.json();
    console.log('Cost Estimator Response:', data);
  } catch (error) {
    console.error('Error testing cost estimator:', error);
  }
}

testCostEstimator();