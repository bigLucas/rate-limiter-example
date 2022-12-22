<h1 align="center" ><strong>Rate limiter example</strong></h1>


This project is a back-end API with an example of rate limiter implemented using NestJS.

The implementation was based on this Redis article: https://developer.redis.com/develop/dotnet/aspnetcore/rate-limiting/sliding-window/

## **Tools used**
### Node
- Installation guide: https://nodejs.org/en/download/package-manager/
    - For ubuntu: https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions
- Getting started: https://nodejs.org/en/docs/guides/getting-started-guide/

### Other tools/libraries
- NestJS: https://docs.nestjs.com/first-steps
- Docker: https://www.docker.com/

## **Macro architecture**
<img src="images/macro-architecture.png" alt="macro-architecture" style="display:block; margin-left:auto; margin-right:auto; width: auto">

Text

<img src="images/macro-architecture_detail.png" alt="macro-architecture_detail" style="display:block; margin-left:auto; margin-right:auto; width: auto">

Text

## **How to run locally?**

<ol>
  <li>To run the code locally we need to have at least the <code>Node.js 16</code> and the <code>npm</code> tool installed in our system.</li>
  <li>Install the dependencies with <code>npm i</code> or <code>yarn</code> and choose one of the next options (Using Node.js or Using docker).</li>
  <li>Create a <code>.env</code> file from the <code>.env.example</code> file and add the right credentials.</li>
</ol>

### Using Node.js
It's possible to run direct with the `Node.js` CLI.
```bash
npm start
```
It's also possible to run in watch model.
```bash
npm run start:dev
```
**We can check the available routes by accessing the** `localhost:3000/doc` **address**.

### Using docker
To run on a container we need to have the docker installed.

<ol>
  <li><code>docker build -t rate-limiter-example .</code></li>
  <li><code>docker run -d -p 3000:3000</code></li>
</ol>

#### Notes
- The `-d` on `docker run` command means detach terminal mode. If you want to see the logs of the container you can remove this option or use `docker logs -f $container_id`.
- **Useful** command:
    ```bash
    docker stop $container_id && \
    docker build -t rate-limiter-example . && \
    container_id=$(docker run -d -p 3000:3000 -p 9229:9229  rate-limiter-example) && \
    echo $container_id && \
    docker logs -f $container_id
    ```

## **Database**
