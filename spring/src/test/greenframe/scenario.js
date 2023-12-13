async ({request}) => {
  // Execute some requests for some time. The exact requests are irrelevant. The actual load is generated
  // in a separate load test via K6.
  for (let i = 0; i < 10; i++) {
    await request.get('http://localhost:8080/api/management/health/liveness')
  }
}
