<h1 align="center" ><strong>Rate limiter example</strong></h1>


This project is a back-end API with an example of rate limiter implemented using NestJS. The implementation was based on this **Redis** article: https://developer.redis.com/develop/dotnet/aspnetcore/rate-limiting/sliding-window/

## **Tools used**
### Node
- Installation guide: https://nodejs.org/en/download/package-manager/
    - For ubuntu: https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions
- Getting started: https://nodejs.org/en/docs/guides/getting-started-guide/

### Other tools/libraries
- NestJS: https://docs.nestjs.com/first-steps
- Docker: https://www.docker.com/
- Redis: https://redis.io/

## **Macro architecture**

The rate limiter is in the middleware layer that is before the controller layer. The rate limiter code will get the request and check how many request the token or IP has.

<img src="images/macro-architecture.png" alt="macro-architecture" style="display:block; margin-left:auto; margin-right:auto; width: auto">

It uses the rate limiter service and inside the service layer there is the redis client. The code is using a [sorted set data structure](https://redis.io/docs/data-types/sorted-sets/) to track the requests and manage the sliding window.

<img src="images/redis-sorted-set.png" alt="redis-sorted-set" style="display:block; margin-left:auto; margin-right:auto; width: auto">

Each member of a sorted set must be unique and each member will have a score, if two members have the same score, redis will decide which will come first by the member value.

The rate limiter service is also setting a expiration time for each member, so we can use the redis TTL to clean the old data.

## **How to run locally?**

<ol>
  <li>To run the code locally we need to have at least the <code>Node.js 16</code> and the <code>npm</code> tool installed in our system.</li>
  <li>Install the dependencies with <code>npm i</code> or <code>yarn</code> and choose one of the next options (Using Node.js or Using docker).</li>
  <li>Create a <code>.env</code> file from the <code>.env.example</code> file and add the right credentials.</li>
</ol>

### Using Node.js
```bash
npm i
```
Use the start command.
```bash
npm start
```
It's also possible to run in watch model.
```bash
npm run start:dev
```
The database used by the rate limiter is the redis, we can use the docker image to get a redis DB running quickly.
```bash
docker run -d -p 6379:6379 redis
```

### Using docker
To run on a container we need to have the **docker** installed.

<ol>
  <li><code>docker build -t rate-limiter-example . --network host</code></li>
  <li><code>docker run -d -p 3000:3000 --network="host" rate-limiter-example && docker run -d -p 6379:6379 redis</code></li>
</ol>

The Dockerfile is copying the local `.env` file to the final image.

#### Notes
- The `-d` on `docker run` command means detach terminal mode. If you want to see the logs of the container you can remove this option or use `docker logs -f $container_id`.

## **Curls to test the server**
- Call the `private` route passing the token/UUID:
  ```bash
  curl "localhost:3000/private" -H 'Authorization:Bearer cc80bf47-fbbd-4cd1-8aa9-cf669adda2b3'
  ```
- Or, call the `public` route passing the IP:
  ```bash
  curl "localhost:3000/public" -H 'X-Forwarded-For:192.0.0.1'
  ```
We can set the limits and the window size in the `.env` file.
```text
UUID_TOKEN=cc80bf47-fbbd-4cd1-8aa9-cf669adda2b3
RATE_LIMITING_WINDOW_IN_SECONDS=3600
PUBLIC_RATE_LIMIT=100
PRIVATE_RATE_LIMIT=200
```
