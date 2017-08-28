const { spawn } = require("child_process");
const create = require("s3-website").s3site;

const domain = process.env.BUCKET || "medium-speech"; // Probably taken, change to something else
const region = process.env.REGION || "us-east-1";

create(
  {
    region,
    index: "index.html",
    error: "index.html",
    domain
  },
  (err, website) => {
    if (err) {
      throw err;
    }

    console.log("Bucket created!");

    const cmd = spawn("aws", [
      "s3",
      "sync",
      "./build",
      "s3://medium-speech",
      "--acl",
      "public-read"
    ]);

    cmd.stdout.on("data", data => {
      console.log(`STDOUT: ${data}`);
    });

    cmd.stderr.on("data", data => {
      console.log(`ERR: ${data}`);
    });

    cmd.on("close", code => {
      console.log(
        "Deployment complete!",
        `http://${domain}.s3.amazonaws.com/index.html`
      );
    });
  }
);
