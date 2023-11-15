async ({request}) => {
  for (let i = 0; i < 10; i++) {
    await request.get('http://localhost:8080/health/live')
  }
}
