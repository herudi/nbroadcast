import {
  Handler,
  NHttp,
  RequestEvent,
} from "https://deno.land/x/nhttp@0.7.5/mod.ts";

const fetch_url = new URL("client", import.meta.url).href;
// const fetch_url = "https://raw.githubusercontent.com/herudi/nbroadcast/master/client";

const generateId = (len?: number) => {
  const arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (val) => val.toString(16).padStart(2, "0")).join("");
};

const initApp: Handler = ({ response }, next) => {
  response.header({
    "Access-Control-Allow-Origin": "*",
    "X-Powered-By": "NHttp Deno",
  });
  next();
};

const validateKey: Handler = ({ params }, next) => {
  if (params.key.length !== 40) {
    throw new Error("Key not valid. please generate key first.");
  }
  next();
};

const fetchFile = async (
  { response, request }: RequestEvent,
  filename: string,
  cType: string,
) => {
  const res = await fetch(fetch_url + "/" + filename);
  if (!res.ok) {
    return response.status(404).send({
      status: 404,
      message: "Not Found",
    });
  }
  const headers = response.header();
  if (res.headers.get("ETag")) {
    headers.set("ETag", res.headers.get("ETag") || "");
    if (request.headers.get("if-none-match") === headers.get("ETag")) {
      return response.status(304).send();
    }
  }
  headers.set("content-type", cType);
  const text = await res.text();
  return response.header(headers).send(text);
};

const app = new NHttp();

app
  .use(initApp)
  .get("/", (rev) => {
    fetchFile(rev, "index.html", "text/html");
  })
  .get("/generate-key", ({ response }) => {
    const key = generateId();
    response.json({ key });
  })
  .get("/sample/live-news", (rev) => {
    fetchFile(rev, "live-news.html", "text/html");
  })
  .get("/:key/:channel", validateKey, ({ response, params }) => {
    const channel = new BroadcastChannel(params.key + params.channel);
    const stream = new ReadableStream({
      start: (ctrl) => {
        channel.onmessage = (e) => {
          ctrl.enqueue(`data: ${JSON.stringify(e.data)}\n\n`);
        };
      },
      cancel() {
        channel.close();
      },
    });
    response.header({
      "Connection": "Keep-Alive",
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Keep-Alive": `timeout=${Number.MAX_SAFE_INTEGER}`,
    }).send(stream.pipeThrough(new TextEncoderStream()));
  })
  .post("/:key/:channel", validateKey, ({ response, body, params }) => {
    const channel = new BroadcastChannel(params.key + params.channel);
    channel.postMessage(body);
    response.status(201).json({
      status: 201,
      message: "success send broadcast to " + params.channel,
      data: body,
    });
  });

addEventListener("fetch", app.fetchEventHandler());
