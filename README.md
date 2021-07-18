# NBroadcast
Crazy fast broadcast message.
[Example Site](https://nbroadcast.deno.dev/sample/live-news)

## Usage listen message
```js
const evtSource = new EventSource("https://nbroadcast.deno.dev/<KEY>/<CHANNEL_NAME>");
evtSource.onmessage = function (event) {
    const data = JSON.parse(event.data);
    console.log(data)
}
```

## Usage send message
```js
fetch("https://nbroadcast.deno.dev/<KEY>/<CHANNEL_NAME>", {
    method: "POST",
    body: JSON.stringify(yourdata)
})
.then(data => data.json)
.then((data) => {
    console.log(data)    
})
.catch((err) => {
    console.log(err)
}); 
```