# 📝 TPC1

In this TPC the objective was to host an *http server* using **nodejs** to serve *html content* that displayed the information read from a **json-server** via **axios node package**.

## Author
<p><strong>Name:</strong> Fábio Magalhães</p>
<p><strong>Number:</strong> A104365</p>

## Results
The code shows a high capacity of error handling and content serving.

Firstly we need to have installed the node json-server:
```bash
npm install -g json-server
```

and use, to start the json-server on `port 3000`:
```bash
npm run json-server
```

Next we need to pick the given json file for this TPC and parse it into a better format for the json-server. That can be achieved using:
```bash
npm run json
```

And finally to start and check the web page served via nodejs and http server we can use:
```bash
npm start
```

## Assets
![](https://i.imgur.com/uq0ssOD.png)
![](https://i.imgur.com/6SKWjx5.png)
