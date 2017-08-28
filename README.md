# serverless-medium-transcript

Serverless-based, text-to-speech service for Medium articles.

![Infrastructure Diagram](/assets/infra.png?raw=true "Infrastructure Diagram")

## Prerequisities:
- Node.js > 6
- Serverless Framework

## Setup and deployment

Downloading project:

```
git clone https://github.com/RafalWilinski/serverless-medium-speech
cd serverless-medium-speech
npm install
```

To run project in development mode, locally:

```
npm run dev
```

Deploy to AWS Lambda:
```
sls deploy
```

## Usage & Example
```bash
curl -X POST \
  https://bt1wb4iwpf.execute-api.us-east-1.amazonaws.com/dev/transcode \
  -d '{
	"href": "https://medium.com/the-mission/11-reasons-i-sacrifice-money-to-work-wherever-i-want-21e9ce36f2b"
}'
```

## License
MIT Licensed. Copyright (c) Rafal Wilinski 2017.
