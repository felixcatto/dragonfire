import getApp from '../main';

describe('requests', () => {
  let server;

  beforeAll(() => {
    server = getApp();
  });

  it('GET 200', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/',
    });
    expect(res.statusCode).toBe(200);
  });

  afterAll(async () => {
    await server.close();
  });
});
